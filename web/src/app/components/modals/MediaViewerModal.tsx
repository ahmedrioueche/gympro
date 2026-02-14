import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

interface MediaItem {
  type: "image" | "video";
  url: string;
  title?: string;
}

interface MediaViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  media: MediaItem[];
  initialIndex?: number;
}

export default function MediaViewerModal({
  isOpen,
  onClose,
  media,
  initialIndex = 0,
}: MediaViewerModalProps) {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, initialIndex]);

  if (!isOpen) return null;

  const currentMedia = media[currentIndex];
  const hasMultiple = media.length > 1;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % media.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300" // Proper stacking context
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Main Content Area */}
      <div
        className="relative w-full h-full flex items-center justify-center p-4 md:p-10"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking content
      >
        {currentMedia?.type === "video" ? (
          <video
            src={currentMedia.url}
            controls
            autoPlay
            className="max-h-full max-w-full rounded-lg shadow-2xl object-contain"
          />
        ) : (
          <img
            src={currentMedia?.url}
            alt={currentMedia?.title || "Media"}
            className="max-h-full max-w-full rounded-lg shadow-2xl object-contain select-none" // prevent drag selection
          />
        )}

        {/* Navigation Buttons */}
        {hasMultiple && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all hover:scale-110"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all hover:scale-110"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </>
        )}

        {/* Media Counter/Title */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
          {currentIndex + 1} / {media.length}
        </div>
      </div>
    </div>,
    document.body,
  );
}
