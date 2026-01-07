import {
  BASE_SUBSCRIPTION_TYPES,
  PAYMENT_METHODS,
} from "@ahmedrioueche/gympro-client";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../../../constants/navigation";
import { useGymStore } from "../../../../../../store/gym";
import { useUserStore } from "../../../../../../store/user";
import StepsNav from "../../../../../components/ui/StepsNav";
import StepsNavMobile from "../../../../../components/ui/StepsNavMobile";
import Tip from "../../../../../components/ui/Tip";
import Header from "./components/Header";
import NavButtons from "./components/NavButtons";
import StepContactPreferences from "./components/StepContactPreferences";
import StepGeneralInfo from "./components/StepGeneralInfo";
import StepSubscriptionInfo from "./components/StepSubscriptionInfo";
import { useCreateMemberForm } from "./hooks/useCreateMemberForm";

function CreateMemberPage() {
  const { t } = useTranslation();
  const { currentGym } = useGymStore();
  const { user } = useUserStore();

  const {
    step,
    formData,
    errors,
    isSubmitting,
    showSuccess,
    handleNext,
    handleBack,
    handleInputChange,
    handleSubmit,
    resetForm,
  } = useCreateMemberForm(
    currentGym?._id,
    user?.profile?.email,
    user?.profile?.phoneNumber
  );

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

  const subscriptionOptions = BASE_SUBSCRIPTION_TYPES.map((type) => ({
    value: type,
    label: t(
      `createMember.form.subscription.${type}`,
      type.charAt(0).toUpperCase() + type.slice(1)
    ),
  }));

  const paymentMethodOptions = PAYMENT_METHODS.map((method) => ({
    value: method,
    label: t(
      `createMember.form.payment.${method}`,
      method.charAt(0).toUpperCase() + method.slice(1)
    ),
  }));

  if (showSuccess) {
    return (
      <div className="flex items-center justify-center animate-in fade-in duration-500">
        <div className="max-w-xl w-full">
          <div className="bg-surface border border-border rounded-2xl p-8 md:p-12 text-center shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-success to-primary"></div>

            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center animate-bounce-short">
              <span className="text-5xl">✅</span>
            </div>

            <h2 className="text-3xl font-bold text-text-primary mb-4">
              {t("createMember.success.title")}
            </h2>
            <p className="text-text-secondary mb-8">
              {t("createMember.success.message")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={resetForm}
                className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-300 shadow-lg shadow-primary/25"
              >
                {t("createMember.success.addAnother")}
              </button>
              <Link
                to={APP_PAGES.gym.manager.members.link}
                className="px-6 py-3 bg-surface border border-border text-text-primary font-semibold rounded-xl hover:bg-surface-hover hover:border-text-secondary transition-all duration-300"
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
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 h-full">
      {/* Sidebar */}
      <div className="lg:w-1/3 flex flex-col gap-6">
        <div className="sticky top-6">
          <Header />
          <div className="hidden lg:block mt-8">
            <StepsNav steps={steps} step={step} />
          </div>
          <div className="lg:hidden mt-6">
            <StepsNavMobile steps={steps} step={step} />
          </div>

          <div className="mt-8">
            <Tip
              title={t("createMember.tips.title")}
              description={t("createMember.tips.description")}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:w-2/3">
        <form
          onSubmit={handleSubmit}
          className="bg-surface border border-border rounded-2xl shadow-sm p-6 md:p-8 min-h-[500px] flex flex-col relative"
        >
          {/* Progress bar for mobile */}
          <div
            className="absolute top-0 left-0 h-1 bg-primary transition-all duration-300 ease-out lg:hidden"
            style={{ width: `${(step / steps.length) * 100}%` }}
          ></div>

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
                subscriptionOptions={subscriptionOptions}
                paymentMethodOptions={paymentMethodOptions}
                errors={errors}
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

          <div className="mt-8 pt-6 border-t border-border">
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
  );
}

export default CreateMemberPage;
