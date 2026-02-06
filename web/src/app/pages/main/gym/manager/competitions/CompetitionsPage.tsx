import { type Competition } from "@ahmedrioueche/gympro-client";
import { Plus, Trophy } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import ErrorComponent from "../../../../../../components/ui/Error";
import Loading from "../../../../../../components/ui/Loading";
import NoData from "../../../../../../components/ui/NoData";
import { SearchInput } from "../../../../../../components/ui/SearchInput";
import {
  useCompetitions,
  useDeleteCompetition,
} from "../../../../../../hooks/queries/useCompetitions";
import { useGymStore } from "../../../../../../store/gym";
import { useModalStore } from "../../../../../../store/modal";
import PageHeader from "../../../../../components/PageHeader";
import { CompetitionCard } from "../../../../../components/cards/CompetitionCard";

export default function CompetitionsPage() {
  const { t } = useTranslation();
  const { currentGym } = useGymStore();
  const { openModal } = useModalStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: result,
    isLoading,
    isError,
    error,
    refetch,
  } = useCompetitions(currentGym?._id, {
    search: searchQuery,
    page: currentPage,
    limit: 12,
  });

  const deleteMutation = useDeleteCompetition();

  const handleAddCompetition = () => {
    if (!currentGym?._id) return;
    openModal("competition", {
      gymId: currentGym._id,
      onSuccess: () => refetch(),
    });
  };

  const handleEditCompetition = (competition: Competition) => {
    if (!currentGym?._id) return;
    openModal("competition", {
      gymId: currentGym._id,
      competition,
      onSuccess: () => refetch(),
    });
  };

  const handleDeleteCompetition = (competition: Competition) => {
    openModal("confirm", {
      title: t("competitions.delete.title"),
      text: t("competitions.delete.confirmMessage", {
        title: competition.title,
      }),
      confirmText: t("common.delete"),
      confirmVariant: "danger",
      onConfirm: async () => {
        try {
          if (!currentGym?._id) return;
          await deleteMutation.mutateAsync({
            gymId: currentGym._id,
            id: competition._id,
          });
          toast.success(t("competitions.delete.success"));
        } catch (err: any) {
          toast.error(err.message || t("common.error"));
        }
      },
    });
  };

  const handleSetWinners = (competition: Competition) => {
    openModal("set-winners", {
      competition,
      onSuccess: () => refetch(),
    });
  };

  const handleViewDetails = (competition: Competition) => {
    openModal("competition-details", {
      competition,
      gymId: currentGym?._id,
    });
  };

  const handleViewParticipants = (competition: Competition) => {
    handleViewDetails(competition);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Trophy}
        title={t("competitions.title")}
        subtitle={t("competitions.subtitle")}
        actionButton={{
          label: t("competitions.addCompetition"),
          onClick: handleAddCompetition,
          icon: Plus,
        }}
      />

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-surface border border-border p-4 rounded-2xl">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t("competitions.searchPlaceholder")}
          className="w-full md:w-80"
        />
        {/* Placeholder for future filters (status, type) */}
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loading />
        </div>
      ) : isError ? (
        <ErrorComponent
          error={error?.message || t("competitions.fetchError")}
        />
      ) : result?.data.length === 0 ? (
        <NoData
          icon={Trophy}
          title={
            searchQuery
              ? t("competitions.noResults.title")
              : t("competitions.empty.title")
          }
          description={
            searchQuery
              ? t("competitions.noResults.message")
              : t("competitions.empty.message")
          }
          actionButton={
            !searchQuery
              ? {
                  label: t("competitions.empty.action"),
                  icon: Plus,
                  onClick: handleAddCompetition,
                }
              : undefined
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          {result?.data.map((competition) => (
            <CompetitionCard
              key={competition._id}
              competition={competition}
              onEdit={handleEditCompetition}
              onDelete={handleDeleteCompetition}
              onSetWinners={handleSetWinners}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
}
