import type { User } from "@ahmedrioueche/gympro-client";

interface ProfileAvatarProps {
  user: User | null;
  initials?: string;
  size?: "sm" | "md";
}

export function ProfileAvatar({
  user,
  initials,
  size = "md",
}: ProfileAvatarProps) {
  const sizeClasses = size === "sm" ? "w-8 h-8" : "w-10 h-10";

  if (user?.profile?.profileImageUrl) {
    return (
      <img
        src={user.profile.profileImageUrl}
        alt={user?.profile?.fullName || "User"}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        className={`${sizeClasses} rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white`}
    >
      {initials}
    </div>
  );
}
