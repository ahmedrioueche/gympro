import type {
  CreateAppBannerDto,
  TopBannerVariant,
} from "@ahmedrioueche/gympro-client";
import { SUPPORTED_LANGUAGES } from "@ahmedrioueche/gympro-client";
import { Eye, Wand2, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../../components/ui/BaseModal";
import Button from "../../../../../components/ui/Button";
import Checkbox from "../../../../../components/ui/Checkbox";
import CustomSelect from "../../../../../components/ui/CustomSelect";
import InputField from "../../../../../components/ui/InputField";
import { useAdminBanners } from "../../../../../hooks/queries/useBanners";
import { useAI } from "../../../../../hooks/useAI";
import { useModalStore } from "../../../../../store/modal";
import { parseAiResponse } from "../../../../../utils/helper";

export default function BannerFormModal() {
  const { t, i18n } = useTranslation();
  const { currentModal, bannerFormProps, closeModal } = useModalStore();
  const { createBanner, updateBanner, isCreating, isUpdating } =
    useAdminBanners();
  const { mutate: getAiResponse, isPending: isTranslating } = useAI();

  const defaultTranslations = SUPPORTED_LANGUAGES.reduce(
    (acc, lang) => ({ ...acc, [lang]: "" }),
    {} as Record<string, string>,
  );

  const [formData, setFormData] = useState<Partial<CreateAppBannerDto>>({
    translations: defaultTranslations,
    variant: "info",
    color: "",
    action: { type: "none" },
    isRemovable: true,
    frequencyHours: 24,
    isActive: true,
  });

  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (currentModal === "banner_form" && bannerFormProps?.banner) {
      const { banner } = bannerFormProps;
      setFormData({
        translations: banner.translations || defaultTranslations,
        variant: banner.variant || "info",
        color: banner.color || "",
        action: banner.action || { type: "none" },
        isRemovable: banner.isRemovable ?? true,
        frequencyHours: banner.frequencyHours ?? 24,
        isActive: banner.isActive ?? true,
        templateKey: banner.templateKey,
      });
    } else if (currentModal === "banner_form") {
      setFormData({
        translations: defaultTranslations,
        variant: "info",
        color: "",
        action: { type: "none" },
        isRemovable: true,
        frequencyHours: 24,
        isActive: true,
      });
    }
  }, [currentModal, bannerFormProps]);

  const handleTranslate = () => {
    const enText = formData.translations?.en;
    if (!enText) return;

    const targetLangs = SUPPORTED_LANGUAGES.filter((lang) => lang !== "en");
    const prompt = `Translate the following text into these languages: ${targetLangs.join(", ")}. Keep it concise, professional, and matching the tone. Return ONLY a valid JSON object with language codes as keys ("${targetLangs.join('", "')}") and the translated strings as values. Avoid markdown. Text: "${enText}"`;

    getAiResponse(prompt, {
      onSuccess: (response: any) => {
        const parsed = parseAiResponse<Record<string, string>>(response);
        if (parsed) {
          setFormData((prev) => ({
            ...prev,
            translations: {
              ...prev.translations,
              ...parsed,
              en: enText,
            },
          }));
        }
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bannerFormProps?.banner) {
      updateBanner(
        { id: bannerFormProps.banner._id, dto: formData as any },
        { onSuccess: closeModal },
      );
    } else {
      createBanner(formData as CreateAppBannerDto, { onSuccess: closeModal });
    }
  };

  if (currentModal !== "banner_form") return null;

  return (
    <BaseModal
      isOpen={true}
      onClose={closeModal}
      title={
        bannerFormProps?.banner
          ? t("common.edit", "Edit Banner")
          : t("common.create", "Create Banner")
      }
      icon={Wand2}
      maxWidth="max-w-3xl"
      showFooter={!previewMode}
      primaryButton={{
        label: bannerFormProps?.banner
          ? t("common.update", "Update")
          : t("common.create", "Publish"),
        form: "bannerForm",
        type: "submit",
        loading: isCreating || isUpdating,
      }}
      secondaryButton={{
        label: t("common.cancel", "Cancel"),
        onClick: closeModal,
        disabled: isCreating || isUpdating,
      }}
    >
      <div className="flex flex-col gap-6 relative">
        {/* Header extension */}
        <div className="flex justify-end absolute right-2 -top-14 z-50">
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium border border-white/30 text-white hover:bg-white/20 shadow-sm`}
          >
            <Eye size={16} />{" "}
            {previewMode
              ? t("common.edit", "Edit")
              : t("common.preview", "Preview")}
          </button>
        </div>
        {previewMode ? (
          <div className="p-6 bg-surface-hover/50 rounded-2xl flex-1 relative min-h-[300px] border border-border/50">
            <p className="text-center text-text-secondary mb-8 font-medium">
              {t(
                "settings.banners.previewDesc",
                "This is how the banner will appear at the top of the app.",
              )}
            </p>
            <div
              className={`w-full relative z-10 flex items-center justify-center p-3 text-sm transition-all duration-300 font-primary rounded-xl shadow-lg border border-border/30 ${
                formData.color
                  ? ""
                  : formData.variant === "warning"
                    ? "bg-yellow-500 text-yellow-950"
                    : formData.variant === "error"
                      ? "bg-red-600 text-white"
                      : formData.variant === "success"
                        ? "bg-green-600 text-white"
                        : "bg-blue-600 text-white"
              }`}
              style={
                formData.color?.startsWith("#") ||
                formData.color?.startsWith("rgb")
                  ? { backgroundColor: formData.color, color: "#fff" }
                  : {}
              }
            >
              <div className="flex items-center w-full max-w-7xl mx-auto px-4 gap-4">
                <div className="flex-1 text-center font-medium truncate">
                  {formData.translations?.[i18n.language] ||
                    formData.translations?.["en"] ||
                    t("settings.banners.noticeText", "Notice text here")}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {formData.action && formData.action.type !== "none" && (
                    <button
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-sm ${formData.variant === "warning" ? "bg-black/10 hover:bg-black/20" : "bg-black/20 hover:bg-black/30"}`}
                    >
                      {formData.action.type === "link"
                        ? t("common.readMore", "Read More")
                        : t("common.action", "Action")}
                    </button>
                  )}
                  {formData.isRemovable && (
                    <button className="p-1.5 opacity-80 hover:opacity-100 hover:bg-black/10 rounded-full transition-all">
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form id="bannerForm" onSubmit={handleSubmit} className="space-y-8">
            {/* Translations */}
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-surface-hover/30 p-4 rounded-xl border border-border/50">
                <h4 className="font-semibold text-text-primary capitalize tracking-tight flex items-center gap-2">
                  {t("settings.banners.content", "Content & Translations")}
                </h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleTranslate}
                  loading={isTranslating}
                  className="flex items-center gap-2 bg-surface text-primary"
                >
                  <Wand2 size={14} />{" "}
                  {t("settings.banners.autoTranslate", "Auto Translate")}
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-surface-hover/20 rounded-xl border border-border/50">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <div key={lang}>
                    <label className="text-sm font-semibold mb-1.5 block text-text-primary capitalize">
                      {t(
                        `settings.banners.${lang}`,
                        lang === "en" ? "English (Primary)" : `${lang}`,
                      )}
                    </label>
                    <InputField
                      value={formData.translations?.[lang] || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          translations: {
                            ...prev.translations,
                            [lang]: e.target.value,
                          },
                        }))
                      }
                      dir={lang === "ar" ? "rtl" : "ltr"}
                      className="w-full bg-surface"
                      required={lang === "en"}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Appearance */}
            <div className="space-y-4">
              <h4 className="font-semibold text-text-primary capitalize tracking-tight px-1">
                {t("settings.banners.appearance", "Appearance")}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-surface-hover/30 rounded-xl border border-border/50">
                <div className="space-y-2">
                  <CustomSelect
                    title={t("settings.banners.variant", "Variant")}
                    options={[
                      {
                        value: "info",
                        label: t("settings.banners.variantInfo", "Info (Blue)"),
                      },
                      {
                        value: "success",
                        label: t(
                          "settings.banners.variantSuccess",
                          "Success (Green)",
                        ),
                      },
                      {
                        value: "warning",
                        label: t(
                          "settings.banners.variantWarning",
                          "Warning (Yellow)",
                        ),
                      },
                      {
                        value: "error",
                        label: t(
                          "settings.banners.variantError",
                          "Error (Red)",
                        ),
                      },
                    ]}
                    selectedOption={formData.variant || "info"}
                    onChange={(val) =>
                      setFormData((prev) => ({
                        ...prev,
                        variant: val as TopBannerVariant,
                      }))
                    }
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-primary block">
                    {t("settings.banners.customColor", "Custom Color Override")}
                  </label>
                  <InputField
                    placeholder="Hex (e.g. #ff0000)"
                    value={formData.color || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        color: e.target.value,
                      }))
                    }
                    className="w-full bg-surface"
                  />
                </div>
              </div>
            </div>

            {/* Behavior */}
            <div className="space-y-4">
              <h4 className="font-semibold text-text-primary capitalize tracking-tight px-1">
                {t("settings.banners.behavior", "Behavior & Actions")}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                <Checkbox
                  id="isRemovable"
                  label={t(
                    "settings.banners.allowDismissal",
                    "Allow Dismissal",
                  )}
                  description={t(
                    "settings.banners.allowDismissalDesc",
                    "Users can close this banner",
                  )}
                  checked={!!formData.isRemovable}
                  onChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      isRemovable: checked,
                    }))
                  }
                  className="h-full items-center"
                />

                {formData.isRemovable && (
                  <div className="bg-surface-hover/30 p-4 rounded-xl border border-input">
                    <label className="text-sm font-semibold text-text-primary mb-2 block">
                      {t(
                        "settings.banners.reappearAfter",
                        "Reappear after (hours)",
                      )}
                    </label>
                    <InputField
                      type="number"
                      value={formData.frequencyHours ?? 24}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          frequencyHours: Number(e.target.value),
                        }))
                      }
                      min={0}
                      className="w-full bg-surface"
                    />
                    <div className="text-xs text-text-secondary mt-2 px-1">
                      {t(
                        "settings.banners.reappearDesc",
                        "0 means dismissed permanently",
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-surface-hover/30 border border-input rounded-xl shadow-sm">
                <div className="space-y-2">
                  <CustomSelect
                    title={t("settings.banners.actionType", "Action Type")}
                    options={[
                      { value: "none", label: t("common.none", "No Action") },
                      {
                        value: "link",
                        label: t(
                          "settings.banners.actionLink",
                          "External Link",
                        ),
                      },
                      {
                        value: "modal",
                        label: t("settings.banners.actionModal", "Open Modal"),
                      },
                    ]}
                    selectedOption={formData.action?.type || "none"}
                    onChange={(val) =>
                      setFormData((prev) => ({
                        ...prev,
                        action: {
                          ...prev.action!,
                          type: val as any,
                        },
                      }))
                    }
                    className="w-full"
                  />
                </div>

                {formData.action?.type !== "none" && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-text-primary block">
                      {formData.action?.type === "link"
                        ? "URL"
                        : "Modal ID Payload"}
                    </label>
                    <InputField
                      value={formData.action?.payload || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          action: { ...prev.action!, payload: e.target.value },
                        }))
                      }
                      placeholder={
                        formData.action?.type === "link"
                          ? "https://..."
                          : "e.g., subscription_upgrade"
                      }
                      className="w-full bg-surface"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex border-t border-border pt-6">
              <Checkbox
                id="isActive"
                label={t("common.status_active", "Active")}
                description={t(
                  "settings.banners.activeDesc",
                  "Make this banner visible to users immediately",
                )}
                checked={!!formData.isActive}
                onChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    isActive: checked,
                  }))
                }
                className="w-full"
              />
            </div>
          </form>
        )}
      </div>
    </BaseModal>
  );
}
