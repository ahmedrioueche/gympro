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
        className={`flex items-center justify-center gap-1.5 md:gap-2 rounded-xl md:rounded-2xl transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none group
          ${
            hasLabel
              ? "px-3 md:px-5 h-9 md:h-[46px] bg-primary text-white text-xs md:text-sm font-bold md:font-black uppercase tracking-wider hover:bg-primary-hover shadow-lg shadow-primary/20"
              : "w-9 h-9 md:w-[46px] md:h-[46px] bg-surface-secondary text-text-secondary border border-border hover:bg-primary hover:text-white hover:border-primary shadow-sm"
          }`}
      >
        {hasLabel && <span>{action.label}</span>}
        {ActionIcon && (
          <ActionIcon
            className={`w-4 h-4 md:w-5 md:h-5 transition-transform ${hasLabel ? "group-hover:translate-x-0.5" : "group-hover:scale-110"}`}
          />
        )}
      </button>
    );
  };

  const renderMultiActionTrigger = () => {
    return (
      <button className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 h-9 md:h-[46px] rounded-xl md:rounded-2xl bg-primary text-white text-xs md:text-sm font-bold uppercase tracking-wider hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all group active:scale-95">
        <span>{t("common.actions", "Actions")}</span>
        <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-y-0.5 transition-transform" />
      </button>
    );
  };

  return (
    <div className="flex flex-col items-center text-center md:flex-row md:items-center md:text-left justify-between gap-4 md:gap-6 mb-6 md:mb-10 animate-in fade-in slide-in-from-top-4 duration-500 min-w-0 overflow-hidden">
      <div className="flex flex-col items-center md:flex-row md:items-start gap-3 md:gap-5 min-w-0">
        {Icon && (
          <div className="hidden sm:flex p-4 rounded-3xl bg-primary/5 text-primary border border-primary/10 shadow-sm flex-shrink-0">
            <Icon size={32} strokeWidth={2.5} />
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-2xl md:text-4xl font-black text-text-primary tracking-tight break-words">
            {title}
          </h1>
          <p className="text-text-secondary font-medium mt-1 max-w-2xl text-sm md:text-base">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center md:justify-end gap-2 md:gap-3 w-full md:w-auto flex-shrink-0">
        {extra}
        {visibleActions.length > 0 && (
          <div className="flex items-center gap-2">
            {visibleActions.length === 1 ? (
              renderAction(visibleActions[0])
            ) : (
              <Dropdown trigger={renderMultiActionTrigger()} align="right">
                {(closeDropdown) =>
                  visibleActions.map((action, idx) => {
                    const ActionIcon = action.icon;
                    return (
                      <DropdownItem
                        key={idx}
                        label={action.label}
                        icon={
                          ActionIcon && (
                            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                              <ActionIcon className="w-3.5 h-3.5 text-primary" />
                            </div>
                          )
                        }
                        onClick={() => {
                          action.onClick();
                          closeDropdown();
                        }}
                      />
                    );
                  })
                }
              </Dropdown>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PageHeader;
