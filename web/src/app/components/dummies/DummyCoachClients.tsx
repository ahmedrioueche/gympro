import {
  AlertCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../../store/language";
import { DummyPageWrapper } from "./DummyPageWrapper";

export const DummyCoachClients = () => {
  const { t } = useTranslation();
  const { isRtl } = useLanguageStore();

  const clients = [
    {
      name: "Emily Davis",
      progress: 85,
      sessions: "12/20",
      goal: "Weight Loss",
      status: "On Track",
    },
    {
      name: "Robert Wilson",
      progress: 60,
      sessions: "8/15",
      goal: "Muscle Gain",
      status: "Needs Review",
    },
    {
      name: "Sophie Brown",
      progress: 92,
      sessions: "18/20",
      goal: "Endurance",
      status: "Excellent",
    },
  ];

  return (
    <DummyPageWrapper
      pageTitle={t("welcomeTour.dummies.coachClients.pageTitle")}
      locationKey="coachClients"
    >
      <div className="w-full max-w-4xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-secondary opacity-50" />
            <input
              type="text"
              placeholder={t("welcomeTour.dummies.coachClients.search")}
              className="w-full pl-9 pr-4 py-2 bg-surface border border-border/40 rounded-xl text-xs font-medium focus:outline-none"
              readOnly
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 bg-background-secondary border border-border/40 rounded-lg text-[9px] font-black uppercase tracking-widest text-text-secondary">
              {t("welcomeTour.dummies.coachClients.filter")}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface border border-border/40 rounded-2xl p-4 shadow-lg flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-text-secondary opacity-60">
                {t("welcomeTour.dummies.coachClients.activeClients")}
              </p>
              <h5 className="text-lg font-black text-text-primary italic leading-none mt-1">
                24 Active
              </h5>
            </div>
          </div>
          <div className="bg-surface border border-border/40 rounded-2xl p-4 shadow-lg flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-text-secondary opacity-60">
                {t("welcomeTour.dummies.coachClients.totalSessions")}
              </p>
              <h5 className="text-lg font-black text-text-primary italic leading-none mt-1">
                156 This Month
              </h5>
            </div>
          </div>
          <div className="bg-surface border border-border/40 rounded-2xl p-4 shadow-lg flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-text-secondary opacity-60">
                {t("welcomeTour.dummies.coachClients.progressAlerts")}
              </p>
              <h5 className="text-lg font-black text-text-primary italic leading-none mt-1">
                3 Pending
              </h5>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-[11px] font-black text-text-secondary uppercase tracking-widest leading-none">
            {t("welcomeTour.dummies.coachClients.title")}
          </h4>
          {clients.map((client, i) => (
            <div
              key={i}
              className="bg-surface border border-border/50 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 hover:border-primary/30 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-base font-black text-white shadow-md">
                  {client.name.charAt(0)}
                </div>
                <div>
                  <h5 className="text-base font-black text-text-primary leading-tight">
                    {client.name}
                  </h5>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">
                      {client.goal}
                    </span>
                    <span className="w-0.5 h-0.5 bg-text-secondary/30 rounded-full" />
                    <span
                      className={`text-[9px] font-black uppercase tracking-widest ${
                        client.status === "Needs Review"
                          ? "text-orange-500"
                          : "text-success"
                      }`}
                    >
                      {client.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="flex-1 md:flex-none text-right">
                  <div className="text-[8px] font-black uppercase tracking-widest text-text-secondary opacity-60 mb-0.5">
                    Completion
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-20 md:w-24 bg-border/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                        style={{ width: `${client.progress}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-black italic text-text-primary">
                      {client.progress}%
                    </span>
                  </div>
                </div>
                <div className="hidden md:block text-right">
                  <div className="text-[8px] font-black uppercase tracking-widest text-text-secondary opacity-60 leading-none">
                    Sessions
                  </div>
                  <div className="text-[11px] font-black italic text-text-primary">
                    {client.sessions}
                  </div>
                </div>
                {isRtl ? (
                  <ChevronLeft className="w-4 h-4 text-text-secondary opacity-40 group-hover:opacity-100 group-hover:-translate-x-1 transition-all" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-text-secondary opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DummyPageWrapper>
  );
};
