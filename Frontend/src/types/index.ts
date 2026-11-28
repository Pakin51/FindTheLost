export type Category = 'PERSON' | 'PET' | 'ITEM';
export type ReportStatus = 'LOST' | 'FOUND';

export interface UserSummary {
  id: number;
  name: string;
  tel?: string | null;
}

export interface LostReport {
  id: number;
  title: string;
  category: Category;
  lostDate: string;
  description: string;
  lastSeenLocation: string;
  contactTel: string;
  imageUrl?: string | null;
  status: ReportStatus;
  userId: number;
  user: UserSummary;
  createdAt: string;
  updatedAt: string;
}

export interface ClueUser {
  id: number;
  name: string;
}

export interface Clue {
  id: number;
  message: string;
  imageUrl?: string | null;
  location?: string | null;
  reportId: number;
  userId: number;
  user: ClueUser;
  createdAt: string;
}

// ผลลัพธ์จาก GET /api/reports/:id (มีอีเมลผู้แจ้ง และรายการเบาะแสทั้งหมด)
export interface ReportDetail extends LostReport {
  user: UserSummary & { email: string };
  clues: Clue[];
}

export interface ApiResponse<T> {
  success: boolean;
  count?: number;
  data: T;
  message?: string;
}

// ผู้ใช้ (ใช้เลือกผู้ส่งเบาะแส จนกว่าจะมีระบบ Login)
export interface UserOption {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

// ข้อมูลที่ส่งไปแก้ไขรายการแจ้งหาย (PUT /api/reports/:id)
export interface UpdateReportInput {
  title: string;
  category: Category;
  lostDate: string; // ISO string
  description: string;
  lastSeenLocation: string;
  contactTel: string;
  imageUrl: string; // ว่างได้
}

// ข้อมูลที่ส่งไปสร้างเบาะแส (POST /api/clues)
export interface CreateClueInput {
  message: string;
  location: string;
  imageUrl: string;
  reportId: number;
  userId: number;
}

export interface MyClue {
  id: number;
  message: string;
  imageUrl: string | null;
  location: string | null;
  createdAt: string;
  report: Pick<LostReport, 'id' | 'title' | 'category' | 'status' | 'imageUrl' | 'lastSeenLocation'>;
}