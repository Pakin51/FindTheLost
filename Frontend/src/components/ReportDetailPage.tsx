import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Check, Pencil, Phone, RotateCcw, Trash2 } from "lucide-react";
import { ApiError, getReportById } from "../services/api";
import {
  useDeleteClue,
  useDeleteReport,
  useUpdateReportStatus,
} from "../hooks/useReportMutations";
import type { ReportDetail } from "../types";
import ClueCard from "./report/ClueCard";
import ClueForm from "./report/ClueForm";
import EditReportForm from "./report/EditReportForm";
import ErrorNotice from "./report/ErrorNotice";
import Photo from "./report/Photo";
import {
  CATEGORY_LABEL,
  formatDateTime,
  primaryButtonClass,
  secondaryButtonClass,
} from "./report/utils";

function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[10rem_1fr] gap-x-4 gap-y-0.5 py-3 border-t border-blue-100 first:border-t-0">
      <dt className="text-sm font-semibold text-gray-700">{label}</dt>
      <dd className="min-w-0 text-sm text-gray-900 leading-relaxed whitespace-pre-line break-words">
        {children}
      </dd>
    </div>
  );
}

/** ปุ่มกลับอยู่มุมซ้ายบนของพื้นที่ content ส่วนเนื้อหาจัดกึ่งกลางอยู่ด้านล่าง */
function DetailLayout({
  onBack,
  children,
}: {
  onBack: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 pb-16">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 mb-4 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200/60 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden />
        กลับ
      </button>
      <div className="mx-auto max-w-3xl">{children}</div>
    </div>
  );
}

export default function ReportDetailPage() {
  // อ่านค่า :id จาก URL (/reports/:id)
  const { id } = useParams();
  const reportId = Number(id);
  const isValidId = Number.isInteger(reportId) && reportId > 0;

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const {
    data: report,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<ReportDetail>({
    queryKey: ["report", reportId],
    queryFn: () => getReportById(reportId),
    enabled: isValidId,
    // 404 ไม่ต้อง retry เพราะลองกี่ครั้งผลก็เหมือนเดิม
    retry: (failureCount, err) =>
      !(err instanceof ApiError && err.status === 404) && failureCount < 2,
  });

  const statusMutation = useUpdateReportStatus(reportId);
  const deleteReport = useDeleteReport(reportId);
  const deleteClue = useDeleteClue(reportId);

  // กลับหน้าก่อนหน้า ถ้าเปิดหน้านี้ตรง ๆ (ไม่มีประวัติ) ให้กลับ Dashboard
  const goBack = () => {
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    if (idx > 0) navigate(-1);
    else navigate("/");
  };

  const handleDeleteReport = () => {
    deleteReport.mutate(undefined, {
      onSuccess: () => {
        // ออกจากหน้านี้ก่อน แล้วค่อยล้าง cache ของรายการที่ถูกลบ (กัน refetch แล้วเจอ 404)
        navigate("/", { replace: true });
        queryClient.removeQueries({ queryKey: ["report", reportId], exact: true });
      },
    });
  };

  if (!isValidId) {
    return (
      <DetailLayout onBack={goBack}>
        <div className="text-center py-12 bg-white/70 rounded-3xl border border-gray-200">
          <p className="font-semibold text-gray-800">ลิงก์ไม่ถูกต้อง</p>
        </div>
      </DetailLayout>
    );
  }

  if (isLoading) {
    return (
      <DetailLayout onBack={goBack}>
        <div className="bg-[#f0f8ff] rounded-[32px] p-8 animate-pulse space-y-4">
          <div className="h-6 bg-blue-100 rounded w-1/2 mx-auto" />
          <div className="h-64 bg-blue-100 rounded-[18px] w-64 mx-auto" />
          <div className="h-4 bg-blue-100 rounded w-3/4" />
          <div className="h-4 bg-blue-100 rounded w-2/3" />
        </div>
      </DetailLayout>
    );
  }

  if (isError || !report) {
    const notFound = error instanceof ApiError && error.status === 404;
    return (
      <DetailLayout onBack={goBack}>
        <div className="text-center py-12 bg-white/70 rounded-3xl border border-gray-200">
          <p className="font-semibold text-gray-800">
            {notFound ? "ไม่พบรายการแจ้งหายนี้" : "โหลดรายละเอียดไม่สำเร็จ"}
          </p>
          {!notFound && (
            <>
              <p className="text-sm text-gray-500 mt-1">
                ตรวจสอบว่า Backend ทำงานอยู่ที่ http://localhost:3000
                แล้วลองอีกครั้ง
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 px-5 py-2 rounded-xl text-sm font-medium bg-[#1a1a1a] text-white hover:bg-black transition-colors cursor-pointer"
              >
                ลองอีกครั้ง
              </button>
            </>
          )}
        </div>
      </DetailLayout>
    );
  }

  const isFound = report.status === "FOUND";
  const deletingClueId = deleteClue.isPending ? deleteClue.variables : null;

  return (
    <DetailLayout onBack={goBack}>
      {/* การ์ดรายละเอียดเคส */}
      <section className="bg-[#f0f8ff] rounded-[32px] p-6 md:p-8 border border-blue-100/60 shadow-sm">
        {isEditing ? (
          <EditReportForm
            report={report}
            onCancel={() => setIsEditing(false)}
            onSaved={() => setIsEditing(false)}
          />
        ) : (
          <>
            <div className="text-center">
              <h2 className="text-xl md:text-2xl font-bold text-[#1a1a1a] leading-snug break-words">
                {report.title}
              </h2>
              <span
                className={`inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-semibold ${
                  isFound
                    ? "bg-green-600 text-white"
                    : "bg-amber-100 text-amber-900"
                }`}
              >
                {isFound ? "พบแล้ว" : "กำลังตามหา"}
              </span>
            </div>

            <Photo
              src={report.imageUrl}
              alt={report.title}
              className="w-full max-w-sm h-72 mx-auto mt-5 rounded-[18px]"
            />

            <dl className="mt-6">
              <InfoRow label="ประเภทสิ่งที่หาย">
                {CATEGORY_LABEL[report.category]}
              </InfoRow>
              <InfoRow label="วันที่หาย">{formatDateTime(report.lostDate)}</InfoRow>
              <InfoRow label="รายละเอียด">{report.description}</InfoRow>
              <InfoRow label="พบเห็นล่าสุด">{report.lastSeenLocation}</InfoRow>
              <InfoRow label="ติดต่อหากพบ">
                <a
                  href={`tel:${report.contactTel.replace(/[^0-9+]/g, "")}`}
                  className="inline-flex items-center gap-1.5 font-medium text-blue-700 hover:underline"
                >
                  <Phone className="w-3.5 h-3.5" aria-hidden />
                  {report.contactTel}
                </a>
              </InfoRow>
              <InfoRow label="ผู้แจ้ง">{report.user.name}</InfoRow>
            </dl>

            {/* ปุ่มจัดการเคส: เปลี่ยนสถานะ / แก้ไข / ลบ */}
            <div className="mt-5 pt-4 border-t border-blue-100">
              {confirmingDelete ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-sm text-red-700 font-medium">
                    ลบรายการนี้พร้อมเบาะแสทั้งหมด? การลบไม่สามารถย้อนกลับได้
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmingDelete(false)}
                      disabled={deleteReport.isPending}
                      className={secondaryButtonClass}
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteReport}
                      disabled={deleteReport.isPending}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden />
                      {deleteReport.isPending ? "กำลังลบ..." : "ยืนยันลบ"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => statusMutation.mutate(isFound ? "LOST" : "FOUND")}
                    disabled={statusMutation.isPending}
                    className={isFound ? secondaryButtonClass : primaryButtonClass}
                  >
                    {isFound ? (
                      <RotateCcw className="w-4 h-4" aria-hidden />
                    ) : (
                      <Check className="w-4 h-4" aria-hidden />
                    )}
                    {statusMutation.isPending
                      ? "กำลังอัปเดต..."
                      : isFound
                        ? "เปิดเคสอีกครั้ง"
                        : "ทำเครื่องหมายว่าพบแล้ว"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className={secondaryButtonClass}
                  >
                    <Pencil className="w-4 h-4" aria-hidden />
                    แก้ไข
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(true)}
                    className={`${secondaryButtonClass} text-red-700 hover:bg-red-50`}
                  >
                    <Trash2 className="w-4 h-4" aria-hidden />
                    ลบ
                  </button>
                </div>
              )}
              <ErrorNotice error={statusMutation.error ?? deleteReport.error} />
            </div>
          </>
        )}
      </section>

      {/* เบาะแสที่ได้รับ */}
      <section className="mt-8" aria-labelledby="clues-heading">
        <div className="flex items-center justify-between mb-4">
          <h3 id="clues-heading" className="text-lg font-bold text-gray-900">
            เบาะแสที่ได้รับ
          </h3>
          <span className="text-sm text-gray-500">
            ({report.clues.length} รายการ)
          </span>
        </div>

        {isFound ? (
          <div
            role="status"
            className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-800"
          >
            เคสนี้พบแล้ว จึงปิดรับเบาะแสใหม่ หากต้องการรับเบาะแสต่อ
            ให้กด “เปิดเคสอีกครั้ง” ที่ด้านบน
          </div>
        ) : (
          <ClueForm reportId={report.id} />
        )}

        <ErrorNotice error={deleteClue.error} />

        {report.clues.length === 0 ? (
          <div className="text-center py-10 bg-white/60 rounded-2xl border border-dashed border-gray-300 text-gray-500">
            ยังไม่มีเบาะแสสำหรับรายการนี้
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            {report.clues.map((clue) => (
              <ClueCard
                key={clue.id}
                clue={clue}
                onDelete={(clueId) => deleteClue.mutate(clueId)}
                isDeleting={deletingClueId === clue.id}
              />
            ))}
          </div>
        )}
      </section>
    </DetailLayout>
  );
}
