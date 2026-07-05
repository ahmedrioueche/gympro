import { useModalLayer } from "../../../../hooks/useModalLayer";
import { CompactRestTimer } from "../../../pages/main/member/training/components/log-session-modal/CompactRestTimer";

export const RestTimer = () => {
  const { isOpen: isLogSessionOpen } = useModalLayer("log_session");

  if (isLogSessionOpen) return null;

  return <CompactRestTimer variant="floating" />;
};
