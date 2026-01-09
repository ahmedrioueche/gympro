import { lazy, Suspense } from "react";
import { ExerciseDetailModal } from "./app/components/gym/ExerciseDetailModal";

const ConfirmModal = lazy(() => import("./components/ConfirmModal"));
const UpgradePreviewModal = lazy(
  () =>
    import(
      "./app/pages/main/manager/subscription/components/UpgradePreviewModal"
    )
);

const EditUserProfileModal = lazy(
  () => import("./app/components/modals/EditUserProfileModal")
);

const ScanResultModal = lazy(() =>
  import("./app/components/ScanResultModal").then((module) => ({
    default: module.ScanResultModal,
  }))
);

const RenewSubscriptionModal = lazy(
  () =>
    import("./app/components/modals/renew-subscription/RenewSubscriptionModal")
);

function modals() {
  return (
    <Suspense fallback={null}>
      <ConfirmModal />
      <UpgradePreviewModal />
      <EditUserProfileModal />
      <ExerciseDetailModal />
      <ScanResultModal />
      <RenewSubscriptionModal />
    </Suspense>
  );
}

export default modals;
