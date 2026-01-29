import { lazy, Suspense } from "react";

const ConfirmModal = lazy(() => import("./components/ConfirmModal"));
const UpgradePreviewModal = lazy(
  () =>
    import("./app/pages/main/manager/subscription/components/UpgradePreviewModal"),
);

const EditUserProfileModal = lazy(
  () => import("./app/components/modals/EditUserProfileModal"),
);

const ScanResultModal = lazy(() =>
  import("./app/components/ScanResultModal").then((module) => ({
    default: module.ScanResultModal,
  })),
);

const RenewSubscriptionModal = lazy(
  () =>
    import("./app/components/modals/renew-subscription-modal/RenewSubscriptionModal"),
);

const CancelSubscriptionModal = lazy(
  () =>
    import("./app/pages/main/manager/subscription/components/cancel-subscription-modal/CancelSubscriptionModal"),
);

const StaffModal = lazy(
  () => import("./app/components/modals/staff-modal/StaffModal"),
);

const ExerciseDetailModal = lazy(() =>
  import("./app/components/gym/ExerciseDetailModal").then((module) => ({
    default: module.ExerciseDetailModal,
  })),
);

const RequestCoachModal = lazy(
  () => import("./app/components/modals/RequestCoachModal"),
);

const CreateProgramModal = lazy(
  () =>
    import("./app/components/modals/create-program-modal/CreateProgramModal"),
);

const ProgramDetailsModal = lazy(
  () =>
    import("./app/components/modals/program-details-modal/ProgramDetailsModal"),
);

const CreateExerciseModal = lazy(() =>
  import("./app/components/modals/create-exercise-modal/CreateExerciseModal").then(
    (module) => ({
      default: module.CreateExerciseModal,
    }),
  ),
);

const CreateSessionModal = lazy(() =>
  import("./app/components/modals/create-session-modal/CreateSessionModal").then(
    (module) => ({
      default: module.CreateSessionModal,
    }),
  ),
);

const SessionDetailsModal = lazy(() =>
  import("./app/components/modals/session-details-modal/SessionDetailsModal").then(
    (module) => ({
      default: module.SessionDetailsModal,
    }),
  ),
);

const InviteCoachModal = lazy(
  () => import("./app/components/modals/InviteCoachModal"),
);

const MemberProfileModal = lazy(
  () =>
    import("./app/components/modals/profile/member-profile-modal/MemberProfileModal"),
);

const ClientProfileModal = lazy(
  () =>
    import("./app/components/modals/profile/client-profile-modal/ClientProfileModal"),
);

const CoachProfileModal = lazy(
  () =>
    import("./app/components/modals/profile/coach-profile-modal/CoachProfileModal"),
);

const AssignProgramModal = lazy(
  () =>
    import("./app/components/modals/assign-program-modal/AssignProgramModal"),
);

const CoachPricingModal = lazy(
  () => import("./app/components/modals/coach-pricing-modal/CoachPricingModal"),
);

const RequestCoachAccessModal = lazy(
  () => import("./app/components/modals/RequestCoachAccessModal"),
);

const GymInvitationModal = lazy(
  () => import("./app/components/modals/GymInvitationModal"),
);

const CreateAnnouncementModal = lazy(
  () =>
    import("./app/pages/main/gym/manager/announcement/components/CreateAnnouncementModal"),
);

const LogSessionModal = lazy(() =>
  import("./app/pages/main/member/training/components/log-session-modal/LogSessionModal").then(
    (module) => ({
      default: module.LogSessionModal, // Exported component is named LogSessionModal, not default
    }),
  ),
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
      <SessionDetailsModal />
      <InviteCoachModal />
      <AssignProgramModal />
      <MemberProfileModal />
      <ClientProfileModal />
      <CoachProfileModal />
      <CoachPricingModal />
      <RequestCoachAccessModal />
      <GymInvitationModal />
      <CreateAnnouncementModal />
      <LogSessionModal />
    </Suspense>
  );
}

export default modals;
