import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Clock, Sparkles, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../constants/navigation";

interface PendingCheckInsProps {
  count: number;
}

export default function PendingCheckIns({ count }: PendingCheckInsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all duration-300 h-full">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-black text-text-primary uppercase tracking-tight flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-500" />
          {t("home.coach.pendingCheckIns.title", "Action Required")}
        </h3>
        {count > 0 && (
          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-black uppercase tracking-widest border border-amber-500/20">
            {t("common.pending", "Pending")}
          </span>
        )}
      </div>

      <div className="space-y-4">
        {count > 0 ? (
          <div className="group flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl bg-background border border-border hover:border-amber-500/30 transition-all duration-300 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center transition-transform group-hover:scale-110 duration-500 shadow-inner">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-black text-text-primary uppercase tracking-tight">
                  {t("home.coach.pendingCheckIns.awaiting", {
                    count: count,
                    defaultValue: "{{count}} clients Awaiting Review",
                  })}
                </p>
                <p className="text-[11px] font-bold text-text-secondary leading-tight mt-0.5">
                  {t(
                    "home.coach.pendingCheckIns.description",
                    "New coaching inquiries waiting for your approval",
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate({ to: APP_PAGES.coach.clients.link })}
              className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition-all text-xs font-black uppercase tracking-widest shadow-lg shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {t("home.coach.pendingCheckIns.review", "Review Now")}
            </button>
          </div>
        ) : (
          <div className="text-center py-10 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-3xl bg-surface flex items-center justify-center mb-4 border border-border shadow-inner">
              <Sparkles className="w-8 h-8 text-amber-500/30" />
            </div>
            <p className="text-sm font-black text-text-secondary uppercase tracking-widest">
              {t("home.coach.pendingCheckIns.empty", "Everything is clear")}
            </p>
            <p className="text-[10px] text-text-secondary/60 uppercase mt-1 font-bold">
              {t(
                "home.coach.pendingCheckIns.emptyDesc",
                "No pending client requests",
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
