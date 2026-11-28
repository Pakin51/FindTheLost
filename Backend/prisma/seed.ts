/**
 * ============================================================================
 * ไฟล์: prisma/seed.ts
 * คำอธิบาย: สคริปต์สำหรับจำลองข้อมูลเริ่มต้น (Mock Data / Seed Data) สำหรับ FindTheLost
 * มีรายการของหาย 40 รายการ (คน, สัตว์, สิ่งของ) พร้อม Users และ Clues
 * ============================================================================
 */

import { PrismaClient, Role, Category, ReportStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.clue.deleteMany();
  await prisma.lostReport.deleteMany();
  await prisma.user.deleteMany();

  // Seed Mock User
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@findthelost.com",
      password: "admin", // Mock hash
      name: "ผู้ดูแลระบบ (Admin)",
      tel: "02-999-9999",
      role: Role.ADMIN,
    },
  });

  const somchai = await prisma.user.create({
    data: {
      email: "somchai@gmail.com",
      password: "somchai",
      name: "สมชาย ใจดี",
      tel: "081-234-5678",
      role: Role.USER,
    },
  });

  const kanya = await prisma.user.create({
    data: {
      email: "kanya.s@gmail.com",
      password: "kanya",
      name: "กัญญา สุขสม",
      tel: "089-876-5432",
      role: Role.USER,
    },
  });

  const anan = await prisma.user.create({
    data: {
      email: "anan.bkk@gmail.com",
      password: "anan",
      name: "อนันต์ รักสงบ",
      tel: "086-555-4321",
      role: Role.USER,
    },
  });

  const userIds = [somchai.id, kanya.id, anan.id];

  // Seed Mock Reports
  const reportsData = [
    // PERSON
    {
      title: "คุณยายทองใบ วัย 78 ปี พลัดหลง",
      category: Category.PERSON,
      lostDate: new Date("2026-11-20T09:30:00Z"),
      description:
        "มีอาการหลงลืม สูงประมาณ 155 ซม. สวมเสื้อลายดอกสีฟ้า ผ้าถุงสีน้ำตาล ถือร่มสีเขียว",
      lastSeenLocation: "บริเวณตลาดสี่มุมเมือง รังสิต ปทุมธานี",
      contactTel: "081-234-5678",
      imageUrl:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
      status: ReportStatus.LOST,
      userId: somchai.id,
    },
    {
      title: "เด็กชายกิตติศักดิ์ (น้องเติ้ล) อายุ 6 ขวบ",
      category: Category.PERSON,
      lostDate: new Date("2026-11-22T16:00:00Z"),
      description:
        "สูง 110 ซม. ผิวขาว ผมสั้น ใส่เสื้อยืดสีส้ม กางเกงขาสั้นสีดำ รองเท้าแตะลายสไปเดอร์แมน",
      lastSeenLocation: "สนามเด็กเล่น สวนจตุจักร กทม.",
      contactTel: "089-876-5432",
      imageUrl:
        "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=600&q=80",
      status: ReportStatus.LOST,
      userId: kanya.id,
    },
    {
      title: "คุณตาสมศักดิ์ วัย 82 ปี เดินออกจากบ้าน",
      category: Category.PERSON,
      lostDate: new Date("2026-11-18T07:15:00Z"),
      description:
        "ผมขาวทั้งศีรษะ รูปร่างผอม ใส่แว่นสายตากรอบดำ เสื้อเชิ้ตแขนสั้นสีขาว กางเกงสแล็คสีกรม",
      lastSeenLocation: "ซอยสุขุมวิท 101/1 แขวงบางจาก พระโขนง",
      contactTel: "086-555-4321",
      imageUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80",
      status: ReportStatus.LOST,
      userId: anan.id,
    },
    {
      title: "น้องมินท์ อายุ 15 ปี นักเรียน ม.3",
      category: Category.PERSON,
      lostDate: new Date("2026-11-21T18:00:00Z"),
      description:
        "สูง 160 ซม. ผมยาวประบ่า สะพายกระเป๋าเป้สีชมพู สวมชุดนักเรียน ติดต่อไม่ได้หลังเลิกเรียนพิเศษ",
      lastSeenLocation: "หน้าห้างสรรพสินค้าเซ็นทรัล ลาดพร้าว",
      contactTel: "081-234-5678",
      imageUrl:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
      status: ReportStatus.LOST,
      userId: somchai.id,
    },
    {
      title: "คุณวรพจน์ อายุ 45 ปี พลัดหลงขณะขึ้นรถเมล์",
      category: Category.PERSON,
      lostDate: new Date("2026-11-15T12:00:00Z"),
      description:
        "ผู้ป่วยมีภาวะดาวน์ซินโดรม พูดสื่อสารได้ช้า ใส่เสื้อยืดสีเทา กางเกงยีนส์ มีบัตรคนพิการคล้องคอ",
      lastSeenLocation: "ป้ายรถเมล์อนุสาวรีย์ชัยสมรภูมิ เกาะพญาไท",
      contactTel: "089-876-5432",
      imageUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      status: ReportStatus.FOUND, // พบแล้ว
      userId: kanya.id,
    },
    {
      title: "น้องโฟกัส อายุ 8 ขวบ พลัดหลงในงานวัด",
      category: Category.PERSON,
      lostDate: new Date("2026-11-23T20:30:00Z"),
      description:
        "ใส่เสื้อลายการ์ตูนโดราเอมอน กางเกงยีนส์ขาสั้น สวมหมวกแก๊ปสีแดง ผิวสองสี",
      lastSeenLocation: "บริเวณเวทีลิเก วัดไร่ขิง จ.นครปฐม",
      contactTel: "086-555-4321",
      imageUrl:
        "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80",
      status: ReportStatus.LOST,
      userId: anan.id,
    },
    {
      title: "นายประสิทธิ์ วัย 65 ปี มีอาการอัลไซเมอร์",
      category: Category.PERSON,
      lostDate: new Date("2026-11-19T14:40:00Z"),
      description:
        "ใส่เสื้อโปโลสีเขียวเข้ม กางเกงขาสามส่วนสีดำ เดินกะเผลกเล็กน้อย ถือถุงยาจาก รพ.",
      lastSeenLocation: "หน้าโรงพยาบาลศิริราช บางกอกน้อย",
      contactTel: "081-234-5678",
      imageUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
      status: ReportStatus.LOST,
      userId: somchai.id,
    },
    {
      title: "นักท่องเที่ยวชาวต่างชาติ (Mr. David) พลัดหลง",
      category: Category.PERSON,
      lostDate: new Date("2026-11-23T11:00:00Z"),
      description:
        "ชายชาวอังกฤษ อายุประมาณ 60 ปี สูง 185 ซม. ผมขาว เสื้อเชิ้ตฮาวายสีฟ้า กางเกงขาสั้นสีครีม",
      lastSeenLocation: "วัดพระแก้ว ถนนหน้าพระลาน พระนคร",
      contactTel: "089-876-5432",
      imageUrl:
        "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80",
      status: ReportStatus.FOUND, // พบแล้ว
      userId: kanya.id,
    },
    {
      title: "นางสมจิตต์ วัย 70 ปี เดินออกจากตลาดสด",
      category: Category.PERSON,
      lostDate: new Date("2026-11-24T06:30:00Z"),
      description:
        "ใส่เสื้อคอกระเช้าสีชมพู กางเกงขายาวสีดำ รูปร่างท้วม สวมรองเท้าแตะสีขาว",
      lastSeenLocation: "ตลาดสดเทศบาลเมืองปทุมธานี",
      contactTel: "086-555-4321",
      imageUrl:
        "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=600&q=80",
      status: ReportStatus.LOST,
      userId: anan.id,
    },
    {
      title: "น้องบิว อายุ 12 ขวบ ปั่นจักรยานออกจากบ้านแล้วไม่กลับ",
      category: Category.PERSON,
      lostDate: new Date("2026-11-22T17:30:00Z"),
      description:
        "จักรยานพับสีแดง สวมเสื้อยืดสีขาว กางเกงวอร์มสีน้ำเงิน สวมรองเท้าผ้าใบสีดำ",
      lastSeenLocation: "หมู่บ้านพฤกษา 3 บางบัวทอง นนทบุรี",
      contactTel: "081-234-5678",
      imageUrl:
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80",
      status: ReportStatus.LOST,
      userId: somchai.id,
    },

    // PET
    {
      title: "สุนัขพันธุ์โกลเด้น รีทรีฟเวอร์ ชื่อ 'นำโชค'",
      category: Category.PET,
      lostDate: new Date("2026-11-21T18:30:00Z"),
      description:
        "เพศผู้ อายุ 2 ปี ขนสีทองเงา สวมปลอกคอหนังสีแดง มีกระดิ่ง นิสัยเป็นมิตร ขี้เล่น",
      lastSeenLocation: "ซอยอารีย์สัมพันธ์ 1 พญาไท กทม.",
      contactTel: "081-234-5678",
      imageUrl:
        "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80",
      status: ReportStatus.LOST,
      userId: somchai.id,
    },
    {
      title: "แมวเปอร์เซียสีขาวล้วน ชื่อ 'น้องสโนว์'",
      category: Category.PET,
      lostDate: new Date("2026-11-20T10:00:00Z"),
      description:
        "เพศเมีย ตาสองสี (ฟ้ากับเหลือง) ขนฟูยาว เพิ่งทำหมันมา มีแผลตัดไหมที่หน้าท้องเล็กน้อย",
      lastSeenLocation: "คอนโดลุมพินี พระราม 9 แขวงห้วยขวาง",
      contactTel: "089-876-5432",
      imageUrl:
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80",
      status: ReportStatus.LOST,
      userId: kanya.id,
    },
    {
      title: "สุนัขพันธุ์ไซบีเรียน ฮัสกี้ ชื่อ 'โลกิ'",
      category: Category.PET,
      lostDate: new Date("2026-11-23T08:00:00Z"),
      description:
        "เพศผู้ สีเทา-ขาว ตาฟ้าคู่ รูปร่างสมส่วน หลุดวิ่งออกจากรั้วบ้านตอนเปิดประตูส่งพัสดุ",
      lastSeenLocation: "ถนนเลียบด่วนรามอินทรา ใกล้เซ็นทรัลอีสต์วิลล์",
      contactTel: "086-555-4321",
      imageUrl:
        "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80",
      status: ReportStatus.LOST,
      userId: anan.id,
    },
    {
      title: "นกแก้วซันคอนัวร์ ชื่อน้อง 'ซันนี่'",
      category: Category.PET,
      lostDate: new Date("2026-11-19T15:00:00Z"),
      description:
        "ลำตัวสีเหลือง-ส้ม-เขียว ใส่ห่วงขาสีเงิน รหัส TH-8822 เชื่องมาก ชอบเกาะไหล่คน",
      lastSeenLocation: "ตกใจเสียงฟ้าร้องบินหนีจากย่านบางแค เพชรเกษม",
      contactTel: "081-234-5678",
      imageUrl:
        "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80",
      status: ReportStatus.LOST,
      userId: somchai.id,
    },
    {
      title: "แมวส้มเพศผู้ หางกวัก ชื่อ 'เจ้าส้มจี๊ด'",
      category: Category.PET,
      lostDate: new Date("2026-11-17T21:00:00Z"),
      description:
        "ลายสลิดส้ม ลายพาดชัดเจน ปลายหางคดเล็กน้อย ตัวค่อนข้างอ้วน หนัก 5.5 กก. มีปลอกคอสีเขียวสะท้อนแสง",
      lastSeenLocation: "แฟลตคลองจั่น บางกะปิ กทม.",
      contactTel: "089-876-5432",
      imageUrl:
        "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=600&q=80",
      status: ReportStatus.FOUND, // พบแล้ว
      userId: kanya.id,
    },
    {
      title: "สุนัขพันธุ์คอร์กี้ ก้นกลม ชื่อ 'บีนส์'",
      category: Category.PET,
      lostDate: new Date("2026-11-22T19:00:00Z"),
      description:
        "เพศเมีย ขาสั้น หางกุด สีส้มขาว ใส่สายจูงอกสีน้ำเงินหลุดติดตัวไปด้วย",
      lastSeenLocation: "สวนหลวง ร.9 ฝั่งประตูดาวเรือง ประเวศ",
      contactTel: "086-555-4321",
      imageUrl:
        "https://images.unsplash.com/photo-1612536057832-2ff7ead58194?auto=format&fit=crop&w=600&q=80",
      status: ReportStatus.LOST,
      userId: anan.id,
    },
    {
      title: "สุนัขพันธุ์ชิวาวาขนสั้น สีช็อกโกแลต ชื่อ 'มินิ'",
      category: Category.PET,
      lostDate: new Date("2026-11-18T11:20:00Z"),
      description:
        "เพศเมีย ตัวเล็กมาก หนัก 1.8 กก. ปลอกคอสีชมพูมีกระดิ่งหัวใจ ขี้กลัวคนแปลกหน้า",
      lastSeenLocation: "ปั๊ม ปตท. ถนนราชพฤกษ์ นนทบุรี",
      contactTel: "081-234-5678",
      imageUrl:
        "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80",
      status: ReportStatus.LOST,
      userId: somchai.id,
    },
    {
      title: "แมวไทยวิเชียรมาศ ตาฟ้า ชื่อ 'หมอก'",
      category: Category.PET,
      lostDate: new Date("2026-11-24T05:00:00Z"),
      description:
        "เพศผู้ แต้มสีน้ำตาลเข้ม 9 จุดตามตำรา ตาสีฟ้าใส ไม่มีปลอกคอ ตกใจสุนัขข้างบ้านเตลิดหายไป",
      lastSeenLocation: "ชุมชนริมคลองบางกอกน้อย บางพลัด",
      contactTel: "089-876-5432",
      imageUrl:
        "https://images.unsplash.com/photo-1513360309081-38f0762b41ab?auto=format&fit=crop&w=600&q=80",
      status: ReportStatus.LOST,
      userId: kanya.id,
    },
    {
      title: "กระต่ายแคระ ND สีเทาควันบุหรี่ ชื่อ 'โมจิ'",
      category: Category.PET,
      lostDate: new Date("2026-11-21T16:45:00Z"),
      description:
        "หูสั้น ตัวเล็ก ขนฟูนุ่ม กระโดดลอดช่องรั้วหน้าบ้านออกไปขณะปล่อยวิ่งเล่นในสนามหญ้า",
      lastSeenLocation: "หมู่บ้านเพอร์เฟค พาร์ค บางใหญ่ นนทบุรี",
      contactTel: "086-555-4321",
      imageUrl:
        "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&q=80",
      status: ReportStatus.LOST,
      userId: anan.id,
    },
    {
      title: "สุนัขพันธุ์พุดเดิ้ลทอย สีขาว ชื่อ 'ปุยฝ้าย'",
      category: Category.PET,
      lostDate: new Date("2026-11-16T14:00:00Z"),
      description:
        "เพศเมีย ขนหยิกฟูตัดแต่งทรงกลม อายุ 5 ปี ตาเป็นต้อกระจกข้างซ้ายเล็กน้อย",
      lastSeenLocation: "หน้าร้านสะดวกซื้อ 7-Eleven ปากซอยจรัญฯ 13",
      contactTel: "081-234-5678",
      imageUrl:
        "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80",
      status: ReportStatus.FOUND, // พบแล้ว
      userId: somchai.id,
    },
    {
      title: "แมวบริติชช็อตแฮร์ สีบลู (เทา) ชื่อ 'มอคค่า'",
      category: Category.PET,
      lostDate: new Date("2026-11-23T13:00:00Z"),
      description:
        "เพศผู้ หน้ากลม แก้มแน่น ขนสั้นแน่น ตาแป๋วสีส้มทอง หายออกจากระเบียงห้องพักชั้น 2",
      lastSeenLocation: "ซอยพหลโยธิน 34 เสนานิคม จตุจักร",
      contactTel: "089-876-5432",
      imageUrl:
        "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=600&q=80",
      status: ReportStatus.LOST,
      userId: kanya.id,
    },
    {
      title: "สุนัขพันธุ์บีเกิ้ล ใบหูพับยาว ชื่อ 'บัดดี้'",
      category: Category.PET,
      lostDate: new Date("2026-11-20T17:15:00Z"),
      description:
        "สามสี (ขาว ดำ น้ำตาล) มีปานดำที่ลิ้น ชอบดมกลิ่นและวิ่งตามนก ไม่ดุ คุ้นเคยกับคนง่าย",
      lastSeenLocation: "ศูนย์กีฬาทางน้ำบึงหนองบอน ประเวศ",
      contactTel: "086-555-4321",
      imageUrl:
        "https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&w=600&q=80",
      status: ReportStatus.LOST,
      userId: anan.id,
    },
    {
      title: "นกกระตั้ว อัมเบรลลา สีขาว หงอนเหลือง ชื่อ 'โคโค่'",
      category: Category.PET,
      lostDate: new Date("2026-11-22T09:20:00Z"),
      description:
        "ตัวใหญ่ ขนขาวทั้งตัว มีหงอนกางได้ พูดเลียนเสียงคำว่า 'สวัสดี' ได้ชัดเจน หลุดบินจากระเบียงบ้าน",
      lastSeenLocation: "ย่านพุทธมณฑลสาย 2 ทวีวัฒนา",
      contactTel: "081-234-5678",
      imageUrl:
        "https://images.unsplash.com/photo-1555169062-013468b47731?auto=format&fit=crop&w=600&q=80",
      status: ReportStatus.LOST,
      userId: somchai.id,
    },
    {
      title: "สุนัขไทยหลังอาน สีเม็ดมะขาม ชื่อ 'เจ้าทอง'",
      category: Category.PET,
      lostDate: new Date("2026-11-19T22:00:00Z"),
      description:
        "เพศผู้ หลังอานลูกศรชัดเจน หูตั้ง สูง ปราดเปรียว วิ่งเตลิดตอนจุดพลุวันลอยกระทง",
      lastSeenLocation: "สะพานพระราม 8 ฝั่งธนบุรี",
      contactTel: "089-876-5432",
      imageUrl:
        "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80",
      status: ReportStatus.LOST,
      userId: kanya.id,
    },
    {
      title: "แมวสามสี พันธุ์ไทยแท้ หางยาว ชื่อน้อง 'สามสี'",
      category: Category.PET,
      lostDate: new Date("2026-11-24T08:00:00Z"),
      description:
        "เพศเมีย ลายสามสีชัดเจน (ดำ ส้ม ขาว) ปลอกคอสีแดงจี้กระพรวนสีทอง เชื่องมาก ชอบนอนบนตัก",
      lastSeenLocation: "ซอยเอกมัย 12 คลองตันเหนือ วัฒนา",
      contactTel: "086-555-4321",
      imageUrl:
        "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=600&q=80",
      status: ReportStatus.LOST,
      userId: anan.id,
    },

    // ITEM
    {
      title: "กระเป๋าสตางค์หนังแท้ใบสั้น สีดำ ยี่ห้อ Coach",
      category: Category.ITEM,
      lostDate: new Date("2026-11-24T12:30:00Z"),
      description:
        "ด้านในมีบัตรประชาชนชื่อ นายสมชาย ใจดี บัตรเครดิต 2 ใบ และเงินสดจำนวนหนึ่ง",
      lastSeenLocation: "ลืมไว้บนโต๊ะอาหาร ศูนย์อาหาร ฟิวเจอร์พาร์ค รังสิต",
      contactTel: "081-234-5678",
      imageUrl:
        "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80",
      status: ReportStatus.LOST,
      userId: somchai.id,
    },
    {
      title: "โทรศัพท์มือถือ iPhone 15 Pro Max สี Natural Titanium",
      category: Category.ITEM,
      lostDate: new Date("2026-11-23T18:15:00Z"),
      description:
        "เคสใสหลังขุ่น ด้านหลังมีสติกเกอร์น้องหมาติดอยู่ ลืมไว้ที่เบาะหลังแท็กซี่สีชมพู",
      lastSeenLocation: "ลงจากรถแท็กซี่หน้า BTS อโศก สุขุมวิท",
      contactTel: "089-876-5432",
      imageUrl:
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80",
      status: ReportStatus.LOST,
      userId: kanya.id,
    },
    {
      title: "iPad Air 5 สี Space Gray พร้อม Apple Pencil 2",
      category: Category.ITEM,
      lostDate: new Date("2026-11-22T14:00:00Z"),
      description:
        "ใส่เคสฝาพับสีน้ำเงินเข้ม ด้านในมีไฟล์งานวิจัยและชีทเรียนมหาลัยสำคัญมาก",
      lastSeenLocation: "ร้านกาแฟ Starbucks สาขา สยามพารากอน ชั้น G",
      contactTel: "086-555-4321",
      imageUrl:
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80",
      status: ReportStatus.LOST,
      userId: anan.id,
    },
    {
      title: "กุญแจรถยนต์ Honda Civic พร้อมพวงกุญแจตุ๊กตาหมีสีน้ำตาล",
      category: Category.ITEM,
      lostDate: new Date("2026-11-21T19:40:00Z"),
      description:
        "รีโมทสมาร์ทคีย์สีดำ มีรอยขีดข่วนด้านหลัง หล่นหายขณะเดินไปลานจอดรถ",
      lastSeenLocation: "ลานจอดรถชั้น 2A ห้างเมกาบางนา สมุทรปราการ",
      contactTel: "081-234-5678",
      imageUrl:
        "https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?auto=format&fit=crop&w=600&q=80",
      status: ReportStatus.FOUND, // พบแล้ว
      userId: somchai.id,
    },
    {
      title: "กระเป๋าเป้สะพายหลัง ยี่ห้อ Anello สีเทาเข้ม",
      category: Category.ITEM,
      lostDate: new Date("2026-11-20T08:15:00Z"),
      description:
        "ภายในมีคอมพิวเตอร์โน้ตบุ๊ก Dell สีดำ สายชาร์จ สมุดโน้ต และเอกสารงานบริษัท",
      lastSeenLocation: "วางลืมไว้บนชั้นวางกระเป๋า บนขบวนรถไฟฟ้า BTS หมอชิต",
      contactTel: "089-876-5432",
      imageUrl:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
      status: ReportStatus.LOST,
      userId: kanya.id,
    },
    {
      title: "หูฟังไร้สาย AirPods Pro 2 พร้อมเคสลายโปเกมอน",
      category: Category.ITEM,
      lostDate: new Date("2026-11-23T12:45:00Z"),
      description:
        "เคสยางสีเหลืองลายปิกาจู หล่นหายจากกระเป๋ากางเกงขณะนั่งรถเมล์สาย 511",
      lastSeenLocation: "ป้ายรถเมล์หน้าเซ็นทรัลเวิลด์ ราชประสงค์",
      contactTel: "086-555-4321",
      imageUrl:
        "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=600&q=80",
      status: ReportStatus.LOST,
      userId: anan.id,
    },
    {
      title: "นาฬิกาข้อมือผู้ชาย Seiko 5 Automatic สายสเตนเลส",
      category: Category.ITEM,
      lostDate: new Date("2026-11-19T17:30:00Z"),
      description:
        "หน้าปัดสีน้ำเงิน สายเงิน มีรอยขนแมวตามการใช้งาน ลืมไว้ตอนถอดล้างมือก่อนทานข้าว",
      lastSeenLocation: "อ่างล้างมือห้องน้ำชาย ชั้น 3 ห้างไอคอนสยาม",
      contactTel: "081-234-5678",
      imageUrl:
        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80",
      status: ReportStatus.LOST,
      userId: somchai.id,
    },
    {
      title: "ซองเอกสารสีน้ำตาล บรรจุเล่มทะเบียนรถและโฉนดที่ดิน",
      category: Category.ITEM,
      lostDate: new Date("2026-11-24T10:00:00Z"),
      description:
        "เอกสารสำคัญทางราชการ ระบุชื่อนายอนันต์ รักสงบ หากใครพบมีสินน้ำใจตอบแทน 5,000 บาท",
      lastSeenLocation: "สำนักงานที่ดินสาขาบางกอกน้อย ถนนจรัญสนิทวงศ์",
      contactTel: "086-555-4321",
      imageUrl:
        "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80",
      status: ReportStatus.LOST,
      userId: anan.id,
    },
    {
      title: "แว่นตาสายตาเลนส์โปรเกรสซีฟ กรอบไทเทเนียม Lindberg",
      category: Category.ITEM,
      lostDate: new Date("2026-11-21T15:20:00Z"),
      description:
        "กรอบแว่นสีเงินบางเบา ในกล่องใส่แว่นหนังสีน้ำตาลเข้ม ลืมไว้บนโต๊ะห้องสมุด",
      lastSeenLocation: "หอสมุดเมืองกรุงเทพมหานคร สี่แยกคอกวัว ราชดำเนิน",
      contactTel: "089-876-5432",
      imageUrl:
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80",
      status: ReportStatus.LOST,
      userId: kanya.id,
    },
    {
      title:
        "กระเป๋าเดินทางล้อลาก 20 นิ้ว สีเขียวมิ้นต์ ยี่ห้อ American Tourister",
      category: Category.ITEM,
      lostDate: new Date("2026-11-22T21:30:00Z"),
      description:
        "มีป้าย Tag ผูกรูปการ์ตูนเป็ดสีเหลือง สลับขึ้นรถแวนรับส่งผู้โดยสาร",
      lastSeenLocation: "จุดรอรถแท็กซี่ ประตู 4 ท่าอากาศยานดอนเมือง",
      contactTel: "081-234-5678",
      imageUrl:
        "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=600&q=80",
      status: ReportStatus.FOUND, // พบแล้ว
      userId: somchai.id,
    },
    {
      title: "กล้องถ่ายภาพดิจิทัล Fujifilm X-T30 II พร้อมเลนส์ 18-55mm",
      category: Category.ITEM,
      lostDate: new Date("2026-11-23T16:50:00Z"),
      description:
        "บอดี้สีเงิน-ดำ มีสายคล้องคอหนังสีน้ำตาล ฟิลเตอร์หน้าเลนส์มีรอยบิ่นเล็กน้อย",
      lastSeenLocation: "ม้านั่งริมน้ำ สวนสันติชัยปราการ ถนนพระอาทิตย์",
      contactTel: "086-555-4321",
      imageUrl:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80",
      status: ReportStatus.LOST,
      userId: anan.id,
    },
    {
      title: "สมุดบัญชีธนาคารพร้อมพาสปอร์ตไทย ในซองพลาสติกใส",
      category: Category.ITEM,
      lostDate: new Date("2026-11-24T11:15:00Z"),
      description:
        "หนังสือเดินทางชื่อ น.ส. กัญญา สุขสม และสมุดบัญชีกสิกรไทย ลืมวางไว้ที่ตู้ ATM",
      lastSeenLocation: "ตู้ ATM ธนาคารกสิกรไทย หน้าอาคารเสริมมิตร อโศก",
      contactTel: "089-876-5432",
      imageUrl:
        "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
      status: ReportStatus.LOST,
      userId: kanya.id,
    },
    {
      title: "หมวกกันน็อกเต็มใบ AGV K3 ลายเต่า Rossi ไซส์ L",
      category: Category.ITEM,
      lostDate: new Date("2026-11-20T20:10:00Z"),
      description:
        "ชิลด์หน้าปรอทสีฟ้า แขวนไว้ที่กระจกมองข้างรถบิ๊กไบค์แล้วถูกหยิบสลับไป",
      lastSeenLocation: "จุดจอดรถบิ๊กไบค์ ตลาดนัดรถไฟศรีนครินทร์ ประเวศ",
      contactTel: "081-234-5678",
      imageUrl:
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80",
      status: ReportStatus.LOST,
      userId: somchai.id,
    },
    {
      title: "แท็บเล็ต Samsung Galaxy Tab S9 พร้อมเคสคีย์บอร์ดสีดำ",
      category: Category.ITEM,
      lostDate: new Date("2026-11-22T13:20:00Z"),
      description:
        "ปากกา S-Pen ติดอยู่ด้านหลัง ในเครื่องมีข้อมูลการสอนและโปรเจกต์งานนักศึกษา",
      lastSeenLocation: "โรงอาหารกลาง มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต",
      contactTel: "086-555-4321",
      imageUrl:
        "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=600&q=80",
      status: ReportStatus.LOST,
      userId: anan.id,
    },
    {
      title: "แหวนทองคำแท้ 1 สลึง หัวพลอยสีน้ำเงินไพลิน",
      category: Category.ITEM,
      lostDate: new Date("2026-11-18T16:00:00Z"),
      description:
        "แหวนของคุณแม่ให้ไว้เป็นของขวัญ หลุดตกจากนิ้วมือขณะเลือกซื้อเสื้อผ้า",
      lastSeenLocation: "ตรอกซอยตลาดประตูน้ำ ราชเทวี กทม.",
      contactTel: "089-876-5432",
      imageUrl:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80",
      status: ReportStatus.LOST,
      userId: kanya.id,
    },
  ];

  // db push
  const createdReports = [];
  for (const report of reportsData) {
    const created = await prisma.lostReport.create({ data: report });
    createdReports.push(created);
  }
  console.log(`Created ${createdReports.length} lost reports successfully.`);

  // Create example Clues
  console.log("Creating sample clues");

  await prisma.clue.create({
    data: {
      message:
        "เหมือนเห็นคุณยายเดินอยู่แถวหน้าวินมอเตอร์ไซค์ ปากทางเข้าตลาดสี่มุมเมือง เมื่อช่วง 11 โมงครับ ท่าทางกำลังยืนมองหาทางกลับบ้าน",
      location: "ปากทางเข้าตลาดสี่มุมเมือง ฝั่งถนนพหลโยธิน",
      imageUrl:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
      reportId: createdReports[0]!.id,
      userId: kanya.id,
    },
  });

  await prisma.clue.create({
    data: {
      message:
        "ผมแจ้งรปภ. ของตลาดให้ช่วยสังเกตให้เพิ่มเติมแล้วนะครับ ถ้ามีข่าวจะรีบมาแจ้งอีกรอบครับ",
      location: "ป้อม รปภ. ประตู 2 ตลาดสี่มุมเมือง",
      reportId: createdReports[0]!.id,
      userId: anan.id,
    },
  });

  await prisma.clue.create({
    data: {
      message:
        "เจอน้องเติ้ลแล้วครับ! ตอนนี้อยู่กับพี่เจ้าหน้าที่ประชาสัมพันธ์ สวนจตุจักร น้องปลอดภัยดีครับ คุณแม่ติดต่อรับได้เลย",
      location: "ห้องประชาสัมพันธ์ สวนจตุจักร ประตู 1",
      reportId: createdReports[1]!.id,
      userId: somchai.id,
    },
  });

  await prisma.clue.create({
    data: {
      message:
        "เห็นน้องหมาโกลเด้นวิ่งเล่นอยู่แถวสวนหน้าคอนโดในซอยอารีย์ครับ มีคนเอาน้ำให้กินอยู่",
      location: "หน้าคอนโด The Silk อารีย์สัมพันธ์ 1",
      imageUrl:
        "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80",
      reportId: createdReports[10]!.id,
      userId: anan.id,
    },
  });

  await prisma.clue.create({
    data: {
      message:
        "มีคุณป้าแม่บ้านเก็บกระเป๋าสตางค์ Coach สีดำใบนี้ได้ ส่งมอบไว้ที่จุดประชาสัมพันธ์ ชั้น G เรียบร้อยแล้วครับ",
      location: "เคาน์เตอร์ประชาสัมพันธ์ ชั้น G ฟิวเจอร์พาร์ค รังสิต",
      reportId: createdReports[25]!.id,
      userId: kanya.id,
    },
  });
  
  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error while seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
