import { MapPin, Trash2, User } from "lucide-react";
import type { Clue } from "../../types";
import Photo from "./Photo";
import { formatDateTime } from "./utils";

interface ClueCardProps {
  clue: Clue;
  onDelete: (clueId: number) => void;
  isDeleting: boolean;
}

export default function ClueCard({ clue, onDelete, isDeleting }: ClueCardProps) {
  return (
    <article
      className={`bg-[#f0f8ff] rounded-[28px] border border-blue-100/60 p-5 md:p-6 transition-opacity ${
        isDeleting ? "opacity-50" : ""
      }`}
    >
      {clue.imageUrl && (
        <Photo
          src={clue.imageUrl}
          alt={`ภาพเบาะแสจาก ${clue.user.name}`}
          className="w-full max-w-xs h-56 mx-auto rounded-[18px] mb-4"
        />
      )}

      <p className="text-sm text-gray-900 leading-relaxed whitespace-pre-line break-words">
        {clue.message}
      </p>

      {clue.location && (
        <p className="mt-3 flex items-start gap-1.5 text-sm text-gray-700">
          <MapPin className="w-4 h-4 mt-0.5 shrink-0" aria-hidden />
          <span className="min-w-0 break-words">
            <span className="font-semibold">เจอที่:</span> {clue.location}
          </span>
        </p>
      )}

      <footer className="mt-4 pt-3 border-t border-blue-100 flex items-center justify-between gap-3 text-xs text-gray-600">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
            <User className="w-3.5 h-3.5" aria-hidden />
          </span>
          จาก {clue.user.name}
        </span>
        <span className="inline-flex items-center gap-3">
          <time dateTime={clue.createdAt}>{formatDateTime(clue.createdAt)}</time>
          <button
            type="button"
            onClick={() => onDelete(clue.id)}
            disabled={isDeleting}
            title="ลบเบาะแสนี้"
            aria-label="ลบเบาะแสนี้"
            className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" aria-hidden />
          </button>
        </span>
      </footer>
    </article>
  );
}
