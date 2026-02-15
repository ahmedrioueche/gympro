import type { LucideIcon } from "lucide-react";
import React from "react";
import GradientCard from "../../../components/ui/GradientCard";

export interface SettingsTabItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface SettingsContainerProps {
  tabs: SettingsTabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  children: React.ReactNode;
}

export default function SettingsContainer({
  tabs,
  activeTab,
  onTabChange,
  children,
}: SettingsContainerProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start relative">
      {/* Sidebar Tabs - Uniform UI, but static on mobile and sticky on desktop */}
      <div className="w-full md:w-72 md:sticky md:top-24 z-20 flex flex-col p-2 bg-surface/90 backdrop-blur-md rounded-[2rem] border border-border/50 shadow-lg md:shadow-sm gap-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center gap-3.5 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                isActive
                  ? "bg-primary text-white shadow-xl shadow-primary/25 md:translate-x-1"
                  : "text-text-secondary hover:bg-surface hover:text-text-primary md:hover:translate-x-1"
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform duration-300 ${
                  isActive ? "scale-110" : "group-hover:scale-110"
                }`}
              />
              <span className="font-semibold text-[0.95rem] whitespace-nowrap overflow-hidden text-ellipsis">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full min-w-0 min-h-[500px]">
        <GradientCard
          className="rounded-[2.25rem] md:rounded-[2.5rem] border-border/60"
          contentClassName="p-5 sm:p-8 md:p-10"
        >
          {children}
        </GradientCard>
      </div>
    </div>
  );
}
