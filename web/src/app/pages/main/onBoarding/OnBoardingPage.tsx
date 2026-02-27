import {
  DEFAULT_LANGUAGE,
  usersApi,
  type SupportedCurrency,
  type UserRole,
} from "@ahmedrioueche/gympro-client";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import AnimatedLogo from "../../../../components/ui/AnimatedLogo";
import useScreen from "../../../../hooks/useScreen";
import { useUserStore } from "../../../../store/user";
import { redirectToHomePageAfterTimeout } from "../../../../utils/helper";
import { getMessage, showStatusToast } from "../../../../utils/statusMessage";
import { BaseView } from "./components/views/BaseView";
import { InputView } from "./components/views/InputView";
import { LocationView } from "./components/views/LocationView";
import { QuestionView } from "./components/views/QuestionView";
import { SelectionView } from "./components/views/SelectionView";

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

  // New unified fields:
  address: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;

  bio: string;
  certifications: string[];
  socialMediaLinks: string[];
  documents: { url: string; description: string; type: string }[];

  gymAddress: string;
  gymCity: string;
  gymCountry: string;
  gymPhone: string;
  gymLatitude?: number;
  gymLongitude?: number;
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
    address: "",
    city: "",
    country: "",
    bio: "",
    certifications: [],
    socialMediaLinks: [],
    documents: [],
    gymAddress: "",
    gymCity: "",
    gymCountry: "",
    gymPhone: "",
  });
  const { isMobile } = useScreen();
  const { updateProfile, updateUser } = useUserStore();

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
            address: data.address,
            city: data.city,
            country: data.country,
            latitude: data.latitude,
            longitude: data.longitude,
            bio: data.bio,
            certifications: data.certifications,
            socialMediaLinks: data.socialMediaLinks,
            documents: data.documents,
            gymAddress: data.gymAddress,
            gymCity: data.gymCity,
            gymCountry: data.gymCountry,
            gymPhone: data.gymPhone,
            gymLatitude: data.gymLatitude,
            gymLongitude: data.gymLongitude,
          });
          // Update store with new role and onboarded status
          updateUser({
            role: data.role as "member" | "coach" | "owner",
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
              viewPreference: "table",
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
      case 1: // Owner Check -> Welcome
        setStep(0);
        break;
      case 2: // Gym Name -> Owner Check
        setStep(1);
        break;
      case 2.5: // Gym Location -> Gym Name
        setStep(2);
        break;
      case 5: // Username -> Owner Check
        setStep(1);
        break;
      case 6: // Age -> Username
        setStep(5);
        break;
      case 7: // Gender -> Age
        setStep(6);
        break;
      case 8: // Owner Name -> Gym Location
        setStep(2.5);
        break;
      case 9: // Personal Location -> Gender
        setStep(7);
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
              onClick={() => setStep(1)} // Go straight to Owner Check, skipping Region view
              className="relative overflow-hidden w-full p-5 rounded-2xl bg-gradient-to-r from-primary to-primary-focus text-white font-bold transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 focus:ring-2 focus:ring-primary outline-none group flex items-center justify-center gap-2"
            >
              <span className="relative z-10 flex items-center gap-2">
                {t("onboarding.welcome.start")}
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
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
              updateData("role", "member" as UserRole);
              setStep(5); // Go straight to Username
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
            onNext={() => setStep(2.5)} // Go to Gym Location
            placeholder={t("onboarding.placeholders.gymName")}
            buttonLabel={t("onboarding.actions.next")}
          />
        );

      case 2.5: // Gym Location (Owner)
        return (
          <LocationView
            data={{
              address: data.gymAddress,
              city: data.gymCity,
              country: data.gymCountry || data.country, // Prefill user country if possible later, or just country
              latitude: data.gymLatitude,
              longitude: data.gymLongitude,
            }}
            onChange={(d) => {
              if (d.address !== undefined) updateData("gymAddress", d.address);
              if (d.city !== undefined) updateData("gymCity", d.city);
              // Country overlaps with personal but fine for now
              if (d.country !== undefined) updateData("gymCountry", d.country);
              if (d.latitude !== undefined)
                updateData("gymLatitude", d.latitude);
              if (d.longitude !== undefined)
                updateData("gymLongitude", d.longitude);
            }}
            onNext={() => setStep(8)} // Go to Owner Name
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
              setStep(9); // Go to Personal Location
            }}
            selectedValue={data.gender}
          />
        );

      case 9: // Personal Location (All Users)
        return (
          <LocationView
            data={{
              address: data.address,
              city: data.city,
              country: data.country,
              latitude: data.latitude,
              longitude: data.longitude,
            }}
            onChange={(d) => {
              if (d.address !== undefined) updateData("address", d.address);
              if (d.city !== undefined) updateData("city", d.city);
              if (d.country !== undefined) updateData("country", d.country);
              if (d.latitude !== undefined) updateData("latitude", d.latitude);
              if (d.longitude !== undefined)
                updateData("longitude", d.longitude);
            }}
            onNext={handleFinish}
          />
        );

      case 10: // Success
        return (
          <BaseView
            title={t("onboarding.success.title", "All Set!")}
            subtitle={t(
              "onboarding.success.subtitle",
              "You are ready to start your journey.",
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
    <div className="min-h-screen  flex flex-col relative overflow-hidden">
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
        <div className="w-full flex justify-center w-full px-4">
          {renderStep()}
        </div>
      </main>

      {/* Footer / Back Button */}
      <footer className="px-4 sm:px-8 py-4 sm:py-6 relative z-10 flex justify-start max-w-4xl mx-auto w-full lg:max-w-7xl">
        <button
          disabled={step === 0 || step === 10}
          onClick={prevStep}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-text-primary transition-all duration-300 hover:bg-surface disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed"
        >
          <ArrowLeft size={20} />
          {t("onboarding.actions.previous")}
        </button>
      </footer>
    </div>
  );
}
