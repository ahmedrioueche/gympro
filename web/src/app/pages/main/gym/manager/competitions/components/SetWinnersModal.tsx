import { competitionApi } from "@ahmedrioueche/gympro-client";
import { useQueryClient } from "@tanstack/react-query";
import { Medal, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../../../../components/ui/BaseModal";
import CustomSelect from "../../../../../../../components/ui/CustomSelect";
import { useCompetitionParticipants } from "../../../../../../../hooks/queries/useCompetitions";
import { useGymStore } from "../../../../../../../store/gym";
import { useModalStore } from "../../../../../../../store/modal";

export default function SetWinnersModal() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { currentGym } = useGymStore();
  const { currentModal, setWinnersProps, closeModal } = useModalStore();

  const isOpen = currentModal === "set-winners";
  const competition = setWinnersProps?.competition;

  const { data: participants = [], isLoading: isLoadingParticipants } =
    useCompetitionParticipants(currentGym?._id || "", competition?._id || "");

  const [winners, setWinners] = useState<{
    1: string;
    2: string;
    3: string;
  }>({ 1: "", 2: "", 3: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize winners from competition if they exist
  useEffect(() => {
    if (competition?.winners && competition.winners.length > 0) {
      const initialWinners = { 1: "", 2: "", 3: "" };
      competition.winners.forEach((w) => {
        if (w.place === 1 || w.place === 2 || w.place === 3) {
          initialWinners[w.place] = w.userId;
        }
      });
      setWinners(initialWinners);
    }
  }, [competition]);

  if (!isOpen || !competition || !currentGym?._id) return null;

  const handleSetWinner = (place: 1 | 2 | 3, userId: string) => {
    setWinners((prev) => ({ ...prev, [place]: userId }));
  };

  const handleSubmit = async () => {
    const winnersArray = Object.entries(winners)
      .filter(([, userId]) => userId)
      .map(([place, userId]) => {
        const participant = participants.find((p: any) => p._id === userId);
        return {
          place: Number(place) as 1 | 2 | 3,
          userId,
          userName:
            participant?.profile?.fullName ||
            participant?.profile?.username ||
            `User ${userId.slice(-4)}`,
          userAvatar: participant?.profile?.profileImageUrl,
        };
      });

    if (winnersArray.length === 0) {
      toast.error(t("competitions.winners.selectAtLeastOne"));
      return;
    }

    setIsSubmitting(true);
    try {
      await competitionApi.setWinners(
        currentGym._id,
        competition._id,
        winnersArray,
      );
      toast.success(t("competitions.winners.success"));
      queryClient.invalidateQueries({ queryKey: ["competitions"] });
      closeModal();
      if (setWinnersProps?.onSuccess) setWinnersProps.onSuccess();
    } catch (err: any) {
      toast.error(err.message || t("common.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMedalColor = (place: number) => {
    switch (place) {
      case 1:
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/30";
      case 2:
        return "text-gray-400 bg-gray-400/10 border-gray-400/30";
      case 3:
        return "text-amber-600 bg-amber-600/10 border-amber-600/30";
      default:
        return "";
    }
  };

  const isUserSelectedElsewhere = (userId: string, currentPlace: number) => {
    return Object.entries(winners).some(
      ([place, id]) => id === userId && Number(place) !== currentPlace,
    );
  };

  const participantOptions = participants.map((p: any) => ({
    value: p._id,
    label: p.profile?.fullName || p.profile?.username || "Unknown",
    flag: p.profile?.profileImageUrl, // Using flag for avatar
  }));

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={closeModal}
      title={t("competitions.winners.setWinners")}
      subtitle={competition.title}
      icon={Trophy}
      maxWidth="max-w-lg"
      primaryButton={{
        label: isSubmitting ? t("common.saving") : t("common.save"),
        onClick: handleSubmit,
        loading: isSubmitting,
        disabled: participants.length === 0,
      }}
    >
      <div className="space-y-6">
        {isLoadingParticipants ? (
          <div className="text-center py-8 text-text-secondary">
            {t("common.loading")}
          </div>
        ) : participants.length === 0 ? (
          <div className="text-center py-8 text-text-secondary">
            {t("competitions.winners.noParticipants")}
          </div>
        ) : (
          <>
            {/* Winner Selection */}
            {([1, 2, 3] as const).map((place) => (
              <div key={place} className="space-y-2">
                <CustomSelect
                  title={
                    place === 1
                      ? "🥇 1st Place"
                      : place === 2
                        ? "🥈 2nd Place"
                        : "🥉 3rd Place"
                  }
                  options={participantOptions.filter(
                    (opt) => !isUserSelectedElsewhere(opt.value, place),
                  )}
                  selectedOption={winners[place]}
                  onChange={(val) => handleSetWinner(place, val)}
                  searchable
                  placeholder={t("competitions.winners.selectParticipant")}
                />
              </div>
            ))}

            {/* Preview Section */}
            {(winners[1] || winners[2] || winners[3]) && (
              <div className="pt-4 border-t border-border">
                <p className="text-sm font-bold text-text-secondary mb-3 uppercase tracking-wider text-[10px]">
                  {t("competitions.winners.preview")}
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {([1, 2, 3] as const).map(
                    (place) =>
                      winners[place] && (
                        <div
                          key={place}
                          className="flex items-center justify-between p-3 bg-surface-secondary rounded-xl border border-border/50"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getMedalColor(place)} border shadow-sm`}
                            >
                              {place}
                            </div>
                            <span className="text-sm font-medium text-text-primary">
                              {participants.find(
                                (p: any) => p._id === winners[place],
                              )?.profile?.fullName ||
                                participants.find(
                                  (p: any) => p._id === winners[place],
                                )?.profile?.username ||
                                "Unknown"}
                            </span>
                          </div>
                          <Medal
                            className={`w-4 h-4 ${getMedalColor(place).split(" ")[0]}`}
                          />
                        </div>
                      ),
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </BaseModal>
  );
}
