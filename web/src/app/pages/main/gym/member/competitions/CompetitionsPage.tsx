import { type Competition } from "@ahmedrioueche/gympro-client";
import { Trophy } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import ErrorComponent from "../../../../../../components/ui/Error";
import Loading from "../../../../../../components/ui/Loading";
import NoData from "../../../../../../components/ui/NoData";
import { SearchInput } from "../../../../../../components/ui/SearchInput";
import { useGymStore } from "../../../../../../store/gym";
import { useModalStore } from "../../../../../../store/modal";
import PageHeader from "../../../../../components/PageHeader";
import { CompetitionCard } from "../../../../../components/cards/CompetitionCard";
import {
  useJoinCompetition,
  useLeaveCompetition,
  useMemberCompetitions,
} from "./hooks/useMemberCompetitions";

export default function CompetitionsPage() {
  const { t } = useTranslation();
  const { currentGym } = useGymStore();
  const { openModal } = useModalStore();
  const gymId = currentGym?._id;

  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: result,
    isLoading,
    isError,
    error,
    refetch,
  } = useMemberCompetitions(gymId, {
    search: searchQuery,
    limit: 20,
  });

  const joinMutation = useJoinCompetition();
  const leaveMutation = useLeaveCompetition();

  const handleJoin = (competition: Competition) => {
    if (!gymId) return;
    joinMutation.mutate(
      { gymId, competitionId: competition._id },
      {
        onSuccess: () => {
          toast.success(t("competitions.joinSuccess"));
          refetch();
        },
        onError: (err: any) => {
          toast.error(err.message || t("common.error"));
        },
      },
    );
  };

  const handleLeave = (competition: Competition) => {
    openModal("confirm", {
      title: t("competitions.leave"),
      text: t("competitions.leaveConfirmMessage", { title: competition.title }),
      confirmText: t("competitions.leave"),
      confirmVariant: "danger",
      onConfirm: () => {
        if (!gymId) return;
        leaveMutation.mutate(
          { gymId, competitionId: competition._id },
          {
            onSuccess: () => {
              toast.success(t("competitions.leaveSuccess"));
              refetch();
            },
            onError: (err: any) => {
              toast.error(err.message || t("common.error"));
            },
          },
        );
      },
    });
  };

  const handleViewDetails = (competition: Competition) => {
    openModal("competition-details", { competition });
  };

  const competitions = result?.data || [];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Trophy}
        title={t("competitions.title")}
        subtitle={t("competitions.memberSubtitle")}
      />

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-surface border border-border p-4 rounded-2xl">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t("competitions.searchPlaceholder")}
          className="w-full md:w-80"
        />
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loading />
        </div>
      ) : isError ? (
        <ErrorComponent
          error={(error as Error)?.message || t("competitions.fetchError")}
        />
      ) : competitions.length === 0 ? (
        <NoData
          icon={Trophy}
          title={
            searchQuery
              ? t("competitions.noResults.title")
              : t("competitions.empty.memberTitle")
          }
          description={
            searchQuery
              ? t("competitions.noResults.message")
              : t("competitions.empty.memberMessage")
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          {competitions.map((competition) => (
            <CompetitionCard
              key={competition._id}
              competition={competition}
              onJoin={handleJoin}
              onLeave={handleLeave}
              onViewDetails={handleViewDetails}
              isJoining={joinMutation.isPending}
              isLeaving={leaveMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}
