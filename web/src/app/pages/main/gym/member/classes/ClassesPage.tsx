import { Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import Loading from "../../../../../../components/ui/Loading";
import NoData from "../../../../../../components/ui/NoData";
import PageHeader from "../../../../../components/PageHeader";
import { MemberClassCard } from "./components/MemberClassCard";
import { useMemberClasses } from "./hooks/useMemberClasses";

export default function ClassesPage() {
  const { t } = useTranslation();
  const {
    classes,
    isLoading,
    isProcessing,
    hasClasses,
    user,
    handleBook,
    handleCancel,
  } = useMemberClasses();

  if (isLoading)
    return (
      <>
        <PageHeader
          title={t("pages.gym.classes")}
          subtitle={t("classes.memberPageDesc")}
          icon={Calendar}
        />
        <Loading />;
      </>
    );

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("pages.gym.classes")}
        subtitle={t("classes.memberPageDesc")}
        icon={Calendar}
      />

      {!hasClasses ? (
        <NoData
          emoji="📅"
          title={t("classes.noClasses")}
          description={t("classes.noClassesDesc")}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((gymClass) => {
            const isBooked = gymClass.bookings.some(
              (b) => b.userId === user?._id,
            );
            const isFull = gymClass.bookings.length >= gymClass.maxCapacity;

            return (
              <MemberClassCard
                key={gymClass._id}
                gymClass={gymClass}
                userId={user?._id}
                isBooked={isBooked}
                isFull={isFull}
                onBook={handleBook}
                onCancel={handleCancel}
                isLoading={isProcessing}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
