import { type Gym, type GymMedia } from "@ahmedrioueche/gympro-client";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Video,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../../utils/helper";

interface MarketingCarouselProps {
  gym: Gym;
  autoPlayInterval?: number;
}

export default function MarketingCarousel({
  gym,
  autoPlayInterval = 5000,
}: MarketingCarouselProps) {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter out the banner image and any media without a URL
  const marketingMedia = (gym.media || []).filter(
    (item) => item.url && item.publicId !== gym.bannerPublicId,
  );

  const nextSlide = useCallback(() => {
    if (marketingMedia.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % marketingMedia.length);
  }, [marketingMedia.length]);

  const prevSlide = useCallback(() => {
    if (marketingMedia.length <= 1) return;
    setCurrentIndex((prev) =>
      prev === 0 ? marketingMedia.length - 1 : prev - 1,
    );
  }, [marketingMedia.length]);

  useEffect(() => {
    if (marketingMedia.length <= 1 || isPaused) return;

    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [nextSlide, autoPlayInterval, marketingMedia.length, isPaused]);

  if (marketingMedia.length === 0) return null;

  const currentItem = marketingMedia[currentIndex];

  const renderMediaContent = (item: GymMedia) => {
    switch (item.type) {
      case "image":
        return (
          <img
            src={item.url}
            alt={item.title || ""}
            className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-700"
          />
        );
      case "video":
        return (
          <div className="relative w-full h-full bg-black">
            <video
              src={item.url}
              className="w-full h-full object-contain"
              muted
              playsInline
              loop
              autoPlay
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
              <div className="p-4 rounded-full bg-white/20 backdrop-blur-md border border-white/30 animate-pulse">
                <Video className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        );
      case "document":
        return (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-surface to-bg-secondary p-8 text-center">
            <div className="w-24 h-24 mb-6 rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
              <FileText className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-2xl font-black text-text-primary mb-2 line-clamp-1">
              {item.title || t("marketing.gallery.types.document")}
            </h3>
            {item.description && (
              <p className="text-text-secondary line-clamp-2 max-w-md mb-8 px-4 font-medium">
                {item.description}
              </p>
            )}
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-black hover:scale-105 hover:shadow-xl transition-all active:scale-95"
            >
              <Download className="w-5 h-5" />
              {t("common.download", "Download Material")}
            </a>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="group relative w-full aspect-[21/9] min-h-[300px] md:min-h-[450px] overflow-hidden rounded-[2.5rem] border border-border/50 bg-surface shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000"
    >
      {/* Slides Container */}
      <div className="relative w-full h-full overflow-hidden">
        {marketingMedia.map((item, index) => (
          <div
            key={item.publicId || index}
            className={cn(
              "absolute inset-0 w-full h-full transition-all duration-1000 ease-out flex items-center justify-center",
              index === currentIndex
                ? "opacity-100 translate-x-0 scale-100 rotate-0"
                : index < currentIndex
                  ? "opacity-0 -translate-x-full scale-110 -rotate-2"
                  : "opacity-0 translate-x-full scale-110 rotate-2",
            )}
          >
            {renderMediaContent(item)}

            {/* Media Information Overlay (Internal to slide) */}
            {item.type !== "document" && (item.title || item.description) && (
              <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <div className="max-w-2xl animate-in slide-in-from-bottom-4 duration-500 delay-300">
                  {item.title && (
                    <h4 className="text-2xl md:text-3xl font-[1000] text-white tracking-tighter mb-2">
                      {item.title}
                    </h4>
                  )}
                  {item.description && (
                    <p className="text-white/80 font-medium line-clamp-2 max-w-lg">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      {marketingMedia.length > 1 && (
        <>
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-6 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-0 translate-z-0">
            <button
              onClick={prevSlide}
              className="p-4 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all pointer-events-auto active:scale-90"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="p-4 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all pointer-events-auto active:scale-90"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Indicators */}
          <div className="absolute bottom-8 right-8 flex gap-2 z-20">
            {marketingMedia.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "h-2 transition-all duration-500 rounded-full",
                  index === currentIndex
                    ? "w-8 bg-primary shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.5)]"
                    : "w-2 bg-white/30 backdrop-blur-md hover:bg-white/50",
                )}
              />
            ))}
          </div>

          {/* Progress Bar */}
          {!isPaused && (
            <div className="absolute bottom-0 left-0 right-0 h-1 z-30 overflow-hidden">
              <div
                className="h-full bg-primary/50"
                style={{
                  width: "100%",
                  animation: `carousel-progress ${autoPlayInterval}ms linear infinite`,
                }}
              />
            </div>
          )}
        </>
      )}

      {/* Media Type Badge */}
      <div className="absolute top-8 right-8 px-4 py-2 rounded-2xl bg-black/20 backdrop-blur-xl border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl z-20">
        {t(`marketing.gallery.types.${currentItem.type}`)}
      </div>

      <style>{`
        @keyframes carousel-progress {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
