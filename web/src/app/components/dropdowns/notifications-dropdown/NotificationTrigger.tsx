import { Bell } from "lucide-react";

interface NotificationTriggerProps {
  hasUnread: boolean;
}

export function NotificationTrigger({ hasUnread }: NotificationTriggerProps) {
  return (
    <div className="relative p-2 rounded-lg transition-colors hover:bg-border/50 text-text-secondary cursor-pointer">
      <Bell className="w-6 h-6" />
      {hasUnread && (
        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-danger rounded-full border-2 border-surface animate-pulse" />
      )}
    </div>
  );
}
