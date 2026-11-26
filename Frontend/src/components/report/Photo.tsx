import { useState } from "react";

/** รูปภาพพร้อม fallback เป็นกล่อง PlaceHolder เมื่อไม่มีรูปหรือโหลดไม่ได้ */
export default function Photo({
  src,
  alt,
  className,
}: {
  src?: string | null;
  alt: string;
  className: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`${className} bg-[#d5d5d5] flex items-center justify-center`}
      >
        <span className="text-white font-bold text-xl tracking-wide select-none drop-shadow-sm">
          PlaceHolder
        </span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={`${className} object-cover`}
    />
  );
}
