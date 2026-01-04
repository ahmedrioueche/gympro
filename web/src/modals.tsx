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

function modals() {
  return (
    <Suspense fallback={null}>
      <ConfirmModal />
      <UpgradePreviewModal />
      <EditUserProfileModal />
      <ExerciseDetailModal />
    </Suspense>
  );
}

export default modals;
