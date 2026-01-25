import type { User } from "@ahmedrioueche/gympro-client";

interface ProfileAvatarProps {
  user: User;
}

function ProfileAvatar({ user }: ProfileAvatarProps) {
  if (user.profile.profileImageUrl) {
    return (
      <img
        src={user.profile.profileImageUrl}
        alt=""
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        className="w-20 h-20 rounded-2xl object-cover ring-2 ring-border shadow-md"
      />
    );
  }

  return (
    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold shadow-md">
      {(user.profile.fullName || user.profile.username).charAt(0).toUpperCase()}
    </div>
  );
}

export default ProfileAvatar;
