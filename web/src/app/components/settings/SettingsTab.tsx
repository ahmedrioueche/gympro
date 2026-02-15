import type { LucideIcon } from "lucide-react";
import React from "react";

interface SettingsTabProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
}

export default function SettingsTab({
  title,
  description,
  icon: Icon,
  children,
  headerAction,
}: SettingsTabProps) {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-8 border-b border-border/50">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 shadow-inner">
            <Icon className="w-7 h-7 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-text-primary tracking-tight">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-text-secondary max-w-2xl leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
        {headerAction && <div className="flex-shrink-0">{headerAction}</div>}
      </div>

      {/* Tab Content */}
      <div className="space-y-8">{children}</div>
    </div>
  );
}
