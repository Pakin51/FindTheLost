import { useState, type FormEvent } from "react";
import { useUpdateReport } from "../../hooks/useReportMutations";
import type { Category, ReportDetail } from "../../types";
import ErrorNotice from "./ErrorNotice";
import {
  CATEGORY_LABEL,
  inputClass,
  primaryButtonClass,
  secondaryButtonClass,
  toDatetimeLocal,
} from "./utils";

interface EditReportFormProps {
  report: ReportDetail;
  onCancel: () => void;
  onSaved: () => void;
}

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-gray-700 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function EditReportForm({ report, onCancel, onSaved }: EditReportFormProps) {
  const updateReport = useUpdateReport(report.id);

  const [title, setTitle] = useState(report.title);
  const [category, setCategory] = useState<Category>(report.category);
  const [lostDate, setLostDate] = useState(toDatetimeLocal(report.lostDate));
  const [description, setDescription] = useState(report.description);
  const [lastSeenLocation, setLastSeenLocation] = useState(report.lastSeenLocation);
  const [contactTel, setContactTel] = useState(report.contactTel);
  const [imageUrl, setImageUrl] = useState(report.imageUrl ?? "");

  const canSubmit =
    title.trim() &&
    lostDate &&
    description.trim() &&
    lastSeenLocation.trim() &&
    contactTel.trim() &&
    !updateReport.isPending;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    updateReport.mutate(
      {
        title: title.trim(),
        category,
        lostDate: new Date(lostDate).toISOString(),
        description: description.trim(),
        lastSeenLocation: lastSeenLocation.trim(),
        contactTel: contactTel.trim(),
        imageUrl: imageUrl.trim(),
      },
      { onSuccess: onSaved },
    );
  };

  const pending = updateReport.isPending;

  return (
    <form onSubmit={handleSubmit} aria-labelledby="edit-heading">
      <h2 id="edit-heading" className="text-xl font-bold text-[#1a1a1a] text-center mb-5">
        แก้ไขรายการแจ้งหาย
      </h2>

      <div className="space-y-3">
        <Field id="edit-title" label="ชื่อ">
          <input id="edit-title" type="text" maxLength={150} value={title}
            onChange={(e) => setTitle(e.target.value)} disabled={pending} className={inputClass} />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field id="edit-category" label="ประเภทสิ่งที่หาย">
            <select id="edit-category" value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              disabled={pending} className={inputClass}>
              {(Object.keys(CATEGORY_LABEL) as Category[]).map((c) => (
                <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>
              ))}
            </select>
          </Field>
          <Field id="edit-date" label="วันที่และเวลาที่หาย">
            <input id="edit-date" type="datetime-local" value={lostDate}
              onChange={(e) => setLostDate(e.target.value)} disabled={pending} className={inputClass} />
          </Field>
        </div>

        <Field id="edit-description" label="รายละเอียด">
          <textarea id="edit-description" rows={4} maxLength={2000} value={description}
            onChange={(e) => setDescription(e.target.value)} disabled={pending} className={inputClass} />
        </Field>

        <Field id="edit-location" label="สถานที่พบเห็นล่าสุด">
          <input id="edit-location" type="text" maxLength={300} value={lastSeenLocation}
            onChange={(e) => setLastSeenLocation(e.target.value)} disabled={pending} className={inputClass} />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field id="edit-tel" label="เบอร์โทรติดต่อ">
            <input id="edit-tel" type="tel" value={contactTel}
              onChange={(e) => setContactTel(e.target.value)} disabled={pending} className={inputClass} />
          </Field>
          <Field id="edit-image" label="ลิงก์รูปภาพ (ถ้ามี)">
            <input id="edit-image" type="url" value={imageUrl} placeholder="https://..."
              onChange={(e) => setImageUrl(e.target.value)} disabled={pending} className={inputClass} />
          </Field>
        </div>
      </div>

      <ErrorNotice error={updateReport.error} />

      <div className="mt-5 flex justify-end gap-2">
        <button type="button" onClick={onCancel} disabled={pending} className={secondaryButtonClass}>
          ยกเลิก
        </button>
        <button type="submit" disabled={!canSubmit} className={primaryButtonClass}>
          {pending ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
        </button>
      </div>
    </form>
  );
}
