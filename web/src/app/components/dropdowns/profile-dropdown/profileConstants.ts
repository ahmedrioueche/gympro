import type { DashboardType } from "@ahmedrioueche/gympro-client";
import { Briefcase, Dumbbell, GraduationCap } from "lucide-react";

export const DASHBOARD_CONFIG: Record<
  DashboardType,
  { icon: typeof Dumbbell; label: string; emoji: string }
> = {
  member: { icon: Dumbbell, label: "dashboard.member", emoji: "🏋️" },
  coach: { icon: GraduationCap, label: "dashboard.coach", emoji: "🎓" },
  manager: { icon: Briefcase, label: "dashboard.manager", emoji: "💼" },
};
