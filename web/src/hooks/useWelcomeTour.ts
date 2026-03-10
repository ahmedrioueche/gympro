import { usersApi } from "@ahmedrioueche/gympro-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useModalStore } from "../store/modal";
import { useUserStore } from "../store/user";

export const useWelcomeTour = () => {
  const { user, setUser } = useUserStore();
  const queryClient = useQueryClient();
  const { openModal } = useModalStore();
  const { pathname } = useLocation();

  // Determine if the user needs to see the tour based on the new role-specific flags
  useEffect(() => {
    // Only show the tour on dashboard routes (member, manager, coach)
    const isDashboardRoute =
      pathname.startsWith("/member") ||
      pathname.startsWith("/manager") ||
      pathname.startsWith("/coach");

    if (!user || !user.profile || !isDashboardRoute) return;

    // Check specific role flag
    let needsTour = false;
    if (user.role === "member") {
      needsTour = user.profile.hasSeenMemberTour === false;
    } else if (user.role === "coach") {
      needsTour = user.profile.hasSeenCoachTour === false;
    } else if (user.role === "manager" || user.role === "owner") {
      needsTour = user.profile.hasSeenManagerTour === false;
    }

    if (needsTour) {
      // Small delay to allow main dashboard to render first for aesthetic reasons
      const timer = setTimeout(() => {
        openModal("welcome_tour", { role: user.role });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [user, openModal, pathname]);

  const completeTourMutation = useMutation<any, any, string>({
    mutationFn: (role: string) => usersApi.completeWelcomeTour(role),
    onSuccess: (response) => {
      // Update the globally cached user
      setUser(response.data);
      if (user?._id) {
        queryClient.setQueryData(["user", user._id], response.data);
      }
    },
    onError: (error: any) => {
      console.error("Failed to mark welcome tour as complete:", error);
      toast.error(error.message || "Failed to complete tour");
    },
  });

  const handleComplete = () => {
    if (user?.role) {
      completeTourMutation.mutate(user.role);
    }
  };

  return {
    isSubmitting: completeTourMutation.isPending,
    handleComplete,
  };
};
