import { Dumbbell } from "lucide-react";
import { APP_DATA } from "../../../../packages/client/src/constants/app";

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Dumbbell className="w-8 h-8 text-primary" />
      <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        {APP_DATA.name}
      </span>
    </div>
  );
}

export default Logo;
