import { Calendar, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import ErrorComponent from "../../../../../../components/ui/Error";
import Loading from "../../../../../../components/ui/Loading";
import NoData from "../../../../../../components/ui/NoData";
import PageHeader from "../../../../../components/PageHeader";
import ClassCard from "./components/ClassCard";
import { useManagerClasses } from "./hooks/useManagerClasses";

export default function ClassesPage() {
  const { t } = useTranslation();
  const { classes, isLoading, error, handleCreate, handleEdit, handleDelete } =
    useManagerClasses();

  if (isLoading)
    return (
      <>
        <PageHeader
          title={t("pages.gym.classes", "Gym Classes")}
          subtitle={t(
            "classes.pageDesc",
            "Manage your group workouts and schedules",
          )}
          actionButton={{
            label: t("classes.createBtn", "Create Class"),
            icon: Plus,
            onClick: handleCreate,
          }}
        />
        <Loading />
      </>
    );
  if (error) return <ErrorComponent />;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("pages.gym.classes", "Gym Classes")}
        subtitle={t(
          "classes.pageDesc",
          "Manage your group workouts and schedules",
        )}
        icon={Calendar}
        actionButton={{
          label: t("classes.createBtn", "Create Class"),
          icon: Plus,
          onClick: handleCreate,
        }}
      />

      {classes.length === 0 ? (
        <NoData
          title={t("classes.noClasses", "No classes scheduled")}
          description={t(
            "classes.noClassesDesc",
            "Start by creating your first group workout session.",
          )}
          icon={Calendar}
          actionButton={{
            label: t("classes.createBtn", "Create Class"),
            onClick: handleCreate,
            icon: Plus,
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((gymClass) => (
            <ClassCard
              key={gymClass._id}
              gymClass={gymClass}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
