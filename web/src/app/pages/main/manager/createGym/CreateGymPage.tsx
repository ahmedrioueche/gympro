import type { CreateGymDto } from "@ahmedrioueche/gympro-client";
import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCreateGym, useMyGyms } from "../../../../../hooks/queries/useGyms";
import { useUserStore } from "../../../../../store/user";
import StepsNav from "../../../../components/ui/StepsNav";
import StepsNavMobile from "../../../../components/ui/StepsNavMobile";
import Tip from "../../../../components/ui/Tip";
import Header from "./components/Header";
import NavButtons from "./components/NavButtons";
import StepBasicInfo from "./components/StepBasicInfo";
import StepContact from "./components/StepContact";
import StepLocation from "./components/StepLocation";

function CreateGymPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
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

  // Check for duplicate gym name
  const duplicateGymName = useMemo(() => {
    if (!formData.name || formData.name.trim() === "") return false;
    return myGyms.some(
      (gym) =>
        gym.name.toLowerCase().trim() === formData.name.toLowerCase().trim()
    );
  }, [formData.name, myGyms]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent submission if not on the last step or duplicate name
    if (step !== 3 || duplicateGymName) return;

    const dataToSubmit = { ...formData };

    try {
      await createGymMutation.mutateAsync(dataToSubmit);
      navigate({ to: "/manager/gyms" });
    } catch (error) {
      console.error("Failed to create gym:", error);
    }
  };

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
    <div className="lg:hidden w-full ">
      <Header />
      <StepsNavMobile steps={steps} step={step} />

      <form onSubmit={handleSubmit}>
        <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6 md:p-8 shadow-2xl shadow-black/50">
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

          <NavButtons
            step={step}
            setStep={setStep}
            navigate={navigate}
            formData={formData}
            isPending={createGymMutation.isPending}
            duplicateGymName={duplicateGymName}
          />
        </div>

        <Tip
          title={t("create_gym.tips.title")}
          description={t("create_gym.tips.description")}
        />
      </form>

      {/* Desktop Layout */}
      <div className="hidden lg:flex lg:gap-6">
        {/* Left Sidebar - 30% width */}
        <div className="lg:w-[30%] lg:flex lg:flex-col lg:gap-6">
          <Header />

          <StepsNav steps={steps} step={step} />

          {/* Tips at bottom */}
          <div className="mt-auto">
            <Tip
              title={t("create_gym.tips.title")}
              description={t("create_gym.tips.description")}
            />
          </div>
        </div>

        {/* Right Content - 70% width */}
        <div className="lg:w-[70%]">
          <form onSubmit={handleSubmit} className="h-full">
            <div className="backdrop-blur-xl border border-primary/20 rounded-xl p-8 shadow-2xl shadow-black/50 h-full flex flex-col">
              <div className="flex-1">
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

              <NavButtons
                step={step}
                setStep={setStep}
                navigate={navigate}
                formData={formData}
                isPending={createGymMutation.isPending}
                duplicateGymName={duplicateGymName}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateGymPage;
