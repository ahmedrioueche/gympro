import type { CoachClient } from "@ahmedrioueche/gympro-client";
import { useModalStore } from "../../../../../store/modal";
import { useActiveClients } from "../../../../pages/main/coach/clients/hooks/useActiveClients";

export function useClientProfileModal() {
  const { currentModal, clientProfileProps, closeModal, openModal } =
    useModalStore();
  const { clientId } = clientProfileProps || {};

  const isOpen = currentModal === "client_profile";

  // Only fetch when modal is open
  const { data: clients, isLoading } = useActiveClients(isOpen);
  const client = Array.isArray(clients)
    ? clients.find((c: CoachClient) => c.userId === clientId)
    : undefined;

  // Build mock user for template
  const clientData = client
    ? {
        _id: client.userId,
        profile: {
          username: client.username || "",
          fullName: client.fullName,
          email: client.email,
          profileImageUrl: client.profileImageUrl,
          gender: client.gender,
          age: client.age,
          city: client.location?.city,
          state: client.location?.state,
          country: client.location?.country,
        },
        role: "member" as const,
        memberships: [],
        subscriptionHistory: [],
        notifications: [],
      }
    : undefined;

  const handleAssignProgram = () => {
    if (!clientId) return;
    openModal("assign_program", {
      clientId,
      currentProgramId: client?.currentProgram?.programId,
      onSuccess: closeModal,
    });
  };

  const handleClose = () => {
    closeModal();
  };

  return {
    isOpen,
    isLoading,
    client,
    mockUser: clientData,
    handleAssignProgram,
    handleClose,
  };
}
