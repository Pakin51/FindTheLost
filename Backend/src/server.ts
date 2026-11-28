import express, { type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { prisma } from "./lib/prisma.js";
import { Category, ReportStatus } from "@prisma/client";
import { z } from "zod";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); 
app.use(express.json());

// ---------- Helpers: validation & error handling ----------

// แปลง :id จาก URL เป็นเลขจำนวนเต็มบวก (คืน null ถ้าไม่ถูกต้อง)
function parseId(value: unknown): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// ดึง error code ของ Prisma (เช่น P2025 = ไม่พบข้อมูล, P2003 = Foreign key ไม่ถูกต้อง)
function prismaErrorCode(error: unknown): string | undefined {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = (error as { code: unknown }).code;
    return typeof code === "string" ? code : undefined;
  }
  return undefined;
}

// รวมข้อความ error ของ zod ให้อ่านง่าย
function formatZodError(error: z.ZodError): string[] {
  return error.issues.map((i) => `${i.path.join(".") || "body"}: ${i.message}`);
}

const optionalUrl = z
  .union([z.url({ message: "ต้องเป็น URL ที่ถูกต้อง" }), z.literal("")])
  .nullish();

// Schema สำหรับแก้ไขรายการแจ้งหาย (PUT = ส่งข้อมูลครบทุกฟิลด์)
const updateReportSchema = z.object({
  title: z.string().trim().min(1, "กรุณากรอกชื่อ").max(150, "ยาวเกิน 150 ตัวอักษร"),
  category: z.enum(["PERSON", "PET", "ITEM"]),
  lostDate: z.coerce.date({ message: "วันที่ไม่ถูกต้อง" }),
  description: z.string().trim().min(1, "กรุณากรอกรายละเอียด").max(2000, "ยาวเกิน 2000 ตัวอักษร"),
  lastSeenLocation: z.string().trim().min(1, "กรุณากรอกสถานที่").max(300, "ยาวเกิน 300 ตัวอักษร"),
  contactTel: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{6,20}$/, "เบอร์โทรไม่ถูกต้อง"),
  imageUrl: optionalUrl,
});

// Schema สำหรับส่งเบาะแส
const createClueSchema = z.object({
  message: z.string().trim().min(1, "กรุณากรอกข้อความเบาะแส").max(1000, "ยาวเกิน 1000 ตัวอักษร"),
  location: z.string().trim().max(300, "ยาวเกิน 300 ตัวอักษร").nullish(),
  imageUrl: optionalUrl,
  reportId: z.coerce.number().int().positive(),
  userId: z.coerce.number().int().positive(),
});

// 1. Health Check Endpoint
app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "FindTheLost API Server running!",
    endpoints: {
      reports: "/api/reports",
      clues: "/api/clues",
      auth: "/api/auth",
      users: "/api/users",
    },
  });
});

// 2. Lost Reports

// 2.1 ดึงรายการแจ้งหายทั้งหมด (รองรับ Filter: category, status, search)
app.get("/api/reports", async (req: Request, res: Response) => {
  try {
    const { category, status, search } = req.query;

    const whereCondition: any = {};

    // กรองตามประเภท (PERSON, PET, ITEM)
    if (category && typeof category === "string") {
      whereCondition.category = category.toUpperCase() as Category;
    }

    // กรองตามสถานะ (LOST, FOUND)
    if (status && typeof status === "string") {
      whereCondition.status = status.toUpperCase() as ReportStatus;
    }

    // ค้นหาตามคำ (ค้นจากชื่อ, รายละเอียด, หรือสถานที่)
    if (search && typeof search === "string") {
      whereCondition.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { lastSeenLocation: { contains: search, mode: "insensitive" } },
      ];
    }

    const reports = await prisma.lostReport.findMany({
      where: whereCondition,
      include: {
        user: {
          select: { id: true, name: true, tel: true },
        },
        _count: {
          select: { clues: true }, // นับจำนวนเบาะแสทั้งหมดของเคสนี้
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
  }
});

// 2.2 ดึงรายละเอียดของรายการแจ้งหายตาม ID (รวมเบาะแสทั้งหมด)
app.get("/api/reports/:id", async (req: Request, res: Response) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) {
      return res.status(400).json({ success: false, message: "ID ไม่ถูกต้อง" });
    }

    const report = await prisma.lostReport.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true, tel: true },
        },
        clues: {
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: "desc" }, // เบาะแสล่าสุดขึ้นก่อน
        },
      },
    });

    if (!report) {
      return res.status(404).json({ success: false, message: "ไม่พบข้อมูลที่ระบุ" });
    }

    res.json({ success: true, data: report });
  } catch (error) {
    console.error("Error fetching report detail:", error);
    res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
  }
});

// 2.3 สร้างโพสต์แจ้งหายใหม่
app.post("/api/reports", async (req: Request, res: Response) => {
  try {
    const {
      title,
      category,
      lostDate,
      description,
      lastSeenLocation,
      contactTel,
      imageUrl,
      userId,
    } = req.body;

    // ตรวจสอบความถูกต้องของข้อมูลเบื้องต้น
    if (!title || !category || !lostDate || !description || !lastSeenLocation || !contactTel || !userId) {
      return res.status(400).json({
        success: false,
        message: "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน (title, category, lostDate, description, lastSeenLocation, contactTel, userId)",
      });
    }

    const newReport = await prisma.lostReport.create({
      data: {
        title,
        category: category.toUpperCase() as Category,
        lostDate: new Date(lostDate),
        description,
        lastSeenLocation,
        contactTel,
        imageUrl: imageUrl || null,
        userId: Number(userId),
        status: ReportStatus.LOST,
      },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "สร้างรายการแจ้งหายเรียบร้อยแล้ว",
      data: newReport,
    });
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดในการสร้างรายการ" });
  }
});

// 2.4 อัปเดตสถานะ (เช่น LOST -> FOUND พบแล้ว หรือปิดเคส)
app.patch("/api/reports/:id/status", async (req: Request, res: Response) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) {
      return res.status(400).json({ success: false, message: "ID ไม่ถูกต้อง" });
    }

    const status = typeof req.body?.status === "string" ? req.body.status.toUpperCase() : "";
    if (!Object.values(ReportStatus).includes(status as ReportStatus)) {
      return res.status(400).json({
        success: false,
        message: "สถานะไม่ถูกต้อง (ต้องเป็น LOST หรือ FOUND)",
      });
    }

    const updated = await prisma.lostReport.update({
      where: { id },
      data: { status: status as ReportStatus },
    });

    res.json({
      success: true,
      message: "อัปเดตสถานะเรียบร้อยแล้ว",
      data: updated,
    });
  } catch (error) {
    if (prismaErrorCode(error) === "P2025") {
      return res.status(404).json({ success: false, message: "ไม่พบข้อมูลที่ระบุ" });
    }
    console.error("Error updating status:", error);
    res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดในการอัปเดตสถานะ" });
  }
});

// 2.5 แก้ไขข้อมูลรายการแจ้งหาย (PUT)
app.put("/api/reports/:id", async (req: Request, res: Response) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) {
      return res.status(400).json({ success: false, message: "ID ไม่ถูกต้อง" });
    }

    const parsed = updateReportSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "ข้อมูลไม่ถูกต้อง",
        errors: formatZodError(parsed.error),
      });
    }
    const body = parsed.data;

    const updated = await prisma.lostReport.update({
      where: { id },
      data: {
        title: body.title,
        category: body.category as Category,
        lostDate: body.lostDate,
        description: body.description,
        lastSeenLocation: body.lastSeenLocation,
        contactTel: body.contactTel,
        imageUrl: body.imageUrl || null,
      },
    });

    res.json({ success: true, message: "แก้ไขรายการเรียบร้อยแล้ว", data: updated });
  } catch (error) {
    if (prismaErrorCode(error) === "P2025") {
      return res.status(404).json({ success: false, message: "ไม่พบข้อมูลที่ระบุ" });
    }
    console.error("Error updating report:", error);
    res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดในการแก้ไขรายการ" });
  }
});

// 2.6 ลบรายการแจ้งหาย (เบาะแสที่เกี่ยวข้องถูกลบตาม onDelete: Cascade)
app.delete("/api/reports/:id", async (req: Request, res: Response) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) {
      return res.status(400).json({ success: false, message: "ID ไม่ถูกต้อง" });
    }

    await prisma.lostReport.delete({ where: { id } });
    res.json({ success: true, message: "ลบรายการเรียบร้อยแล้ว" });
  } catch (error) {
    if (prismaErrorCode(error) === "P2025") {
      return res.status(404).json({ success: false, message: "ไม่พบข้อมูลที่ระบุ" });
    }
    console.error("Error deleting report:", error);
    res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดในการลบรายการ" });
  }
});

// 3. หมวด: แจ้งเบาะแส (Clues / Tips)

// 3.1 ส่งข้อมูลเบาะแสใหม่ให้กับเคส
app.post("/api/clues", async (req: Request, res: Response) => {
  try {
    const parsed = createClueSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "ข้อมูลไม่ถูกต้อง",
        errors: formatZodError(parsed.error),
      });
    }
    const { message, imageUrl, location, reportId, userId } = parsed.data;

    // เคสที่พบแล้วจะปิดรับเบาะแส (ต้องเปิดเคสอีกครั้งก่อนจึงจะส่งได้)
    const targetReport = await prisma.lostReport.findUnique({
      where: { id: reportId },
      select: { status: true },
    });
    if (!targetReport) {
      return res.status(404).json({ success: false, message: "ไม่พบรายการแจ้งหายที่ระบุ" });
    }
    if (targetReport.status === ReportStatus.FOUND) {
      return res.status(409).json({
        success: false,
        message: "เคสนี้พบแล้ว จึงปิดรับเบาะแส",
      });
    }

    const newClue = await prisma.clue.create({
      data: {
        message,
        imageUrl: imageUrl || null,
        location: location || null,
        reportId,
        userId,
      },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "ส่งข้อมูลเบาะแสเรียบร้อยแล้ว",
      data: newClue,
    });
  } catch (error) {
    // P2003 = reportId หรือ userId ไม่มีอยู่จริง (Foreign key constraint)
    if (prismaErrorCode(error) === "P2003") {
      return res.status(404).json({ success: false, message: "ไม่พบรายการแจ้งหายหรือผู้ใช้ที่ระบุ" });
    }
    console.error("Error creating clue:", error);
    res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดในการบันทึกเบาะแส" });
  }
});

// 3.2 ลบเบาะแส
app.delete("/api/clues/:id", async (req: Request, res: Response) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) {
      return res.status(400).json({ success: false, message: "ID ไม่ถูกต้อง" });
    }

    await prisma.clue.delete({ where: { id } });
    res.json({ success: true, message: "ลบเบาะแสเรียบร้อยแล้ว" });
  } catch (error) {
    if (prismaErrorCode(error) === "P2025") {
      return res.status(404).json({ success: false, message: "ไม่พบเบาะแสที่ระบุ" });
    }
    console.error("Error deleting clue:", error);
    res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดในการลบเบาะแส" });
  }
});

// 4. หมวด: ระบบประวัติ (History)

// 4.1 ดูประวัติของ User: เบาะแสที่ตัวเองเคยแจ้ง + รายการที่ตัวเองเคยแจ้งหาย
app.get("/api/users/:userId/history", async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ success: false, message: "User ID ไม่ถูกต้อง" });
    }

    // 1. เบาะแสที่ user คนนี้เคยไปแจ้งไว้
    const myClues = await prisma.clue.findMany({
  where: {
    userId,
    report: { userId: { not: userId } }, // เฉพาะเคสของคนอื่น
  },
  include: {
    report: {
      select: {
        id: true,
        title: true,
        category: true,
        status: true,
        imageUrl: true,
        lastSeenLocation: true,
      },
    },
  },
  orderBy: { createdAt: "desc" },
});

    // 2. โพสต์แจ้งหายที่ user คนนี้เป็นคนสร้าง
    const myReports = await prisma.lostReport.findMany({
      where: { userId },
      include: {
        _count: { select: { clues: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      data: {
        cluesHistory: myClues,
        reportsHistory: myReports,
      },
    });
  } catch (error) {
    console.error("Error fetching user history:", error);
    res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดในการดึงข้อมูลประวัติ" });
  }
});




// 5. หมวด: ระบบผู้ใช้และการยืนยันตัวตน (Auth / Users)

// 5.1 สมัครสมาชิก (Register)
app.post("/api/auth/register", async (req: Request, res: Response) => {
  try {
    const { email, password, name, tel } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "กรุณากรอก email, password และ name",
      });
    }

    // ตรวจสอบว่า email ซ้ำหรือไม่
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "อีเมลนี้มีผู้ใช้งานแล้ว" });
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        password, // สามารถใช้ bcrypt.hash(password, 10) เพิ่มเติมได้
        name,
        tel: tel || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        tel: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "ลงทะเบียนสำเร็จ",
      data: newUser,
    });
  } catch (error) {
    console.error("Error register:", error);
    res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดในการลงทะเบียน" });
  }
});

// 5.2 เข้าสู่ระบบ (Login)
app.post("/api/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "กรุณากรอก email และ password",
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
      });
    }

    res.json({
      success: true,
      message: "เข้าสู่ระบบสำเร็จ",
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        tel: user.tel,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error login:", error);
    res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" });
  }
});

// 5.3 ดูรายชื่อผู้ใช้ทั้งหมด (สำหรับทดสอบ)
app.get("/api/users", async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        tel: true,
        role: true,
        _count: {
          select: { reports: true, clues: true },
        },
      },
    });
    res.json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "เกิดข้อผิดพลาด" });
  }
});

// เริ่มต้นเปิด Server
app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}`);
});
