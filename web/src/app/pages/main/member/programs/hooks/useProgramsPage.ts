import type { TrainingProgram } from "@ahmedrioueche/gympro-client";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../../../constants/navigation";
import {
  useActiveProgram,
  useStartProgram,
} from "../../../../../../hooks/queries/useTraining";
import { useModalStore } from "../../../../../../store/modal";
import { usePrograms } from "../../../../../hooks/usePrograms";

export const useProgramsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { openModal } = useModalStore();
  const [filterSource, setFilterSource] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: programs, isLoading } = usePrograms({
    source: filterSource === "all" ? undefined : filterSource,
    search: searchQuery || undefined,
  });

  const { data: activeProgram } = useActiveProgram();
  const startProgram = useStartProgram();

  const handleUseProgram = (id: string) => {
    // 1. Check if user already has an active program
    if (activeProgram?.status === "active") {
      if (activeProgram.program._id === id) {
        // Already on this program
        navigate({ to: APP_PAGES.member.training.link });
        return;
      }
      // Different program active -> Block and Alert
      toast(t("training.page.start.activeCheck"), {
        icon: "⚠️",
        duration: 4000,
      });
      navigate({ to: APP_PAGES.member.training.link });
      return;
    }

    // 2. Start program
    startProgram.mutate(id, {
      onSuccess: () => {
        navigate({ to: APP_PAGES.member.training.link });
      },
      onError: (error: any) => {
        // Backend might also throw if we race condition, show error
        toast.error(
          error?.response?.data?.message || "Failed to start program"
        );
      },
    });
  };

  const handleViewDetails = (program: TrainingProgram) => {
    openModal("program_details", {
      program,
      isActive:
        activeProgram?.status === "active" &&
        activeProgram.program._id === program._id,
      onUse: handleUseProgram,
    });
  };

  return {
    programs,
    isLoading,
    activeProgram,
    filterSource,
    setFilterSource,
    searchQuery,
    setSearchQuery,
    handleUseProgram,
    handleViewDetails,
    openModal,
  };
};
