import {
  Check,
  ChevronRight,
  FileText,
  Loader2,
  UploadCloud,
  X,
} from "lucide-react";
import type { ReactNode } from "react";

interface BaseViewProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

export const BaseView = ({
  children,
  title,
  subtitle,
  className = "max-w-md",
}: BaseViewProps) => (
  <div
    className={`flex flex-col items-center justify-center w-full mx-auto p-8 text-center space-y-10 animate-fade-in-up bg-surface/40 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-primary/5 ring-1 ring-white/10 dark:ring-white/5 transition-all duration-500 ease-out hover:shadow-primary/10 ${className}`}
  >
    {(title || subtitle) && (
      <div className="space-y-3">
        {title && (
          <h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-br from-text-primary to-text-secondary bg-clip-text text-transparent transform transition-all duration-500">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="text-text-secondary text-lg font-medium">{subtitle}</p>
        )}
      </div>
    )}
    <div className="w-full space-y-6">{children}</div>
  </div>
);

interface QuestionViewProps {
  question: string;
  onYes: () => void;
  onNo: () => void;
  yesLabel?: string;
  noLabel?: string;
}

export const QuestionView = ({
  question,
  onYes,
  onNo,
  yesLabel = "Yes",
  noLabel = "No",
}: QuestionViewProps) => (
  <BaseView title={question}>
    <div className="grid grid-cols-2 gap-4">
      <button
        onClick={onNo}
        className="p-5 rounded-2xl border border-border/50 bg-surface/50 hover:bg-surface hover:border-primary/30 transition-all duration-300 font-bold text-text-secondary hover:text-text-primary hover:-translate-y-1 hover:shadow-lg focus:ring-2 focus:ring-primary/20 outline-none"
      >
        {noLabel}
      </button>
      <button
        onClick={onYes}
        className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-r from-primary to-primary-focus text-white font-bold transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-1 focus:ring-2 focus:ring-primary outline-none group"
      >
        <span className="relative z-10">{yesLabel}</span>
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
      </button>
    </div>
  </BaseView>
);

interface InputViewProps {
  title: string;
  subtitle?: string;
  value: string | number;
  onChange: (val: string) => void;
  onNext: () => void;
  placeholder?: string;
  type?: "text" | "number";
  buttonLabel?: string;
}

export const InputView = ({
  title,
  subtitle,
  value,
  onChange,
  onNext,
  placeholder,
  type = "text",
  buttonLabel = "Next",
}: InputViewProps) => (
  <BaseView title={title} subtitle={subtitle}>
    <div className="space-y-6">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-primary/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="relative w-full p-5 text-text-primary font-medium rounded-2xl bg-surface/80 border border-border/50 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none text-lg transition-all duration-300 placeholder:text-text-secondary/50"
          onKeyDown={(e) => e.key === "Enter" && value && onNext()}
          autoFocus
        />
      </div>
      <button
        onClick={onNext}
        disabled={!value}
        className="relative overflow-hidden w-full p-5 rounded-2xl bg-gradient-to-r from-primary to-primary-focus text-white font-bold transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 focus:ring-2 focus:ring-primary outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:-translate-y-0 group flex items-center justify-center gap-2"
      >
        <span className="relative z-10 flex items-center gap-2">
          {buttonLabel}
          <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </span>
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
      </button>
    </div>
  </BaseView>
);

interface SelectionViewProps {
  title: string;
  options: { label: string; value: string }[];
  onSelect: (value: string) => void;
  selectedValue?: string;
}

export const SelectionView = ({
  title,
  options,
  onSelect,
  selectedValue,
}: SelectionViewProps) => (
  <BaseView title={title}>
    <div className="grid grid-cols-1 gap-4">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(option.value)}
          className={`relative overflow-hidden p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between group transform hover:-translate-y-1 hover:shadow-xl ${
            selectedValue === option.value
              ? "border-primary/50 bg-primary/10 text-primary shadow-lg shadow-primary/10"
              : "border-border/50 bg-surface/50 text-text-secondary hover:border-primary/30 hover:text-text-primary"
          }`}
        >
          <span className="font-bold text-lg relative z-10">
            {option.label}
          </span>
          <div
            className={`relative z-10 transition-transform duration-300 ${selectedValue === option.value ? "scale-100 opacity-100" : "scale-50 opacity-0 group-hover:scale-75 group-hover:opacity-50"}`}
          >
            <Check className="w-6 h-6" strokeWidth={3} />
          </div>
          {selectedValue === option.value && (
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent object-cover" />
          )}
        </button>
      ))}
    </div>
  </BaseView>
);

import { MapPin } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFileUpload } from "../../../../../hooks/useFileUpload";

interface LocationData {
  address: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export const LocationView = ({
  data,
  onChange,
  onNext,
}: {
  data: LocationData;
  onChange: (d: Partial<LocationData>) => void;
  onNext: () => void;
}) => {
  const { t } = useTranslation();
  const [detecting, setDetecting] = useState(false);

  const handleDetect = () => {
    setDetecting(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          let newAddress = "";
          let newCity = "";
          let newCountry = "";

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            );
            const apiData = await response.json();
            const addr = apiData.address || {};

            newAddress =
              `${addr.road || ""} ${addr.house_number || ""}`.trim() ||
              apiData.display_name.split(",")[0];
            newCity =
              addr.city || addr.town || addr.village || addr.state || "";
            newCountry = addr.country || "";
          } catch (error) {
            console.error("Geocoding error:", error);
          }

          onChange({
            latitude: lat,
            longitude: lng,
            ...(newAddress && { address: newAddress }),
            ...(newCity && { city: newCity }),
            ...(newCountry && { country: newCountry }),
          });
          setDetecting(false);
        },
        () => {
          setDetecting(false);
        },
      );
    } else {
      setDetecting(false);
    }
  };

  const isComplete = data.address && data.city && data.country;

  return (
    <BaseView
      title={t("onboarding.location.title", "Where are you located?")}
      subtitle={t(
        "onboarding.location.subtitle",
        "We use this to connect you with nearby gyms.",
      )}
    >
      <div className="space-y-4">
        <button
          onClick={handleDetect}
          disabled={detecting}
          className="group relative overflow-hidden w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-primary/10 text-primary font-bold transition-all duration-300 hover:bg-primary/20 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0"
        >
          <MapPin
            size={20}
            className={
              detecting
                ? "animate-bounce"
                : "transition-transform group-hover:scale-110"
            }
          />
          <span className="relative z-10">
            {detecting
              ? t("onboarding.location.detecting", "Detecting...")
              : t("onboarding.actions.detectLocation", "Detect My Location")}
          </span>
        </button>
        <div className="flex items-center gap-3 opacity-60">
          <hr className="flex-1 border-border" />
          <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">
            Or manually
          </span>
          <hr className="flex-1 border-border" />
        </div>
        <div className="space-y-3">
          <input
            type="text"
            value={data.address}
            onChange={(e) => onChange({ address: e.target.value })}
            placeholder={t(
              "onboarding.location.addressPlaceholder",
              "Street Address",
            )}
            className="w-full p-4 font-medium text-text-primary rounded-xl bg-surface/50 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder:text-text-secondary/50 hover:bg-surface"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={data.city}
              onChange={(e) => onChange({ city: e.target.value })}
              placeholder={t("onboarding.location.cityPlaceholder", "City")}
              className="w-full p-4 font-medium text-text-primary rounded-xl bg-surface/50 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder:text-text-secondary/50 hover:bg-surface"
            />
            <input
              type="text"
              value={data.country}
              onChange={(e) => onChange({ country: e.target.value })}
              placeholder={t(
                "onboarding.location.countryPlaceholder",
                "Country",
              )}
              className="w-full p-4 font-medium text-text-primary rounded-xl bg-surface/50 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder:text-text-secondary/50 hover:bg-surface"
            />
          </div>
        </div>
        <button
          onClick={onNext}
          disabled={!isComplete}
          className="relative overflow-hidden w-full mt-6 p-5 rounded-2xl bg-gradient-to-r from-primary to-primary-focus text-white font-bold transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 focus:ring-2 focus:ring-primary outline-none disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-2 hover:-translate-y-1"
        >
          <span className="relative z-10 flex items-center gap-2">
            {t("onboarding.actions.next", "Next")}
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
        </button>
      </div>
    </BaseView>
  );
};

export const CoachInfoView = ({
  bio,
  certifications,
  socialMediaLinks,
  documents,
  onChange,
  onNext,
  onSkip,
}: {
  bio: string;
  certifications: string[];
  socialMediaLinks: string[];
  documents: { url: string; description: string; type: string }[];
  onChange: (key: string, val: any) => void;
  onNext: () => void;
  onSkip: () => void;
}) => {
  const { t } = useTranslation();
  const [certInput, setCertInput] = useState("");
  const [socialInput, setSocialInput] = useState("");

  const { isUploading, uploadFiles, uploads } = useFileUpload();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const results = await uploadFiles(files, "auto");

      // We manually add them here instead of onComplete to capture the exact file name
      if (results && results.length > 0) {
        const newDocs = results.map((r, i) => {
          return {
            url: r.url,
            description: files[i]?.name || r.url.split("/").pop() || "Document",
            type: "document",
          };
        });
        onChange("documents", [...documents, ...newDocs]);
      }
    }
  };

  const handleAddCert = () => {
    if (certInput.trim() && !certifications.includes(certInput.trim())) {
      onChange("certifications", [...certifications, certInput.trim()]);
      setCertInput("");
    }
  };

  const handleAddSocial = () => {
    if (socialInput.trim() && !socialMediaLinks.includes(socialInput.trim())) {
      onChange("socialMediaLinks", [...socialMediaLinks, socialInput.trim()]);
      setSocialInput("");
    }
  };

  return (
    <BaseView
      title={t("onboarding.coach.infoTitle", "Tell Us About Your Coaching")}
      subtitle={t(
        "onboarding.coach.infoSubtitle",
        "Provide some details about your experience, certifications, and links so members can know you better.",
      )}
      className="max-w-2xl"
    >
      <div className="space-y-6 text-left w-full">
        <div className="space-y-1.5 focus-within:text-primary transition-colors">
          <label className="text-sm font-bold text-text-secondary block uppercase tracking-wide">
            Bio
          </label>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-primary/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <textarea
              value={bio}
              onChange={(e) => onChange("bio", e.target.value)}
              placeholder={t(
                "onboarding.placeholders.bio",
                "Keep it short and sweet...",
              )}
              className="relative w-full p-4 font-medium text-text-primary rounded-xl bg-surface border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all resize-none h-24 placeholder:text-text-secondary/50"
            />
          </div>
        </div>
        <div className="space-y-1.5 focus-within:text-primary transition-colors">
          <label className="text-sm font-bold text-text-secondary block uppercase tracking-wide">
            Certifications
          </label>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-primary/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <input
              type="text"
              value={certInput}
              onChange={(e) => setCertInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCert()}
              placeholder={t(
                "onboarding.placeholders.certifications",
                "e.g., NASM, ISSA (Press enter)",
              )}
              className="relative w-full p-4 font-medium text-text-primary rounded-xl bg-surface border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all mb-3 placeholder:text-text-secondary/50"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {certifications.map((cert) => (
              <span
                key={cert}
                className="px-3 py-1.5 bg-primary/10 text-primary font-bold text-xs rounded-lg flex items-center gap-2 animate-in fade-in zoom-in duration-300"
              >
                {cert}
                <button
                  onClick={() =>
                    onChange(
                      "certifications",
                      certifications.filter((c) => c !== cert),
                    )
                  }
                  className="text-primary/50 hover:text-primary transition-colors"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
        <div className="space-y-1.5 focus-within:text-primary transition-colors">
          <label className="text-sm font-bold text-text-secondary block uppercase tracking-wide">
            Social Links
          </label>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-primary/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <input
              type="text"
              value={socialInput}
              onChange={(e) => setSocialInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddSocial()}
              placeholder={t(
                "onboarding.placeholders.socialLinks",
                "https://instagram.com/... (Press enter)",
              )}
              className="relative w-full p-4 font-medium text-text-primary rounded-xl bg-surface border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all mb-3 placeholder:text-text-secondary/50"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {socialMediaLinks.map((link) => (
              <span
                key={link}
                className="px-3 py-1.5 bg-primary/10 text-primary font-bold text-xs rounded-lg flex items-center gap-2 truncate max-w-[200px] animate-in fade-in zoom-in duration-300"
              >
                {link}
                <button
                  onClick={() =>
                    onChange(
                      "socialMediaLinks",
                      socialMediaLinks.filter((l) => l !== link),
                    )
                  }
                  className="text-primary/50 hover:text-primary transition-colors"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-1.5 focus-within:text-primary transition-colors">
          <label className="text-sm font-bold text-text-secondary block uppercase tracking-wide">
            {t("onboarding.coach.documents", "Upload Documents/ID")}
          </label>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-primary/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative w-full p-6 text-center rounded-xl bg-surface border-2 border-dashed border-border/50 hover:border-primary/50 transition-all cursor-pointer">
              <input
                type="file"
                multiple
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              <div className="flex flex-col items-center justify-center gap-2">
                {isUploading ? (
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                ) : (
                  <UploadCloud className="w-8 h-8 text-text-secondary/50 group-hover:text-primary/50 transition-colors" />
                )}
                <span className="text-sm text-text-secondary font-medium">
                  {isUploading
                    ? t("common.uploading", "Uploading...")
                    : t(
                        "onboarding.coach.dragFiles",
                        "Click or drag files here",
                      )}
                </span>
              </div>
            </div>
          </div>
          {/* List of uploaded docs */}
          {documents.length > 0 && (
            <div className="flex flex-col gap-2 mt-3">
              {documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center bg-surface/80 p-3 rounded-xl border border-border/50 animate-in fade-in slide-in-from-top-2"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-sm font-medium text-text-primary truncate">
                      {doc.description}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onChange(
                        "documents",
                        documents.filter((_, i) => i !== idx),
                      )
                    }
                    className="text-text-secondary hover:text-red-500 transition-colors shrink-0 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-6">
          <button
            onClick={onSkip}
            className="flex-1 p-5 rounded-2xl border border-border/50 bg-surface/50 hover:bg-surface hover:border-text-secondary/30 transition-all duration-300 font-bold text-text-secondary hover:text-text-primary hover:-translate-y-1 outline-none"
          >
            {t("onboarding.actions.skip", "Skip for now")}
          </button>
          <button
            onClick={onNext}
            className="relative overflow-hidden flex-1 p-5 rounded-2xl bg-gradient-to-r from-primary to-primary-focus text-white font-bold transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-1 outline-none group"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {t("onboarding.actions.next", "Next")}
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
          </button>
        </div>
      </div>
    </BaseView>
  );
};
