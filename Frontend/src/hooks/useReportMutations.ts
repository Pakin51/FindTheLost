import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createClue,
  deleteClue,
  deleteReport,
  updateReport,
  updateReportStatus,
} from '../services/api';
import type { CreateClueInput, ReportStatus, UpdateReportInput } from '../types';

/**
 * Zero-Refresh UI Update:
 * หลังทำ mutation สำเร็จ จะ invalidate Query Cache ที่เกี่ยวข้อง
 * TanStack Query จะ refetch ข้อมูลใหม่จาก Server และ UI อัปเดตเองโดยไม่ต้องรีเฟรชหน้า
 *  - ['report', id] = หน้ารายละเอียด
 *  - ['reports']    = รายการในหน้า Dashboard
 */
function useInvalidateReport(reportId: number) {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ['report', reportId] }),
      queryClient.invalidateQueries({ queryKey: ['reports'] }),
      queryClient.invalidateQueries({ queryKey: ['my-clues'] }),
    ]);
}

export function useUpdateReport(reportId: number) {
  const invalidate = useInvalidateReport(reportId);
  return useMutation({
    mutationFn: (input: UpdateReportInput) => updateReport(reportId, input),
    onSuccess: invalidate,
  });
}

export function useUpdateReportStatus(reportId: number) {
  const invalidate = useInvalidateReport(reportId);
  return useMutation({
    mutationFn: (status: ReportStatus) => updateReportStatus(reportId, status),
    onSuccess: invalidate,
  });
}

export function useDeleteReport(reportId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteReport(reportId),
    // เฉพาะรายการ Dashboard ที่ต้อง refetch ส่วน cache ของหน้ารายละเอียด
    // ให้ component เป็นคนลบหลัง navigate ออกจากหน้านั้นแล้ว (กัน refetch แล้วเจอ 404)
    onSuccess: () =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: ['reports'] }),
    queryClient.invalidateQueries({ queryKey: ['my-clues'] }),
  ]),
  });
}

export function useCreateClue(reportId: number) {
  const invalidate = useInvalidateReport(reportId);
  return useMutation({
    mutationFn: (input: CreateClueInput) => createClue(input),
    onSuccess: invalidate,
  });
}

export function useDeleteClue(reportId: number) {
  const invalidate = useInvalidateReport(reportId);
  return useMutation({
    mutationFn: (clueId: number) => deleteClue(clueId),
    onSuccess: invalidate,
  });
}
