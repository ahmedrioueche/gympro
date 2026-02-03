import {
  COMPETITION_TYPES,
  uploadApi,
  type CreateCompetitionDto,
  type UpdateCompetitionDto,
} from "@ahmedrioueche/gympro-client";
import { Camera, Loader2, Plus, Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../../../../components/ui/BaseModal";
import CustomSelect from "../../../../../../../components/ui/CustomSelect";
import InputField from "../../../../../../../components/ui/InputField";
import TextArea from "../../../../../../../components/ui/TextArea";
import {
  useCreateCompetition,
  useUpdateCompetition,
} from "../../../../../../../hooks/queries/useCompetitions";
import { useModalStore } from "../../../../../../../store/modal";

export default function CompetitionModal() {
  const { t } = useTranslation();
  const { currentModal, competitionProps, closeModal } = useModalStore();
  const isOpen = currentModal === "competition";
  const { gymId, competition, onSuccess } = competitionProps || {};
  const isEdit = !!competition;

  const [uploading, setUploading] = useState(false);
  const [bannerImage, setBannerImage] = useState<string | undefined>(
    competition?.bannerImage,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateCompetitionDto>({
    defaultValues: {
      title: competition?.title || "",
      description: competition?.description || "",
      type: competition?.type || "weightlifting",
      startDate: competition?.startDate
        ? new Date(competition.startDate).toISOString().split("T")[0]
        : "",
      endDate: competition?.endDate
        ? new Date(competition.endDate).toISOString().split("T")[0]
        : "",
      prize: competition?.prize || "",
      maxParticipants: competition?.maxParticipants,
      rules: competition?.rules || "",
    },
  });

  const typeValue = watch("type");

  useEffect(() => {
    if (isOpen && competition) {
      reset({
        title: competition.title,
        description: competition.description,
        type: competition.type,
        startDate: new Date(competition.startDate).toISOString().split("T")[0],
        endDate: new Date(competition.endDate).toISOString().split("T")[0],
        prize: competition.prize || "",
        maxParticipants: competition.maxParticipants,
        rules: competition.rules || "",
      });
      setBannerImage(competition.bannerImage);
    } else if (isOpen) {
      reset({
        title: "",
        description: "",
        type: "weightlifting",
        startDate: "",
        endDate: "",
        prize: "",
        rules: "",
      });
      setBannerImage(undefined);
    }
  }, [isOpen, competition, reset]);

  const createMutation = useCreateCompetition();
  const updateMutation = useUpdateCompetition();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadApi.uploadFile(file, "image");
      if (res.success && res.data) {
        setBannerImage(res.data.url);
        toast.success(t("common.uploadSuccess"));
      } else {
        toast.error(res.message || t("common.uploadFailed"));
      }
    } catch (error) {
      toast.error(t("common.uploadError"));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: any) => {
    if (!gymId) return;

    const payload = { ...data, bannerImage };

    try {
      if (isEdit && competition) {
        await updateMutation.mutateAsync({
          gymId,
          id: competition._id,
          data: payload as UpdateCompetitionDto,
        });
        toast.success(t("competitions.update.success"));
      } else {
        await createMutation.mutateAsync({ gymId, data: payload });
        toast.success(t("competitions.create.success"));
      }
      onSuccess?.();
      closeModal();
    } catch (error: any) {
      toast.error(
        error.message ||
          t("common.error", { defaultValue: "Something went wrong" }),
      );
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={closeModal}
      title={
        isEdit
          ? t("competitions.modal.editTitle", {
              defaultValue: "Edit Competition",
            })
          : t("competitions.modal.createTitle", {
              defaultValue: "Create Competition",
            })
      }
      maxWidth="max-w-2xl"
      icon={Plus}
      primaryButton={{
        label: isEdit
          ? t("common.saveChanges")
          : t("competitions.addCompetition"),
        type: "submit",
        form: "competition-form",
        loading: createMutation.isPending || updateMutation.isPending,
        icon: Save,
      }}
      secondaryButton={{
        label: t("common.cancel"),
        onClick: closeModal,
      }}
    >
      <form
        id="competition-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* Banner Upload */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-text-primary uppercase tracking-wider">
            {t("competitions.form.banner")}
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative h-48 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-3 group"
          >
            {bannerImage ? (
              <>
                <img
                  src={bannerImage}
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </>
            ) : (
              <>
                {uploading ? (
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Plus className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-medium text-text-secondary">
                      {t("common.uploading", { defaultValue: "Upload Banner" })}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            className="hidden"
            accept="image/*"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label={t("competitions.form.title")}
            {...register("title", { required: true })}
            error={errors.title?.message}
            placeholder={t("competitions.form.titlePlaceholder")}
          />
          <CustomSelect
            title={t("competitions.form.type")}
            options={COMPETITION_TYPES.map((type) => ({
              value: type,
              label: t(`competitions.types.${type}`, { defaultValue: type }),
            }))}
            selectedOption={typeValue}
            onChange={(val) => setValue("type", val as any)}
          />
        </div>

        <TextArea
          label={t("competitions.form.description")}
          {...register("description", { required: true })}
          error={errors.description?.message}
          rows={3}
          placeholder={t("competitions.form.descriptionPlaceholder")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label={t("competitions.form.startDate")}
            type="date"
            {...register("startDate", { required: true })}
            error={errors.startDate?.message}
          />
          <InputField
            label={t("competitions.form.endDate")}
            type="date"
            {...register("endDate", { required: true })}
            error={errors.endDate?.message}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label={t("competitions.form.prize")}
            {...register("prize")}
            placeholder={t("competitions.form.prizePlaceholder")}
          />
          <InputField
            label={t("competitions.form.maxParticipants")}
            type="number"
            {...register("maxParticipants", { valueAsNumber: true })}
            placeholder="No limit"
          />
        </div>

        <TextArea
          label={t("competitions.form.rules")}
          {...register("rules")}
          rows={4}
          placeholder={t("competitions.form.rulesPlaceholder")}
        />
      </form>
    </BaseModal>
  );
}
