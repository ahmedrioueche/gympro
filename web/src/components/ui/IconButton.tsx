import React from "react";

interface IconButtonProps {
  onClick: () => void;
  ariaLabel?: string;
  ariaPressed?: boolean;
  icon: React.ElementType;
  disabled?: boolean;
}

const IconButton = ({
  onClick,
  ariaLabel,
  ariaPressed,
  icon: Icon,
  disabled,
}: IconButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-lg transition-colors duration-200
                 ${
                   ariaPressed
                     ? "bg-light-accent dark:bg-dark-accent ring-2 ring-blue-500"
                     : "bg-light-primary dark:bg-dark-primary"
                 }
                 text-light-foreground dark:text-dark-foreground hover:bg-light-primary/80 hover:dark:bg-dark-primary/80 transition duration-300`}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
    >
      <Icon size={20} />
    </button>
  );
};

export default IconButton;
