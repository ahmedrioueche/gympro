import { Search, Shield, UserPlus, Users, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DummyPageWrapper } from "./DummyPageWrapper";

export const DummyUserManagement = () => {
  const { t } = useTranslation();

  const users = [
    { name: "John Doe", role: "Member", status: "Active", initials: "JD" },
    { name: "Sarah Smith", role: "Coach", status: "Active", initials: "SS" },
    { name: "Mike Johnson", role: "Member", status: "Pending", initials: "MJ" },
    { name: "Emma Wilson", role: "Staff", status: "Active", initials: "EW" },
  ];

  return (
    <DummyPageWrapper
      pageTitle={t("welcomeTour.dummies.managerUsers.pageTitle")}
      locationKey="managerUsers"
    >
      <div className="w-full max-w-4xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-secondary opacity-50" />
            <input
              type="text"
              placeholder={t("welcomeTour.dummies.managerUsers.search")}
              className="w-full pl-9 pr-4 py-2 bg-surface border border-border/40 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              readOnly
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all">
            <UserPlus className="w-3.5 h-3.5" />{" "}
            {t("welcomeTour.dummies.managerUsers.invite")}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface border border-border/40 rounded-2xl p-4 shadow-lg flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-text-secondary opacity-60">
                {t("welcomeTour.dummies.managerUsers.members")}
              </p>
              <h5 className="text-lg font-black text-text-primary italic">
                1,248
              </h5>
            </div>
          </div>
          <div className="bg-surface border border-border/40 rounded-2xl p-4 shadow-lg flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-text-secondary opacity-60">
                {t("welcomeTour.dummies.managerUsers.staff")}
              </p>
              <h5 className="text-lg font-black text-text-primary italic">
                12
              </h5>
            </div>
          </div>
          <div className="bg-surface border border-border/40 rounded-2xl p-4 shadow-lg flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-text-secondary opacity-60">
                {t("welcomeTour.dummies.managerUsers.pending")}
              </p>
              <h5 className="text-lg font-black text-text-primary italic">5</h5>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border/40 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-text-secondary opacity-60">
                    {t("welcomeTour.dummies.managerUsers.user")}
                  </th>
                  <th className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-text-secondary opacity-60">
                    {t("welcomeTour.dummies.managerUsers.role")}
                  </th>
                  <th className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-text-secondary opacity-60 text-right">
                    {t("welcomeTour.dummies.managerUsers.status")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <tr
                    key={i}
                    className="border-b border-border/10 last:border-0 hover:bg-background-secondary/30 transition-colors"
                  >
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/10 to-blue-500/10 flex items-center justify-center text-[10px] font-black text-primary border border-primary/20">
                          {user.initials}
                        </div>
                        <span className="text-xs font-bold text-text-primary">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <span className="text-xs font-medium text-text-secondary">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-end">
                      <span
                        className={`inline-flex px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                          user.status === "Active"
                            ? "bg-success/10 text-success border-success/20"
                            : "bg-orange-500/10 text-orange-500 border-orange-500/20"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DummyPageWrapper>
  );
};
