import type { GymStatus } from "../app/pages/main/gym/member/home/hooks/useGymMemberHome";

// Gym Status Styling
export const getGymStatusStyles = (status?: GymStatus) => {
  if (!status)
    return {
      gradient: "from-primary/20 via-primary/20 to-secondary/20",
      textGradient: "from-primary via-primary to-secondary",
      badge: "bg-primary text-white",
      glow: "shadow-primary/20",
    };

  if (!status.isOpen) {
    return {
      gradient: "from-red-500/20 via-rose-500/20 to-pink-500/20",
      textGradient: "from-red-600 via-rose-600 to-pink-600",
      badge: "bg-error text-white",
      glow: "shadow-red-500/20",
    };
  }
  if (status.isWomenOnly) {
    return {
      gradient: "from-pink-500/20 via-fuchsia-500/20 to-purple-500/20",
      textGradient: "from-pink-600 via-fuchsia-600 to-purple-600",
      badge: "bg-pink-500 text-white",
      glow: "shadow-pink-500/20",
    };
  }
  return {
    gradient: "from-emerald-500/20 via-teal-500/20 to-cyan-500/20",
    textGradient: "from-emerald-600 via-teal-600 to-cyan-600",
    badge: "bg-success text-white",
    glow: "shadow-emerald-500/20",
  };
};

export const getGymStatusText = (status: GymStatus, t: any) => {
  if (!status.isOpen) return t("home.gym.status.closed", "Closed");
  if (status.isWomenOnly)
    return t("home.gym.status.womenOnly", "Women Only Now");
  if (status.currentSession === "menOnly")
    return t("home.gym.status.menOnly", "Men Only Now");
  return t("home.gym.status.open", "Open Now");
};
