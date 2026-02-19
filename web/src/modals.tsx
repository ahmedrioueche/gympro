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
  () =>
    import("./app/components/modals/request-coach-access-modal/RequestCoachAccessModal"),
);

const GymInvitationModal = lazy(
  () => import("./app/components/modals/GymInvitationModal"),
);

const CreateAnnouncementModal = lazy(
  () =>
    import("./app/pages/main/gym/manager/announcement/components/CreateAnnouncementModal"),
);

const ReviewCoachRequestModal = lazy(
  () => import("./app/pages/admin/coaching/components/ReviewCoachRequestModal"),
);

const EditPlanModal = lazy(
  () =>
    import("./app/pages/admin/pricing/components/edit-plan-modal/EditPlanModal"),
);

const FeaturePackageModal = lazy(
  () =>
    import("./app/pages/admin/pricing/components/feature-packages-modal/FeaturePackageModal"),
);

const AdminCreateEditorModal = lazy(() =>
  import("./app/pages/admin/staff/components/AdminCreateEditorModal").then(
    (module) => ({ default: module.AdminCreateEditorModal }),
  ),
);

const AdminManagePermissionsModal = lazy(() =>
  import("./app/pages/admin/staff/components/AdminManagePermissionsModal").then(
    (module) => ({ default: module.AdminManagePermissionsModal }),
  ),
);

const AlertDetailsModal = lazy(
  () => import("./app/pages/admin/alerts/components/AlertDetailsModal"),
);

const ReportDetailsModal = lazy(
  () =>
    import("./app/components/modals/report-detail-modal/ReportDetailsModal"),
);

const InventoryItemModal = lazy(
  () =>
    import("./app/pages/main/gym/manager/inventory/components/InventoryItemModal"),
);

const CompetitionModal = lazy(
  () =>
    import("./app/pages/main/gym/manager/competitions/components/CompetitionModal"),
);

const ProductModal = lazy(
  () => import("./app/pages/main/gym/manager/store/components/ProductModal"),
);

const AddMediaModal = lazy(
  () =>
    import("./app/pages/main/gym/manager/marketing/components/AddMediaModal"),
);

const CreateReportModal = lazy(
  () => import("./app/components/modals/create-report-modal/CreateReportModal"),
);

const LogSessionModal = lazy(() =>
  import("./app/pages/main/member/training/components/log-session-modal/LogSessionModal").then(
    (module) => ({
      default: module.LogSessionModal,
    }),
  ),
);

const UserProfileModal = lazy(
  () =>
    import("./app/components/modals/profile/user-profile-modal/UserProfileModal"),
);

const ProductDetailsModal = lazy(
  () =>
    import("./app/pages/main/gym/member/store/components/ProductDetailsModal"),
);

const CompetitionDetailsModal = lazy(
  () =>
    import("./app/components/modals/competition-details-modal/CompetitionDetailsModal"),
);

const SetWinnersModal = lazy(
  () =>
    import("./app/pages/main/gym/manager/competitions/components/SetWinnersModal"),
);

const GymClassModal = lazy(
  () => import("./app/pages/main/gym/manager/classes/components/GymClassModal"),
);

const ServiceModal = lazy(() => import("./app/components/modals/ServiceModal"));
const PricingModal = lazy(
  () => import("./app/pages/main/gym/manager/pricing/components/PricingModal"),
);
const CreateMemberModal = lazy(
  () => import("./app/components/modals/create-member-modal/CreateMemberModal"),
);
const ClassDetailsModal = lazy(
  () => import("./app/components/modals/ClassDetailsModal"),
);

const CoachingOfferModal = lazy(
  () => import("./app/components/modals/CoachingOfferModal"),
);

const CreateGymModal = lazy(
  () => import("./app/components/modals/create-gym-modal/CreateGymModal"),
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
      <CoachingOfferModal />
      <CreateAnnouncementModal />
      <LogSessionModal />
      <ReviewCoachRequestModal />
      <EditPlanModal />
      <FeaturePackageModal />
      <AdminCreateEditorModal />
      <AdminManagePermissionsModal />
      <AlertDetailsModal />
      <ReportDetailsModal />
      <InventoryItemModal />
      <CompetitionModal />
      <ProductModal />
      <AddMediaModal />
      <CreateReportModal />
      <UserProfileModal />
      <ProductDetailsModal />
      <CompetitionDetailsModal />
      <SetWinnersModal />
      <GymClassModal />
      <ServiceModal />
      <PricingModal />
      <CreateMemberModal />
      <CreateMemberModal />
      <ClassDetailsModal />
      <CreateGymModal />
    </Suspense>
  );
}

export default modals;
