import { Dumbbell } from "lucide-react";
import { APP_DATA } from "../../../../packages/client/src/constants/app";

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Dumbbell className="w-8 h-8 text-primary" />
      <span className="text-2xl font-bold text-primary">
        {APP_DATA.name}
      </span>
    </div>
  );
}

export default Logo;
