import { type CreateMemberDto, usersApi } from "@ahmedrioueche/gympro-client";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../../constants/navigation";
import { useGymStore } from "../../../../../store/gym";
import StepsNav from "../../../../components/ui/StepsNav";
import StepsNavMobile from "../../../../components/ui/StepsNavMobile";
import Tip from "../../../../components/ui/Tip";
import Header from "./components/Header";
import NavButtons from "./components/NavButtons";
import StepContactPreferences from "./components/StepContactPreferences";
import StepGeneralInfo from "./components/StepGeneralInfo";
import StepSubscriptionInfo from "./components/StepSubscriptionInfo";

type ContactMethod = "email" | "phone";

interface FormData {
  // Step 1: General Info
  email: string;
  phoneNumber: string;
  fullName: string;
  gender: string;
  age: string;

  // Step 2: Subscription Info
  subscriptionTypeId: string;
  subscriptionStartDate: string;
  paymentMethod: string;

  // Step 3: Contact Preferences
  contactMethod: ContactMethod;
  sendWelcomeMessage: boolean;
  notes: string;
}

interface FormErrors {
  email?: string;
  phoneNumber?: string;
  age?: string;
  contact?: string;
  subscriptionTypeId?: string;
  subscriptionStartDate?: string;
}

function CreateMemberPage() {
  const { t } = useTranslation();
  const { currentGym } = useGymStore();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    phoneNumber: "",
    fullName: "",
    gender: "",
    age: "",
    subscriptionTypeId: "",
    subscriptionStartDate: new Date().toISOString().split("T")[0],
    paymentMethod: "",
    contactMethod: "email",
    sendWelcomeMessage: true,
    notes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const steps = [
    {
      number: 1,
      title: t("createMember.steps.general.title"),
      description: t("createMember.steps.general.description"),
      icon: "👤",
    },
    {
      number: 2,
      title: t("createMember.steps.subscription.title"),
      description: t("createMember.steps.subscription.description"),
      icon: "💳",
    },
    {
      number: 3,
      title: t("createMember.steps.contact.title"),
      description: t("createMember.steps.contact.description"),
      icon: "📱",
    },
  ];

  const subscriptionOptions = [
    { value: "", label: t("createMember.form.subscription.placeholder") },
    { value: "regular", label: t("createMember.form.subscription.regular") },
    { value: "coached", label: t("createMember.form.subscription.coached") },
    { value: "yoga", label: t("createMember.form.subscription.yoga") },
    { value: "crossfit", label: t("createMember.form.subscription.crossfit") },
  ];

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phone.length >= 10 && phoneRegex.test(phone);
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: FormErrors = {};

    if (currentStep === 1) {
      // Validate general info
      if (!formData.fullName.trim()) {
        newErrors.contact = t("createMember.validation.nameRequired");
      }

      if (formData.contactMethod === "email") {
        if (!formData.email.trim()) {
          newErrors.contact = t("createMember.validation.contactRequired");
        } else if (!validateEmail(formData.email)) {
          newErrors.email = t("createMember.validation.emailInvalid");
        }
      } else {
        if (!formData.phoneNumber.trim()) {
          newErrors.contact = t("createMember.validation.contactRequired");
        } else if (!validatePhone(formData.phoneNumber)) {
          newErrors.phoneNumber = t("createMember.validation.phoneInvalid");
        }
      }

      if (
        formData.age &&
        (isNaN(Number(formData.age)) || Number(formData.age) < 1)
      ) {
        newErrors.age = t("createMember.validation.ageInvalid");
      }
    }

    if (currentStep === 2) {
      // Validate subscription info (optional for now)
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step !== steps.length || !validateStep(step)) {
      return;
    }

    if (!currentGym) {
      setErrors({ contact: "No gym selected" });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const memberData: CreateMemberDto = {
        gymId: currentGym._id,
        ...(formData.email && { email: formData.email }),
        ...(formData.phoneNumber && { phoneNumber: formData.phoneNumber }),
        ...(formData.fullName && { fullName: formData.fullName }),
        ...(formData.gender && { gender: formData.gender }),
        ...(formData.age && { age: formData.age }),
      };

      await usersApi.createMember(memberData);
      setShowSuccess(true);
    } catch (error: any) {
      setErrors({
        contact: error?.message || t("createMember.error.message"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="bg-surface border border-border rounded-2xl p-8 md:p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-success/20 to-success/10 flex items-center justify-center">
              <span className="text-5xl">✅</span>
            </div>

            <h2 className="text-3xl font-bold text-text-primary mb-4">
              {t("createMember.success.title")}
            </h2>
            <p className="text-text-secondary mb-8 max-w-md mx-auto">
              {t("createMember.success.message")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setShowSuccess(false);
                  setStep(1);
                  setFormData({
                    email: "",
                    phoneNumber: "",
                    fullName: "",
                    gender: "",
                    age: "",
                    subscriptionTypeId: "",
                    subscriptionStartDate: new Date()
                      .toISOString()
                      .split("T")[0],
                    paymentMethod: "",
                    contactMethod: "email",
                    sendWelcomeMessage: true,
                    notes: "",
                  });
                }}
                className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300"
              >
                {t("createMember.success.addAnother")}
              </button>
              <Link
                to={APP_PAGES.gym.members.link}
                className="px-6 py-3 bg-surface border border-border text-text-primary font-semibold rounded-xl hover:border-primary hover:text-primary transition-all duration-300 text-center"
              >
                {t("createMember.success.viewMembers")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* Mobile Layout */}
      <div className="lg:hidden w-full max-w-4xl mx-auto">
        <Header />
        <StepsNavMobile steps={steps} step={step} />

        <form onSubmit={handleSubmit}>
          <div className="bg-surface backdrop-blur-xl border border-border rounded-xl p-6 md:p-8 shadow-2xl">
            {step === 1 && (
              <StepGeneralInfo
                formData={formData}
                errors={errors}
                handleInputChange={handleInputChange}
              />
            )}
            {step === 2 && (
              <StepSubscriptionInfo
                formData={formData}
                handleInputChange={handleInputChange}
              />
            )}
            {step === 3 && (
              <StepContactPreferences
                formData={formData}
                handleInputChange={handleInputChange}
                subscriptionOptions={subscriptionOptions}
              />
            )}

            <NavButtons
              step={step}
              steps={steps}
              isSubmitting={isSubmitting}
              formData={formData}
              handleNext={handleNext}
              handleBack={handleBack}
            />
          </div>

          <Tip
            title={t("createMember.tips.title")}
            description={t("createMember.tips.description")}
          />
        </form>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex lg:gap-6 lg:max-w-7xl lg:mx-auto">
        {/* Left Sidebar - 30% width */}
        <div className="lg:w-[30%] lg:flex lg:flex-col lg:gap-6">
          <Header />
          <StepsNav steps={steps} step={step} />

          {/* Tips at bottom */}
          <div className="mt-auto">
            <Tip
              title={t("createMember.tips.title")}
              description={t("createMember.tips.description")}
            />
          </div>
        </div>

        {/* Right Content - 70% width */}
        <div className="lg:w-[70%]">
          <form onSubmit={handleSubmit} className="h-full">
            <div className="backdrop-blur-xl border border-primary/20 rounded-xl p-8 shadow-2xl shadow-black/50 h-full flex flex-col">
              <div className="flex-1">
                {step === 1 && (
                  <StepGeneralInfo
                    formData={formData}
                    errors={errors}
                    handleInputChange={handleInputChange}
                  />
                )}
                {step === 2 && (
                  <StepSubscriptionInfo
                    formData={formData}
                    handleInputChange={handleInputChange}
                  />
                )}
                {step === 3 && (
                  <StepContactPreferences
                    formData={formData}
                    handleInputChange={handleInputChange}
                    subscriptionOptions={subscriptionOptions}
                  />
                )}
              </div>

              <NavButtons
                step={step}
                steps={steps}
                isSubmitting={isSubmitting}
                formData={formData}
                handleNext={handleNext}
                handleBack={handleBack}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateMemberPage;
