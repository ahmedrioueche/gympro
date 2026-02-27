import type { ReactNode } from "react";

interface BaseViewProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

export const BaseView = ({
  children,
  title,
  subtitle,
  className = "max-w-md",
}: BaseViewProps) => (
  <div
    className={`flex flex-col items-center justify-center w-full mx-auto p-8 text-center space-y-10 animate-fade-in-up bg-surface/40 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-primary/5 ring-1 ring-white/10 dark:ring-white/5 transition-all duration-500 ease-out hover:shadow-primary/10 ${className}`}
  >
    {(title || subtitle) && (
      <div className="space-y-3">
        {title && (
          <h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-br from-text-primary to-text-secondary bg-clip-text text-transparent transform transition-all duration-500">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="text-text-secondary text-lg font-medium">{subtitle}</p>
        )}
      </div>
    )}
    <div className="w-full space-y-6">{children}</div>
  </div>
);
