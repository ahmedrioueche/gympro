import { Camera, Loader2 } from "lucide-react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

interface AvatarUploaderProps {
  currentAvatar?: string;
  userName?: string;
  uploading: boolean;
  onUpload: (file: File) => Promise<void>;
}

export default function AvatarUploader({
  currentAvatar,
  userName = "?",
  uploading,
  onUpload,
}: AvatarUploaderProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onUpload(file);
      // Reset input so the same file can be selected again
      e.target.value = "";
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative group">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary p-1">
          <div className="w-full h-full rounded-full bg-surface border-2 border-surface overflow-hidden flex items-center justify-center relative">
            {currentAvatar ? (
              <img
                src={currentAvatar}
                alt={userName}
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
          </div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
      </div>
      <div>
        <button
          type="button"
          onClick={handleAvatarClick}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-primary bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Camera className="w-4 h-4" />
          {uploading
            ? t("common.uploading", "Uploading...")
            : t("settings.profile.changeAvatar", "Change Avatar")}
        </button>
        <p className="text-xs text-text-secondary mt-1">
          {t("settings.profile.avatarHint", "Max 5MB")}
        </p>
      </div>
    </div>
  );
}
