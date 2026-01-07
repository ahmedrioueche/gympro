import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  BarChart3,
  Clock,
  PieChart,
  PlusCircle,
  Settings,
  UserCheck,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../../../constants/navigation";
import { useGymAnalytics } from "../../../../../../hooks/queries/useAnalytics";
import { useGymStore } from "../../../../../../store/gym";
import StatCard from "../../../../../components/analytics/StatCard";
import GymHeroSection from "../../../../../components/gym/GymHeroSection";
import OperatingHours from "../../../../../components/gym/OperatingHours";
import { useGymMemberHome } from "../../member/home/hooks/useGymMemberHome";

export default function HomePage() {
  const { t } = useTranslation();
  const { currentGym } = useGymStore();
  const { data: analytics, isLoading } = useGymAnalytics(currentGym?._id || "");
  const navigate = useNavigate();
  const status = useGymMemberHome(currentGym?.settings);

  if (!currentGym) return null;

  const quickActions = [
    {
      icon: <PlusCircle className="w-8 h-8 md:w-10 md:h-10" />,
      label: t("home.gym.actions.enroll"),
      link: APP_PAGES.gym.manager.createMember.link,
      gradient: "from-blue-500 to-blue-600",
      bgHover: "hover:from-blue-600 hover:to-blue-700",
    },
    {
      icon: <Users className="w-8 h-8 md:w-10 md:h-10" />,
      label: t("home.gym.actions.checkin"),
      link: APP_PAGES.gym.manager.members.link,
      gradient: "from-purple-500 to-purple-600",
      bgHover: "hover:from-purple-600 hover:to-purple-700",
    },
    {
      icon: <AlertCircle className="w-8 h-8 md:w-10 md:h-10" />,
      label: t("home.gym.actions.report"),
      link: "#",
      gradient: "from-rose-500 to-rose-600",
      bgHover: "hover:from-rose-600 hover:to-rose-700",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-8">
        <GymHeroSection
          gym={currentGym}
          status={status}
          action={{
            label: t("home.gym.profile.editGym"),
            onClick: () => {
              navigate({ to: APP_PAGES.gym.manager.settings.link });
            },
            icon: Settings,
          }}
        />

        {/* 2. Branch Performance Stats */}
        <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-sm">
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 border-b border-border">
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              {t("home.gym.stats.title")}
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              {t("home.gym.stats.subtitle")}
            </p>
          </div>

          <div className="p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title={t("home.gym.stats.totalMembers")}
              value={analytics?.metrics.totalMembers || 0}
              icon={Users}
              loading={isLoading}
              color="secondary"
            />
            <StatCard
              title={t("home.gym.stats.activeMembers")}
              value={analytics?.metrics.activeMembers || 0}
              icon={UserCheck}
              color="success"
              loading={isLoading}
            />
            <StatCard
              title={t("home.gym.stats.occupancy")}
              value={`${analytics?.metrics.occupancyRate || 0}%`}
              icon={PieChart}
              color="warning"
              loading={isLoading}
            />
            <StatCard
              title={t("home.gym.stats.checkedIn")}
              value={analytics?.metrics.checkedIn || 0}
              icon={Clock}
              color="primary"
              loading={isLoading}
            />
          </div>
        </div>

        {/* 3. Quick Actions & Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions Grid */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface border border-border rounded-3xl p-6 md:p-8 shadow-sm h-full">
              <h3 className="text-xl font-bold text-text-primary mb-6">
                {t("home.gym.actions.title")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {quickActions.map((action, idx) => (
                  <Link
                    key={idx}
                    to={action.link}
                    className={`bg-gradient-to-br ${action.gradient} ${action.bgHover} p-6 rounded-2xl text-white font-bold text-center hover:scale-[1.03] hover:shadow-xl transition-all duration-300 flex flex-col items-center gap-4 group`}
                  >
                    <div className="p-3 bg-white/20 rounded-2xl group-hover:scale-110 transition-transform">
                      {action.icon}
                    </div>
                    <span className="text-sm md:text-base">{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Gender Split Visual */}
          <div className="bg-surface border border-border rounded-3xl p-6 md:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-text-primary mb-6">
              {t("home.gym.genderSplit.title")}
            </h3>
            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-text-secondary">
                      {t("home.gym.genderSplit.male")}
                    </span>
                    <span className="text-2xl font-black text-blue-500">
                      {analytics?.genderDistribution.male || 0}
                    </span>
                  </div>
                  <span className="text-xs font-bold bg-blue-500/10 text-blue-500 px-2 py-1 rounded-lg">
                    {Math.round(
                      ((analytics?.genderDistribution.male || 0) /
                        (analytics?.metrics.totalMembers || 1)) *
                        100
                    )}
                    %
                  </span>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000"
                    style={{
                      width: `${
                        ((analytics?.genderDistribution.male || 0) /
                          (analytics?.metrics.totalMembers || 1)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-text-secondary">
                      {t("home.gym.genderSplit.female")}
                    </span>
                    <span className="text-2xl font-black text-pink-500">
                      {analytics?.genderDistribution.female || 0}
                    </span>
                  </div>
                  <span className="text-xs font-bold bg-pink-500/10 text-pink-500 px-2 py-1 rounded-lg">
                    {Math.round(
                      ((analytics?.genderDistribution.female || 0) /
                        (analytics?.metrics.totalMembers || 1)) *
                        100
                    )}
                    %
                  </span>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-400 to-pink-600 rounded-full transition-all duration-1000"
                    style={{
                      width: `${
                        ((analytics?.genderDistribution.female || 0) /
                          (analytics?.metrics.totalMembers || 1)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Operating Hours */}
        <div className="grid grid-cols-1 gap-8">
          <OperatingHours settings={currentGym.settings} />
        </div>
      </div>
    </div>
  );
}
