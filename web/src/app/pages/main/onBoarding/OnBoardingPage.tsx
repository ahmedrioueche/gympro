import {
  DEFAULT_LANGUAGE,
  usersApi,
  type SupportedCurrency,
  type UserRole,
} from "@ahmedrioueche/gympro-client";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import AnimatedLogo from "../../../../components/ui/AnimatedLogo";
import { useRegionDetection } from "../../../../hooks/useRegionDetection";
import useScreen from "../../../../hooks/useScreen";
import { useUserStore } from "../../../../store/user";
import { redirectToHomePageAfterTimeout } from "../../../../utils/helper";
import { getMessage, showStatusToast } from "../../../../utils/statusMessage";
import {
  BaseView,
  InputView,
  QuestionView,
  SelectionView,
} from "./components/OnboardingViews";
import { RegionCurrencyView } from "./components/RegionCurrencyView";

type OnboardingData = {
  role: UserRole | null;
  gymName: string;
  ownerName: string;
  experience: string;
  username: string;
  age: string;
  gender: string;
  region: string;
  regionName: string;
  currency: SupportedCurrency;
  timezone?: string;
};

export function OnboardingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    role: null,
    gymName: "",
    ownerName: "",
    experience: "",
    username: "",
    age: "",
    gender: "",
    region: "DZ",
    regionName: "Algeria",
    currency: "DZD",
    timezone: "Africa/Algiers",
  });
  const { isMobile } = useScreen();
  const { updateProfile, updateUser } = useUserStore();

  // Use the region detection hook
  const {
    regionData,
    isLoading: isDetectingRegion,
  } = useRegionDetection({
    autoDetect: true,
    onDetected: (detected) => {
      setData((prev) => ({
        ...prev,
        region: detected?.region?.toUpperCase() || prev.region,
        regionName: detected.regionName,
        currency: detected.currency,
        timezone: detected.timezone,
      }));
    },
    onError: (error) => {
      console.error("Failed to detect region:", error);
      // Optionally show a toast notification
      // toast.error(t("onboarding.errors.regionDetection"));
    },
  });

  // Sync regionData to onboarding data whenever it changes
  useEffect(() => {
    setData((prev) => ({
      ...prev,
      region: regionData.region,
      regionName: regionData.regionName,
      currency: regionData.currency,
      timezone: regionData.timezone,
    }));
  }, [regionData]);

  const updateData = (key: keyof OnboardingData, value: any) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleFinish = () => {
    setStep(10);
  };

  useEffect(() => {
    if (step === 10) {
      const complete = async () => {
        try {
          console.log("Onboarding finished:", data);
          await usersApi.completeOnboarding({
            role: data.role as string,
            gymName: data.gymName,
            ownerName: data.ownerName,
            experience: data.experience,
            username: data.username,
            age: data.age,
            gender: data.gender,
            region: data.region,
            regionName: data.regionName,
            currency: data.currency,
            timezone: data.timezone,
          });
          // Update store with new role and onboarded status
          updateUser({
            role: data.role as UserRole,
            appSettings: {
              locale: {
                language: DEFAULT_LANGUAGE,
                region: data.region,
                regionName: data.regionName,
                currency: data.currency,
                timezone: data.timezone,
              },
              theme: "auto",
              notifications: undefined,
            },
          });
          updateProfile({ isOnBoarded: true });

          redirectToHomePageAfterTimeout(data.role as UserRole, 3000, navigate);
        } catch (error) {
          console.error("Failed to complete onboarding:", error);
          const msg = getMessage(error, t);
          showStatusToast(msg, toast);
        }
      };
      complete();
    }
  }, [step, data, navigate]);

  const prevStep = () => {
    switch (step) {
      case 0: // Welcome - No back
        return;
      case 0.5: // Region/Currency -> Welcome
        setStep(0);
        break;
      case 1: // Owner Check -> Region/Currency
        setStep(0.5);
        break;
      case 2: // Gym Name -> Owner Check
        setStep(1);
        break;
      case 3: // Coach Check -> Owner Check
        setStep(1);
        break;
      case 4: // Experience -> Coach Check
        setStep(3);
        break;
      case 5: // Username -> Experience (if coach) or Coach Check (if member)
        if (data.role === "coach") {
          setStep(4);
        } else {
          setStep(3);
        }
        break;
      case 6: // Age -> Username
        setStep(5);
        break;
      case 7: // Gender -> Age
        setStep(6);
        break;
      case 8: // Owner Name -> Gym Name
        setStep(2);
        break;
      case 10: // Success - No back
        return;
      default:
        setStep((s) => Math.max(0, s - 1));
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0: // Welcome
        return (
          <BaseView
            title={t("onboarding.welcome.title")}
            subtitle={t("onboarding.welcome.subtitle")}
          >
            <button
              onClick={() => setStep(0.5)}
              className="w-full p-4 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/25"
            >
              {t("onboarding.welcome.start")}
            </button>
          </BaseView>
        );

      case 1: // Owner Check
        return (
          <QuestionView
            question={t("onboarding.questions.isOwner")}
            onYes={() => {
              updateData("role", "owner" as UserRole);
              setStep(2); // Go to Gym Name
            }}
            onNo={() => {
              setStep(3); // Go to Coach Check
            }}
            yesLabel={t("onboarding.actions.yes")}
            noLabel={t("onboarding.actions.no")}
          />
        );

      case 2: // Gym Name (Owner)
        return (
          <InputView
            title={t("onboarding.questions.gymName")}
            value={data.gymName}
            onChange={(val) => updateData("gymName", val)}
            onNext={() => setStep(8)} // Go to Owner Name
            placeholder={t("onboarding.placeholders.gymName")}
            buttonLabel={t("onboarding.actions.next")}
          />
        );

      case 8: // Owner Name (Owner) - New Step
        return (
          <InputView
            title={t("onboarding.questions.username")}
            value={data.ownerName}
            onChange={(val) => updateData("ownerName", val)}
            onNext={handleFinish}
            placeholder={t("onboarding.placeholders.username")}
            buttonLabel={t("onboarding.actions.finish")}
          />
        );

      case 0.5: // Region/Currency Selection
        return (
          <RegionCurrencyView
            selectedRegion={data.region}
            selectedCurrency={data.currency}
            onRegionChange={(region, regionName, currency) => {
              setData((prev) => ({ ...prev, region, regionName, currency }));
            }}
            onNext={() => setStep(1)}
            isDetecting={isDetectingRegion}
          />
        );

      case 3: // Coach Check
        return (
          <QuestionView
            question={t("onboarding.questions.isCoach")}
            onYes={() => {
              updateData("role", "coach" as UserRole);
              setStep(4); // Go to Experience
            }}
            onNo={() => {
              updateData("role", "member" as UserRole);
              setStep(5); // Go to Username
            }}
            yesLabel={t("onboarding.actions.yes")}
            noLabel={t("onboarding.actions.no")}
          />
        );

      case 4: // Experience (Coach)
        return (
          <InputView
            title={t("onboarding.questions.experience")}
            value={data.experience}
            onChange={(val) => updateData("experience", val)}
            onNext={() => setStep(5)} // Go to Username
            placeholder={t("onboarding.placeholders.experience")}
            type="number"
            buttonLabel={t("onboarding.actions.next")}
          />
        );

      case 5: // Username
        return (
          <InputView
            title={t("onboarding.questions.username")}
            value={data.username}
            onChange={(val) => updateData("username", val)}
            onNext={() => setStep(6)} // Go to Age
            placeholder={t("onboarding.placeholders.username")}
            buttonLabel={t("onboarding.actions.next")}
          />
        );

      case 6: // Age
        return (
          <InputView
            title={t("onboarding.questions.age")}
            value={data.age}
            onChange={(val) => updateData("age", val)}
            onNext={() => setStep(7)} // Go to Gender
            placeholder={t("onboarding.placeholders.age")}
            type="number"
            buttonLabel={t("onboarding.actions.next")}
          />
        );

      case 7: // Gender
        return (
          <SelectionView
            title={t("onboarding.questions.gender")}
            options={[
              { label: t("onboarding.options.male"), value: "male" },
              { label: t("onboarding.options.female"), value: "female" },
            ]}
            onSelect={(val) => {
              updateData("gender", val);
              handleFinish();
            }}
            selectedValue={data.gender}
          />
        );

      case 10: // Success
        return (
          <BaseView
            title={t("onboarding.success.title", "All Set!")}
            subtitle={t(
              "onboarding.success.subtitle",
              "You are ready to start your journey."
            )}
          >
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
          </BaseView>
        );

      default:
        return null;
    }
  };

  // Calculate progress (approximate based on max steps)
  const totalSteps = 10; // Max possible steps

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-8 py-4 sm:py-6 gap-3 relative z-10">
        <AnimatedLogo
          height="h-10"
          leftPosition={isMobile ? "50%" : "20%"}
          logoSize="h-14 w-14"
          textSize="md:text-2xl text-xl"
        />
        {/* Step Indicators */}
        <div className="flex items-center gap-2 sm:gap-3">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === step
                  ? "w-8 bg-primary"
                  : index < step
                  ? "w-2 bg-primary/50"
                  : "w-2 bg-border"
              }`}
            />
          ))}
        </div>
      </header>

      {/* Main Content Area - Split Screen */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center w-full mx-auto  gap-8 lg:gap-16">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 pointer-events-none"
          style={{
            backgroundImage: "url(/images/gym_bg.png)",
            zIndex: 0,
          }}
        />
        <div className="w-full flex justify-center">
          <div className="w-full max-w-md">{renderStep()}</div>
        </div>
      </main>

      {/* Footer / Back Button */}
      <footer className="px-4 sm:px-8 py-4 sm:py-6 relative z-10 flex justify-start max-w-4xl mx-auto w-full lg:max-w-7xl">
        <button
          disabled={step === 0 || step === 10}
          onClick={prevStep}
          className="px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:bg-surface text-text-primary flex items-center gap-2"
        >
          {t("onboarding.actions.previous")}
        </button>
      </footer>
    </div>
  );
}
