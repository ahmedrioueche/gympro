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

const CancelSubscriptionModal = lazy(
  () =>
    import(
      "./app/pages/main/manager/subscription/components/cancel-subscription-modal/CancelSubscriptionModal"
    )
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
  import(
    "./app/components/modals/create-exercise-modal/CreateExerciseModal"
  ).then((module) => ({
    default: module.CreateExerciseModal,
  }))
);

const CreateSessionModal = lazy(() =>
  import("./app/pages/main/coach/schedule/components/CreateSessionModal").then(
    (module) => ({
      default: module.CreateSessionModal,
    })
  )
);

const SessionDetailsModal = lazy(() =>
  import("./app/pages/main/coach/schedule/components/SessionDetailsModal").then(
    (module) => ({
      default: module.SessionDetailsModal,
    })
  )
);

const InviteCoachModal = lazy(
  () => import("./app/components/modals/InviteCoachModal")
);

const AssignProgramModal = lazy(
  () =>
    import("./app/components/modals/assign-program-modal/AssignProgramModal")
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
      <CancelSubscriptionModal />
      <StaffModal />
      <RequestCoachModal />
      <ProgramDetailsModal />
      <CreateProgramModal />
      <CreateExerciseModal />
      <CreateSessionModal />
      <CreateSessionModal />
      <SessionDetailsModal />
      <InviteCoachModal />
      <AssignProgramModal />
    </Suspense>
  );
}

export default modals;
