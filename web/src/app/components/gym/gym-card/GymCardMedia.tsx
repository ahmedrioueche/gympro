import { type Gym } from "@ahmedrioueche/gympro-client";
import { ChevronLeft, ChevronRight, Video } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { cn } from "../../../../utils/helper";
import MediaViewerModal from "../../modals/MediaViewerModal";

interface GymCardMediaProps {
  gym: Gym;
  canViewMedia?: boolean;
}

export function GymCardMedia({ gym, canViewMedia }: GymCardMediaProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Filter valid media (images and videos only, excluding current banner if duplicated)
  const mediaList = (gym.media || []).filter(
    (item) => (item.type === "image" || item.type === "video") && item.url,
  ) as Array<{
    type: "image" | "video";
    url: string;
    title?: string;
    publicId?: string;
  }>;

  // If no media, use banner or default gradient (Legacy behavior)
  const hasMedia = mediaList.length > 0;
  const useBanner = !hasMedia && gym.bannerUrl;

  const nextSlide = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (mediaList.length <= 1) return;
      setCurrentIndex((prev) => (prev + 1) % mediaList.length);
    },
    [mediaList.length],
  );

  const prevSlide = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (mediaList.length <= 1) return;
      setCurrentIndex((prev) => (prev === 0 ? mediaList.length - 1 : prev - 1));
    },
    [mediaList.length],
  );

  // Auto-play only when NOT hovered (opposite of marketing carousel usually, or maybe always auto-play?)
  // Let's auto-play when NOT hovered to attract attention, pause on hover to let user control.
  useEffect(() => {
    if (mediaList.length <= 1 || isHovered || showModal) return;
    const interval = setInterval(() => nextSlide(), 4000);
    return () => clearInterval(interval);
  }, [nextSlide, mediaList.length, isHovered, showModal]);

  const handleMediaClick = (e: React.MouseEvent) => {
    if (canViewMedia) {
      e.preventDefault();
      e.stopPropagation();
      setShowModal(true);
    }
    // If not canViewMedia, let event bubble up to GymCard (navigation)
  };

  if (!hasMedia) {
    if (useBanner) {
      return (
        <div className="absolute inset-0">
          <img
            src={gym.bannerUrl}
            alt={gym.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>
      );
    }
    return (
      <div className="absolute inset-0 bg-primary/20" />
    );
  }

  return (
    <>
      <div
        className="absolute inset-0 bg-black"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleMediaClick} // Add click handler here
      >
        {/* Slides */}
        {mediaList.map((item, index) => (
          <div
            key={item.publicId || index}
            className={cn(
              "absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out",
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0",
            )}
          >
            {item.type === "video" ? (
              <div className="relative w-full h-full">
                <video
                  src={item.url}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  autoPlay={isHovered && !showModal} // Pause if modal is open
                  loop
                />
                {/* Video Indicator if not playing or just to show it is video */}
                <div className="absolute top-2 right-2 p-1 bg-black/50 rounded-full">
                  <Video className="w-3 h-3 text-white" />
                </div>
              </div>
            ) : (
              <img
                src={item.url}
                alt={item.title || gym.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            )}
            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent ${canViewMedia ? "cursor-zoom-in" : ""}`}
            />
          </div>
        ))}

        {/* Navigation - Only show on hover */}
        {mediaList.length > 1 && (
          <div
            className={cn(
              "absolute inset-x-0 bottom-4 flex justify-between px-2 transition-opacity duration-300 z-20",
              isHovered ? "opacity-100" : "opacity-0",
            )}
          >
            <button
              onClick={prevSlide}
              className="p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Progress Indicators */}
        {mediaList.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
            {mediaList.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  idx === currentIndex ? "w-4 bg-primary" : "w-1.5 bg-white/50",
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {canViewMedia && (
        <MediaViewerModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          media={mediaList}
          initialIndex={currentIndex}
        />
      )}
    </>
  );
}
