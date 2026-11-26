import type {
  ApiResponse,
  Category,
  Clue,
  CreateClueInput,
  LostReport,
  ReportDetail,
  ReportStatus,
  UpdateReportInput,
  UserOption,
} from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

/** Error จาก API พร้อม HTTP status และรายละเอียด validation (ถ้ามี) */
export class ApiError extends Error {
  status: number;
  details: string[];

  constructor(message: string, status: number, details: string[] = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

interface ErrorBody {
  message?: string;
  errors?: string[];
}

/** ฟังก์ชันกลางสำหรับเรียก API: แปลง response เป็น ApiResponse<T> และโยน ApiError เมื่อไม่สำเร็จ */
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const hasBody = init.body !== undefined;
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: hasBody ? { 'Content-Type': 'application/json', ...init.headers } : init.headers,
    });
  } catch {
    throw new ApiError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้', 0);
  }

  const json: (Partial<ApiResponse<T>> & ErrorBody) | null = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(
      json?.message ?? `HTTP error! status: ${res.status}`,
      res.status,
      json?.errors ?? [],
    );
  }
  return json?.data as T;
}

// ---------- Reports ----------

export async function getReports(category?: Category): Promise<LostReport[]> {
  try {
    const url = new URL(`${API_BASE_URL}/reports`);
    if (category) {
      url.searchParams.set('category', category);
    }
    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const json: ApiResponse<LostReport[]> = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn('Backend API unreachable, returning empty list:', err);
    return [];
  }
}

export function getReportById(id: number): Promise<ReportDetail> {
  return request<ReportDetail>(`/reports/${id}`);
}

export function updateReport(id: number, input: UpdateReportInput): Promise<LostReport> {
  return request<LostReport>(`/reports/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}

export function updateReportStatus(id: number, status: ReportStatus): Promise<LostReport> {
  return request<LostReport>(`/reports/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export function deleteReport(id: number): Promise<void> {
  return request<void>(`/reports/${id}`, { method: 'DELETE' });
}

// ---------- Clues ----------

export function createClue(input: CreateClueInput): Promise<Clue> {
  return request<Clue>('/clues', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function deleteClue(id: number): Promise<void> {
  return request<void>(`/clues/${id}`, { method: 'DELETE' });
}

// ---------- Users ----------

export function getUsers(): Promise<UserOption[]> {
  return request<UserOption[]>('/users');
}
