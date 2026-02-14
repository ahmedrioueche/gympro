import { ChevronDown, type LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import Dropdown, { DropdownItem } from "../../components/ui/Dropdown";

interface Action {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  show?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

interface PageHeaderProps {
  icon?: LucideIcon;
  title: string;
  subtitle: string;
  actionButton?: Action;
  actions?: Action[];
  extra?: React.ReactNode;
  gradientFrom?: string;
  gradientTo?: string;
}

function PageHeader({
  icon: Icon,
  title,
  subtitle,
  actionButton = null,
  actions = [],
  extra,
}: PageHeaderProps) {
  const { t } = useTranslation();
  const allActions = actionButton ? [actionButton, ...actions] : actions;
  const visibleActions = allActions.filter((a) => a.show !== false);

  const renderAction = (action: Action) => {
    const ActionIcon = action.icon;
    const hasLabel = !!action.label;

    return (
      <button
        onClick={action.onClick}
        disabled={action.disabled || action.loading}
        title={action.label}
        className={`flex items-center justify-center gap-2 rounded-2xl transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none group h-[46px] 
          ${
            hasLabel
              ? "px-5 bg-primary text-white text-sm font-black uppercase tracking-wider hover:bg-primary-hover shadow-lg shadow-primary/20"
              : "w-[46px] bg-surface-secondary text-text-secondary border border-border hover:bg-primary hover:text-white hover:border-primary shadow-sm"
          }`}
      >
        {hasLabel && <span>{action.label}</span>}
        {ActionIcon && (
          <ActionIcon
            className={`w-5 h-5 transition-transform ${hasLabel ? "group-hover:translate-x-0.5" : "group-hover:scale-110"}`}
          />
        )}
      </button>
    );
  };

  return (
    <div className="flex flex-col items-center text-center md:flex-row md:items-center md:text-left justify-between gap-6 mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex flex-col items-center md:flex-row md:items-start gap-5">
        {Icon && (
          <div className="hidden sm:flex p-4 rounded-3xl bg-primary/5 text-primary border border-primary/10 shadow-sm flex-shrink-0">
            <Icon size={32} strokeWidth={2.5} />
          </div>
        )}
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-text-primary tracking-tight">
            {title}
          </h1>
          <p className="text-text-secondary font-medium mt-1 max-w-2xl text-sm md:text-base">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center md:justify-end gap-3 w-full md:w-auto">
        {extra}
        {visibleActions.length > 0 && (
          <div className="flex items-center gap-2">
            {visibleActions.length === 1 ? (
              renderAction(visibleActions[0])
            ) : (
              <Dropdown
                trigger={
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-surface-secondary text-text-secondary border border-border text-sm font-black uppercase tracking-wider hover:bg-surface-hover transition-all group h-[46px]">
                    <span>{t("common.actions", "Actions")}</span>
                    <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                  </button>
                }
              >
                {(closeDropdown) => (
                  <div className="p-1.5 w-48 bg-surface border border-border rounded-2xl shadow-xl">
                    {visibleActions.map((action, idx) => (
                      <DropdownItem
                        key={idx}
                        label={action.label}
                        icon={
                          action.icon && <action.icon className="w-4 h-4" />
                        }
                        onClick={() => {
                          action.onClick();
                          closeDropdown();
                        }}
                      />
                    ))}
                  </div>
                )}
              </Dropdown>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PageHeader;
