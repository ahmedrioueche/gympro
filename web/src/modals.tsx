import { lazy, Suspense } from "react";

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

const StaffModal = lazy(
  () => import("./app/components/modals/staff-modal/StaffModal")
);

const ExerciseDetailModal = lazy(() =>
  import("./app/components/gym/ExerciseDetailModal").then((module) => ({
    default: module.ExerciseDetailModal,
  }))
);

const RequestCoachModal = lazy(
  () => import("./app/components/modals/RequestCoachModal")
);

const CreateProgramModal = lazy(
  () =>
    import("./app/components/modals/create-program-modal/CreateProgramModal")
);

const ProgramDetailsModal = lazy(
  () =>
    import("./app/components/modals/program-details-modal/ProgramDetailsModal")
);

const CreateExerciseModal = lazy(() =>
  import("./app/components/modals/CreateExerciseModal").then((module) => ({
    default: module.CreateExerciseModal,
  }))
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
      <StaffModal />
      <RequestCoachModal />
      <ProgramDetailsModal />
      <CreateProgramModal />
      <CreateExerciseModal />
    </Suspense>
  );
}

export default modals;
