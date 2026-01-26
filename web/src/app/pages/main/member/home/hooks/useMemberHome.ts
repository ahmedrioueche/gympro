import { format } from "date-fns";
import { useCoachSessions } from "../../../../../../hooks/queries/useSessions";
import { useMySubscription } from "../../../../../../hooks/queries/useSubscription";
import { useUserStore } from "../../../../../../store/user";

export const useMemberHome = () => {
  const { user } = useUserStore();
  const { data: subscription } = useMySubscription();

  // useCoachSessions calls sessionApi.getAll which is now secured on the backend
  // to return only sessions where the current user is either the member or the coach.
  const { data: sessionsData } = useCoachSessions();
  const sessions = Array.isArray(sessionsData)
    ? sessionsData
    : (sessionsData as any)?.data || [];

  // Calculate stats
  // 1. Active Subscriptions
  const activeSubscriptions = subscription ? 1 : 0; // Simplified for single sub model, adjust if list

  // 2. Check-ins (Placeholder until global attendance API)
  const checkIns = 0;

  // 3. Next Class / Session
  const upcomingSessions =
    sessions?.filter((s: any) => new Date(s.startTime) > new Date()) || [];
  const nextSession = upcomingSessions.sort(
    (a: any, b: any) =>
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
  )[0];

  const nextClassLabel = nextSession
    ? format(new Date(nextSession.startTime), "EEE, MMM d")
    : "No upcoming";

  // 4. Streak (Placeholder)
  const daysStreak = 0;

  return {
    user,
    subscription,
    stats: {
      activeSubscriptions,
      checkIns,
      nextClass: nextClassLabel,
      daysStreak,
    },
  };
};
