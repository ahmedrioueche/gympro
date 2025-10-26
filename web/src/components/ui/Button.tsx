import { Loader } from "lucide-react";
import React from "react";

type ButtonProps = {
  className?: string;
  variant?: "filled" | "outline" | "ghost";
  color?: "primary" | "secondary" | "accent" | "success" | "warning" | "danger";
  size?: "default" | "sm" | "lg";
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "filled",
      color = "primary",
      size = "default",
      fullWidth = false,
      icon,
      iconPosition = "left",
      loading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "cursor-pointer inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform active:scale-95";

    const variants = {
      filled: {
        primary:
          "bg-gradient-to-r from-primary to-secondary text-white hover:from-secondary hover:to-primary hover:shadow-lg hover:shadow-primary/25 focus:ring-primary",
        secondary:
          "bg-secondary text-white hover:bg-secondary/90 hover:shadow-lg hover:shadow-secondary/25 focus:ring-secondary",
        accent:
          "bg-accent text-white hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/25 focus:ring-accent",
        success:
          "bg-success text-white hover:bg-success/90 hover:shadow-lg hover:shadow-success/25 focus:ring-success",
        warning:
          "bg-warning text-white hover:bg-warning/90 hover:shadow-lg hover:shadow-warning/25 focus:ring-warning",
        danger:
          "bg-danger text-white hover:bg-danger/90 hover:shadow-lg hover:shadow-danger/25 focus:ring-danger",
      },
      outline: {
        primary:
          "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/15 focus:ring-primary",
        secondary:
          "border-2 border-secondary text-secondary bg-transparent hover:bg-secondary hover:text-white hover:shadow-lg hover:shadow-secondary/15 focus:ring-secondary",
        accent:
          "border-2 border-accent text-accent bg-transparent hover:bg-accent hover:text-white hover:shadow-lg hover:shadow-accent/15 focus:ring-accent",
        success:
          "border-2 border-success text-success bg-transparent hover:bg-success hover:text-white hover:shadow-lg hover:shadow-success/15 focus:ring-success",
        warning:
          "border-2 border-warning text-warning bg-transparent hover:bg-warning hover:text-white hover:shadow-lg hover:shadow-warning/15 focus:ring-warning",
        danger:
          "border-2 border-danger text-danger bg-transparent hover:bg-danger hover:text-white hover:shadow-lg hover:shadow-danger/15 focus:ring-danger",
      },
      ghost: {
        primary:
          "text-primary bg-transparent hover:bg-primary/10 focus:ring-primary",
        secondary:
          "text-secondary bg-transparent hover:bg-secondary/10 focus:ring-secondary",
        accent:
          "text-accent bg-transparent hover:bg-accent/10 focus:ring-accent",
        success:
          "text-success bg-transparent hover:bg-success/10 focus:ring-success",
        warning:
          "text-warning bg-transparent hover:bg-warning/10 focus:ring-warning",
        danger:
          "text-danger bg-transparent hover:bg-danger/10 focus:ring-danger",
      },
    };

    const sizes = {
      sm: "h-8 px-3 text-sm",
      default: "h-10 px-4 py-2",
      lg: "h-12 px-6 py-3 text-lg",
    };

    const widthClass = fullWidth ? "w-full" : "";

    const iconElement = loading ? <Loader className="animate-spin" /> : icon;

    return (
      <button
        className={`${baseStyles} ${variants[variant][color]} ${sizes[size]} ${widthClass} ${className}`}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {iconElement && iconPosition === "left" && (
          <span className={children ? "mr-2" : ""}>{iconElement}</span>
        )}
        {loading ? "Loading..." : children}
        {iconElement && iconPosition === "right" && !loading && (
          <span className={children ? "ml-2" : ""}>{iconElement}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
