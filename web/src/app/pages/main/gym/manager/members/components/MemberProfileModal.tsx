import { useNavigate } from "@tanstack/react-router";
import {
  Calendar,
  CreditCard,
  ExternalLink,
  Mail,
  Pencil,
  Phone,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../../../../constants/navigation";
import { formatDate } from "../../../../../../../utils/date";
import type { MemberDisplay } from "./types";
import { getStatusColor } from "./utils";

interface MemberProfileModalProps {
  member: MemberDisplay;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function MemberProfileModal({
  member,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: MemberProfileModalProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"profile" | "subscription">(
    "profile"
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-surface border border-border rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-bold shadow-lg">
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                member.name.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">
                {member.name}
              </h2>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                  member.status
                )}`}
              >
                {t(`members.status.${member.status}`)}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface-hover transition-colors"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "profile"
                ? "text-primary border-b-2 border-primary"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {t("members.profile.title", "Profile")}
          </button>
          <button
            onClick={() => setActiveTab("subscription")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "subscription"
                ? "text-primary border-b-2 border-primary"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {t("members.profile.subscription", "Subscription")}
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-[50vh]">
          {activeTab === "profile" ? (
            <>
              {/* Email */}
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-text-secondary">
                    {t("members.profile.email", "Email")}
                  </p>
                  <p className="text-sm font-medium text-text-primary">
                    {member.email || "-"}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                <Phone className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-text-secondary">
                    {t("members.profile.phone", "Phone")}
                  </p>
                  <p className="text-sm font-medium text-text-primary">
                    {member.phone || "-"}
                  </p>
                </div>
              </div>

              {/* Join Date */}
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-text-secondary">
                    {t("members.profile.joinDate", "Member Since")}
                  </p>
                  <p className="text-sm font-medium text-text-primary">
                    {formatDate(member.joinDate)}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Subscription Type */}
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                <CreditCard className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-text-secondary">
                    {t("members.profile.subscriptionType", "Subscription Type")}
                  </p>
                  <p className="text-sm font-medium text-text-primary">
                    {member.subscriptionType
                      ? t(
                          `subscriptions.types.${member.subscriptionType}`,
                          member.subscriptionType
                        )
                      : t(
                          "members.profile.noSubscription",
                          "No active subscription"
                        )}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                <User className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-text-secondary">
                    {t("members.profile.membershipStatus", "Status")}
                  </p>
                  <p className="text-sm font-medium text-text-primary">
                    {t(`members.status.${member.status}`)}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        {/* Actions */}
        <div className="flex flex-col gap-3 p-6 border-t border-border">
          <button
            onClick={() => {
              onClose();
              navigate({
                to: `${APP_PAGES.gym.manager.member_profile.link}/${member._id}`,
              });
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <ExternalLink className="w-4 h-4" />
            {t("members.actions.viewFullProfile", "View Full Profile")}
          </button>
          <div className="flex gap-3">
            <button
              onClick={onEdit}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-surface hover:bg-surface-hover text-text-primary font-medium rounded-xl border border-border transition-colors"
            >
              <Pencil className="w-4 h-4" />
              {t("members.actions.edit", "Edit")}
            </button>
            <button
              onClick={onDelete}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-danger/10 text-danger font-medium rounded-xl hover:bg-danger/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              {t("members.actions.delete", "Delete")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
