import { useGymStore } from "../../../../../../../store/gym";
import { useGymMemberHome } from "../../../member/home/hooks/useGymMemberHome";

export function useGymCoachHome() {
  const { currentGym } = useGymStore();

  // Reuse the status logic from member home, as it's the same "Is the gym open?" logic
  const status = useGymMemberHome(currentGym?.settings);

  return {
    gym: currentGym,
    isGymLoading: !currentGym, // Simplified: if no gym, we might be loading or just not selected
    status,
    gymId: currentGym?._id,
  };
}
