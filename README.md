# FindTheLost

ระบบเว็บแอปพลิเคชันสำหรับแจ้งคนหาย สัตว์เลี้ยงหาย และสิ่งของสูญหาย (Lost and Found Platform) เพื่อเป็นศูนย์กลางในการช่วยเหลือ ส่งต่อข้อมูล และแจ้งเบาะแสระหว่างผู้ใช้งาน

---

## ฟังก์ชันการทำงานหลัก

1. ระบบจัดการผู้ใช้และการยืนยันตัวตน (Authentication)
   - ลงทะเบียน (Register) และเข้าสู่ระบบ (Login)
   - ระบุตัวตนของผู้แจ้งหายและผู้แจ้งเบาะแส
   - จัดการสิทธิ์การใช้งานผ่าน Role (USER, ADMIN)

2. ระบบแจ้งหาย (Lost Reports)
   - รองรับการแจ้ง 3 ประเภท: คน (PERSON), สัตว์เลี้ยง (PET), สิ่งของ (ITEM)
   - บันทึกข้อมูลสำคัญ: ชื่อ, ประเภท, วันที่หาย, รายละเอียด, สถานที่พบเห็นล่าสุด, เบอร์โทรติดต่อ, ลิงก์รูปภาพ
   - จัดการสถานะเคส: กำลังตามหา (LOST), พบแล้ว/ปิดเคส (FOUND)
   - หน้าแสดงรายละเอียดเคส (Report Detail Page): แสดงข้อมูลครบถ้วน, ลิงก์เบอร์โทรศัพท์เพื่อโทรออกได้ทันที, ฟังก์ชันแก้ไขข้อมูล และฟังก์ชันลบเคส

3. ระบบแจ้งเบาะแส (Clues / Tips)
   - ผู้ใช้สามารถส่งข้อความเบาะแส สถานที่พบเห็น และรูปถ่ายหลักฐานยืนยัน
   - ระบบป้องกันการส่งเบาะแสซ้ำหากเคสดังกล่าวปิดรับเบาะแสแล้ว (สถานะพบแล้ว)
   - แสดงรายการเบาะแสเรียงตามเวลาล่าสุด พร้อมฟังก์ชันลบเบาะแส

4. ระบบประวัติ (History)
   - ผู้ใช้สามารถตรวจสอบประวัติเบาะแสทั้งหมดที่ตนเองเคยส่งได้
   - ตรวจสอบรายการที่ตนเองเคยโพสต์แจ้งหายไว้

---

## เทคโนโลยีที่ใช้ (Tech Stack)

### Backend
- Node.js (Runtime Environment)
- Express.js (RESTful API Framework)
- TypeScript (Language)
- Prisma ORM (Database ORM)
- PostgreSQL / Supabase (Relational Database)
- Zod (Request Validation & Schema Checking)

### Frontend
- React 19
- React Router v7 (Client-side Routing)
- Vite (Build Tool & Dev Server)
- Tailwind CSS v4 (Styling)
- TanStack Query v5 (Data Fetching & Caching)
- Zustand (State Management)
- Lucide React (Icons)

---

## โครงสร้างโปรเจกต์ (Project Structure)

```text
FindTheLost/
├── Backend/
│   ├── prisma/
│   │   ├── schema.prisma      # กำหนดโครงสร้างตารางและ Enums
│   │   └── seed.ts            # จำลองข้อมูล Mock Data 40 รายการ
│   ├── src/
│   │   ├── lib/
│   │   │   └── prisma.ts      # กำหนดการเชื่อมต่อ Prisma Client และ Pg Pool
│   │   └── server.ts          # Express REST API Server
│   ├── .env                   # ตัวแปรสภาพแวดล้อม (DATABASE_URL, DIRECT_URL)
│   ├── prisma7.config.ts      # การตั้งค่า Prisma 7
│   ├── tsconfig.json
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── report/
│   │   │   │   ├── ClueCard.tsx       # การ์ดแสดงข้อมูลเบาะแส
│   │   │   │   ├── ClueForm.tsx       # ฟอร์มส่งเบาะแสใหม่
│   │   │   │   ├── EditReportForm.tsx # ฟอร์มแก้ไขรายละเอียดเคส
│   │   │   │   ├── ErrorNotice.tsx    # แจ้งเตือนข้อผิดพลาด
│   │   │   │   ├── Photo.tsx          # แสดงผลรูปภาพพร้อม Placeholder
│   │   │   │   └── utils.ts           # ฟังก์ชันจัดรูปแบบวันเวลาและสไตล์
│   │   │   ├── Navbar.tsx             # แถบเมนูด้านบนและช่องค้นหา
│   │   │   ├── Sidebar.tsx            # เมนูด้านข้าง (Dashboard, My Lost, History)
│   │   │   ├── Layout.tsx             # โครงหน้าเว็บหลัก (Layout Wrapper)
│   │   │   ├── HeroBanner.tsx         # แบนเนอร์แนะนำระบบและปุ่มแจ้งหาย
│   │   │   ├── ReportCard.tsx         # การ์ดแสดงรายการของหายหน้าแรก
│   │   │   ├── ReportSection.tsx      # ส่วนแสดงรายการแยกหมวดหมู่และปุ่มแสดงเพิ่มเติม
│   │   │   ├── ReportDetailPage.tsx   # หน้ารายละเอียดเคสและรายการเบาะแส
│   │   │   ├── Dashboard.tsx          # หน้าหลักแดชบอร์ด
│   │   │   └── NotFoundPage.tsx       # หน้าแจ้งเตือนกรณีไม่พบ URL (404)
│   │   ├── hooks/
│   │   │   ├── useReportMutations.ts  # React Query Mutations สำหรับเคสและเบาะแส
│   │   │   └── useUsers.ts            # Hook ดึงรายชื่อผู้ใช้
│   │   ├── services/
│   │   │   └── api.ts                 # ฟังก์ชันเชื่อมต่อกับ Backend API
│   │   ├── types/
│   │   │   └── index.ts               # TypeScript Interfaces
│   │   ├── App.tsx                    # กำหนดเส้นทาง URL (Routes)
│   │   ├── main.tsx                   # จุดเริ่มต้นแอปและ Router Provider
│   │   └── index.css
│   ├── vite.config.ts
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## การติดตั้งและการเริ่มใช้งาน (Getting Started)

### 1. ความต้องการของระบบ (Prerequisites)
- Node.js เวอร์ชั่น 18 หรือใหม่กว่า
- บัญชีฐานข้อมูล PostgreSQL (เช่น Supabase)

### 2. ติดตั้งและตั้งค่า Backend

1. เข้าสู่โฟลเดอร์ Backend และติดตั้ง Dependencies:
   ```bash
   cd Backend
   npm install
   ```

2. สร้างไฟล์ `.env` ในโฟลเดอร์ `Backend/` โดยระบุค่า Connection String:
   ```env
   PORT=3000
   DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-1-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-1-[REGION].pooler.supabase.com:5432/postgres"
   ```

3. ซิงค์โครงสร้างตารางขึ้นฐานข้อมูล:
   ```bash
   npx prisma db push
   ```

4. นำเข้าข้อมูลจำลอง (Mock Data 40 รายการ):
   ```bash
   npx prisma db seed
   ```

5. เริ่มต้นรันเซิร์ฟเวอร์ Backend:
   ```bash
   npm run dev
   ```
   เซิร์ฟเวอร์จะเริ่มทำงานที่ `http://localhost:3000`

---

### 3. ติดตั้งและตั้งค่า Frontend

1. เปิด Terminal ใหม่ เข้าสู่โฟลเดอร์ Frontend และติดตั้ง Dependencies:
   ```bash
   cd Frontend
   npm install
   ```

2. เริ่มต้นรัน Frontend Dev Server:
   ```bash
   npm run dev
   ```
   เปิดเบราว์เซอร์และเข้าไปที่ URL ที่แสดงบนหน้าจอ (เช่น `http://localhost:5173`)

---

## รายการ API Endpoints (REST API Reference)

| Method | Endpoint | รายละเอียด |
| :--- | :--- | :--- |
| GET | `/api/reports` | ดึงรายการแจ้งหายทั้งหมด (รองรับ Filter: `category`, `status`, `search`) |
| GET | `/api/reports/:id` | ดึงรายละเอียดเคสพร้อมรายการเบาะแสทั้งหมด |
| POST | `/api/reports` | บันทึกการแจ้งหายใหม่ |
| PUT | `/api/reports/:id` | แก้ไขข้อมูลการแจ้งหาย |
| PATCH | `/api/reports/:id/status` | อัปเดตสถานะของเคส (`LOST` หรือ `FOUND`) |
| DELETE | `/api/reports/:id` | ลบรายการแจ้งหายพร้อมเบาะแสที่เกี่ยวข้อง |
| POST | `/api/clues` | ส่งเบาะแสให้กับเคส (ตรวจสอบสถานะว่าปิดเคสแล้วหรือไม่) |
| DELETE | `/api/clues/:id` | ลบข้อมูลเบาะแส |
| GET | `/api/users/:userId/history` | ดึงประวัติเบาะแสและโพสต์ของผู้ใช้ |
| POST | `/api/auth/register` | สมัครสมาชิกผู้ใช้ใหม่ |
| POST | `/api/auth/login` | เข้าสู่ระบบ |
| GET | `/api/users` | ดึงรายชื่อผู้ใช้ทั้งหมด |

---

## โครงสร้างฐานข้อมูล (Database Schema)

- **User**: จัดเก็บข้อมูลผู้ใช้งาน (`id`, `email`, `password`, `name`, `tel`, `role`, `createdAt`)
- **LostReport**: จัดเก็บข้อมูลการแจ้งหาย (`id`, `title`, `category`, `lostDate`, `description`, `lastSeenLocation`, `contactTel`, `imageUrl`, `status`, `userId`, `createdAt`)
- **Clue**: จัดเก็บเบาะแส (`id`, `message`, `imageUrl`, `location`, `reportId`, `userId`, `createdAt`)
- **Enums**:
  - `Role`: `USER`, `ADMIN`
  - `Category`: `PERSON`, `PET`, `ITEM`
  - `ReportStatus`: `LOST`, `FOUND`
