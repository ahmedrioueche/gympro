import { Lock, Settings, User } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import PageHeader from "../../../../components/PageHeader";
import PreferencesSettings from "./components/PreferencesSettings";
import ProfileSettings from "./components/ProfileSettings";
import SecuritySettings from "./components/SecuritySettings";

type TabType = "profile" | "preferences" | "security";

export default function SettingsPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  const tabs = [
    {
      id: "profile",
      label: t("member.settings.tabs.profile"),
      icon: User,
    },
    {
      id: "preferences",
      label: t("member.settings.tabs.preferences"),
      icon: Settings,
    },
    {
      id: "security",
      label: t("member.settings.tabs.security"),
      icon: Lock,
    },
  ];

  return (
    <div className="min-h-screen p-3 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader
          title={t("member.settings.pageTitle")}
          subtitle={t("member.settings.pageSubtitle")}
          icon={Settings}
        />

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "text-text-secondary hover:bg-surface hover:text-text-primary"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-surface border border-border rounded-2xl p-6 shadow-sm min-h-[400px]">
            {activeTab === "profile" && <ProfileSettings />}
            {activeTab === "preferences" && <PreferencesSettings />}
            {activeTab === "security" && <SecuritySettings />}
          </div>
        </div>
      </div>
    </div>
  );
}
