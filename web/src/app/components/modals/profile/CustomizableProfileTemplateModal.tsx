import { type User } from "@ahmedrioueche/gympro-client";
import { Mail, MapPin, Phone, User as UserIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../components/ui/BaseModal";
import { openGmail, openWhatsApp } from "../../../../utils/contact";
import { cn } from "../../../../utils/helper";
import {
  ProfileModalFooter,
  type ProfileModalAction,
} from "./ProfileModalFooter";

interface ProfileTab {
  id: string;
  label: string;
  count?: number;
  content: ReactNode;
  icon?: any;
}

interface CustomizableProfileTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User;
  heroRightContent?: ReactNode;
  /** Structured action buttons for the footer */
  actions?: ProfileModalAction[];
  tabs?: ProfileTab[];
  title?: string;
  isLoading?: boolean;
  /** Custom close button label */
  closeLabel?: string;
}

export function CustomizableProfileTemplateModal({
  isOpen,
  onClose,
  user,
  heroRightContent,
  actions = [],
  tabs = [],
  title,
  isLoading,
  closeLabel,
}: CustomizableProfileTemplateModalProps) {
  const { t } = useTranslation();
  const [activeTabId, setActiveTabId] = useState<string>(
    tabs[0]?.id || "overview"
  );

  const activeTabContent = tabs.find((t) => t.id === activeTabId)?.content;

  if (!user && !isLoading) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        title || user?.profile?.fullName || t("memberProfile.unknownMember")
      }
      subtitle={user?.profile.email || ""}
      icon={UserIcon}
      maxWidth="max-w-5xl"
      showFooter={true}
      footer={
        <ProfileModalFooter
          onClose={onClose}
          actions={actions}
          closeLabel={closeLabel}
        />
      }
    >
      <div className="space-y-6">
        {/* Profile Header Block */}
        <div className="relative overflow-hidden bg-surface border border-border rounded-3xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -mr-20 -mt-20 opacity-50" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 blur-[100px] rounded-full -ml-20 -mb-20 opacity-30" />

          <div className="relative p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-start">
              {/* Left: Avatar & Info */}
              <div className="flex gap-6 items-start">
                <div className="relative flex-shrink-0">
                  {user?.profile?.profileImageUrl ? (
                    <img
                      src={user.profile.profileImageUrl}
                      alt={user.profile.fullName || ""}
                      className="w-24 h-24 lg:w-28 lg:h-28 rounded-2xl object-cover ring-2 ring-border shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 lg:w-28 lg:h-28 bg-surface-hover flex items-center justify-center rounded-2xl ring-2 ring-border shadow-lg">
                      <UserIcon className="w-12 h-12 text-text-secondary" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-4">
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-text-primary mb-2">
                      {user?.profile?.fullName ||
                        t("memberProfile.unknownMember")}
                    </h1>
                    <div className="flex flex-wrap gap-2">
                      {user?.profile?.gender && (
                        <span className="px-3 py-1 bg-surface-hover text-text-secondary text-xs font-semibold uppercase tracking-wider rounded-lg border border-border">
                          {user.profile.gender}
                        </span>
                      )}
                      {user?.profile?.age && (
                        <span className="px-3 py-1 bg-surface-hover text-text-secondary text-xs font-semibold uppercase tracking-wider rounded-lg border border-border">
                          {user.profile.age} {t("common.years")}
                        </span>
                      )}
                      {user?._id && (
                        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider rounded-lg border border-primary/20">
                          ID: {user._id.slice(-8)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Contact Infos */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {(() => {
                      const isEmailContactable =
                        user?.profile?.email &&
                        !user.profile.email.startsWith("no_contact");
                      return (
                        <div
                          onClick={() =>
                            isEmailContactable && openGmail(user.profile.email)
                          }
                          className={cn(
                            "flex items-center gap-3 transition-colors",
                            isEmailContactable
                              ? "text-text-secondary cursor-pointer hover:text-primary"
                              : "text-text-secondary opacity-50 cursor-auto"
                          )}
                        >
                          <Mail className="w-4 h-4" />
                          <span className="text-sm font-medium truncate">
                            {isEmailContactable
                              ? user.profile.email
                              : t("memberProfile.noEmail")}
                          </span>
                        </div>
                      );
                    })()}

                    {(() => {
                      const isPhoneContactable = !!user?.profile?.phoneNumber;
                      return (
                        <div
                          onClick={() =>
                            isPhoneContactable &&
                            openWhatsApp(user.profile.phoneNumber)
                          }
                          className={cn(
                            "flex items-center gap-3 transition-colors",
                            isPhoneContactable
                              ? "text-text-secondary cursor-pointer hover:text-primary"
                              : "text-text-secondary opacity-50 cursor-auto"
                          )}
                        >
                          <Phone className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {isPhoneContactable
                              ? user.profile.phoneNumber
                              : t("memberProfile.noPhone")}
                          </span>
                        </div>
                      );
                    })()}

                    {/* Location */}
                    {(user?.profile?.city ||
                      user?.profile?.state ||
                      user?.profile?.country) && (
                      <div className="flex items-center gap-3 text-text-secondary lg:col-span-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {[
                            user?.profile?.city,
                            user?.profile?.state,
                            user?.profile?.country,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Hero Content (Subscription, etc.) */}
              {heroRightContent && (
                <div className="w-full lg:w-[340px]">{heroRightContent}</div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Content */}
        {tabs.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-1 border-b border-border overflow-x-auto hide-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={cn(
                    "px-6 py-3 text-sm font-semibold relative transition-colors whitespace-nowrap flex items-center gap-2",
                    activeTabId === tab.id
                      ? "text-primary"
                      : "text-text-secondary hover:text-text-primary"
                  )}
                >
                  {tab.icon && <tab.icon className="w-4 h-4" />}
                  {tab.label}
                  {tab.count !== undefined && (
                    <span
                      className={cn(
                        "px-1.5 py-0.5 rounded-md text-[10px]",
                        activeTabId === tab.id
                          ? "bg-primary/10"
                          : "bg-surface-hover"
                      )}
                    >
                      {tab.count}
                    </span>
                  )}
                  {activeTabId === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                  )}
                </button>
              ))}
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              {activeTabContent}
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  );
}

// Re-export the action type for consumers
export type { ProfileModalAction };
