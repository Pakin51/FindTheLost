import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { useUsers } from "../../hooks/useUsers";
import { useCreateClue } from "../../hooks/useReportMutations";
import ErrorNotice from "./ErrorNotice";
import { inputClass, primaryButtonClass } from "./utils";

const MESSAGE_MAX_LENGTH = 1000;

/**
 * ฟอร์มส่งเบาะแส
 * หมายเหตุ: ระบบยังไม่มี Login จึงให้เลือกผู้ส่งจากรายชื่อผู้ใช้ชั่วคราว
 * เมื่อทำระบบ Login แล้วให้เปลี่ยนไปใช้ผู้ใช้ที่ล็อกอินอยู่แทน
 */
export default function ClueForm({ reportId }: { reportId: number }) {
  const { data: users = [], isLoading: usersLoading, isError: usersError } = useUsers();
  const createClue = useCreateClue(reportId);

  const [userId, setUserId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // ถ้ายังไม่ได้เลือก ใช้ผู้ใช้คนแรกเป็นค่าเริ่มต้น
  const selectedUserId = userId ?? users[0]?.id ?? null;
  const canSubmit =
    message.trim().length > 0 && selectedUserId !== null && !createClue.isPending;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit || selectedUserId === null) return;

    createClue.mutate(
      {
        message: message.trim(),
        location: location.trim(),
        imageUrl: imageUrl.trim(),
        reportId,
        userId: selectedUserId,
      },
      {
        onSuccess: () => {
          setMessage("");
          setLocation("");
          setImageUrl("");
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/80 rounded-[28px] border border-blue-100/60 p-5 md:p-6 mb-6"
      aria-labelledby="clue-form-heading"
    >
      <h4 id="clue-form-heading" className="font-bold text-gray-900 mb-3">
        ส่งเบาะแส
      </h4>

      <div className="space-y-3">
        <div>
          <label htmlFor="clue-user" className="block text-xs font-semibold text-gray-700 mb-1">
            ส่งในนาม
          </label>
          <select
            id="clue-user"
            value={selectedUserId ?? ""}
            onChange={(e) => setUserId(Number(e.target.value))}
            disabled={usersLoading || usersError || createClue.isPending}
            className={inputClass}
          >
            {usersLoading && <option>กำลังโหลดรายชื่อ...</option>}
            {usersError && <option>โหลดรายชื่อผู้ใช้ไม่สำเร็จ</option>}
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="clue-message" className="block text-xs font-semibold text-gray-700 mb-1">
            ข้อความเบาะแส <span className="text-red-600">*</span>
          </label>
          <textarea
            id="clue-message"
            rows={8}
            maxLength={MESSAGE_MAX_LENGTH}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={createClue.isPending}
            placeholder="เช่น เห็นคล้ายในรูปที่ตลาดนัดเมื่อเช้านี้"
            className={`${inputClass} resize-none`}
          />
          <p
            className={`mt-1 text-right text-xs ${
              message.length >= MESSAGE_MAX_LENGTH ? "text-red-600" : "text-gray-500"
            }`}
            aria-live="polite"
          >
            {message.length}/{MESSAGE_MAX_LENGTH}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="clue-location" className="block text-xs font-semibold text-gray-700 mb-1">
              สถานที่ที่พบ (ถ้ามี)
            </label>
            <input
              id="clue-location"
              type="text"
              maxLength={300}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={createClue.isPending}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="clue-image" className="block text-xs font-semibold text-gray-700 mb-1">
              ลิงก์รูปภาพ (ถ้ามี)
            </label>
            <input
              id="clue-image"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              disabled={createClue.isPending}
              placeholder="https://..."
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <ErrorNotice error={createClue.error} />

      <div className="mt-4 flex justify-end">
        <button type="submit" disabled={!canSubmit} className={primaryButtonClass}>
          <Send className="w-4 h-4" aria-hidden />
          {createClue.isPending ? "กำลังส่ง..." : "ส่งเบาะแส"}
        </button>
      </div>
    </form>
  );
}
