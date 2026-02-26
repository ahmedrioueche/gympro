import { type CreateGymDto } from "@ahmedrioueche/gympro-client";
import { ArrowLeft, ArrowRight, Check, Plus, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../components/ui/BaseModal";
import { useCreateGym, useMyGyms } from "../../../../hooks/queries/useGyms";
import { useModalStore } from "../../../../store/modal";
import { useUserStore } from "../../../../store/user";
import StepBasicInfo from "./StepBasicInfo";
import StepContact from "./StepContact";
import StepLocation from "./StepLocation";

export const CreateGymModal = () => {
  const { t } = useTranslation();
  const { currentModal, closeModal } = useModalStore();
  const isOpen = currentModal === "create_gym";

  const createGymMutation = useCreateGym();
  const { user } = useUserStore();
  const { data: myGyms = [] } = useMyGyms();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CreateGymDto>({
    owner: user?._id || "",
    name: "",
    address: "",
    city: "",
    state: "",
    country: "",
    phone: "",
    email: "",
    website: "",
    slogan: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    latitude: undefined,
    longitude: undefined,
  });

  // Reset form when modal opens/closes
  const handleClose = () => {
    setStep(1);
    setFormData({
      owner: user?._id || "",
      name: "",
      address: "",
      city: "",
      state: "",
      country: "",
      phone: "",
      email: "",
      website: "",
      slogan: "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      latitude: undefined,
      longitude: undefined,
    });
    closeModal();
  };

  // Check for duplicate gym name
  const duplicateGymName = useMemo(() => {
    if (!formData.name || formData.name.trim() === "") return false;
    return myGyms.some(
      (gym) =>
        gym.name.toLowerCase().trim() === formData.name.toLowerCase().trim(),
    );
  }, [formData.name, myGyms]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    // Prevent submission if duplicate name
    if (duplicateGymName) return;

    try {
      // Ensure owner is set from latest user state
      const submissionData = {
        ...formData,
        owner: formData.owner || user?._id || "",
      };

      await createGymMutation.mutateAsync(submissionData);
      handleClose();
    } catch (error) {
      console.error("Failed to create gym:", error);
    }
  };

  if (!isOpen) return null;

  const steps = [
    {
      number: 1,
      title: t("create_gym.steps.basic.title"),
      description: t("create_gym.steps.basic.description"),
      icon: "🏢",
    },
    {
      number: 2,
      title: t("create_gym.steps.location.title"),
      description: t("create_gym.steps.location.description"),
      icon: "📍",
    },
    {
      number: 3,
      title: t("create_gym.steps.contact.title"),
      description: t("create_gym.steps.contact.description"),
      icon: "📞",
    },
  ];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("create_gym.title")}
      subtitle={steps[step - 1].description}
      maxWidth="max-w-2xl"
      icon={Plus}
      primaryButton={{
        label: step < 3 ? t("actions.next") : t("create_gym.form.submit"),
        onClick: step < 3 ? handleNext : handleSubmit,
        disabled:
          (step === 1 && !formData.name) ||
          duplicateGymName ||
          createGymMutation.isPending,
        loading: createGymMutation.isPending,
        icon: step < 3 ? ArrowRight : Check,
      }}
      secondaryButton={{
        label: step === 1 ? t("actions.cancel") : t("actions.back"),
        onClick: step === 1 ? handleClose : handleBack,
        icon: step === 1 ? X : ArrowLeft,
      }}
    >
      <div className="space-y-6">
        {/* Step Indicator (Simple) */}
        <div className="flex items-center justify-between mb-4 px-1">
          {steps.map((s) => (
            <div
              key={s.number}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                step === s.number
                  ? "text-primary"
                  : step > s.number
                    ? "text-success"
                    : "text-text-secondary/50"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${
                  step === s.number
                    ? "border-primary bg-primary/10"
                    : step > s.number
                      ? "border-success bg-success/10 text-success"
                      : "border-border bg-surface text-text-secondary/50"
                }`}
              >
                {step > s.number ? "✓" : s.number}
              </div>
              <span className="hidden sm:inline">{s.title}</span>
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div className="min-h-[300px]">
          {step === 1 && (
            <StepBasicInfo
              formData={formData}
              handleChange={handleChange}
              steps={steps}
              duplicateGymName={duplicateGymName}
            />
          )}

          {step === 2 && (
            <StepLocation
              formData={formData}
              handleChange={handleChange}
              steps={steps}
            />
          )}

          {step === 3 && (
            <StepContact
              formData={formData}
              handleChange={handleChange}
              steps={steps}
            />
          )}
        </div>
      </div>
    </BaseModal>
  );
};

export default CreateGymModal;
