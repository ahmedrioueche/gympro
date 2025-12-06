function StepsNav({ steps, step }: { steps: any; step: number }) {
  return (
    <div className="flex flex-col gap-4">
      {steps.map((stepItem) => (
        <div
          key={stepItem.number}
          className={`bg-surface backdrop-blur-xl border rounded-xl p-4 transition-all ${
            step === stepItem.number
              ? "border-blue-500/50 shadow-lg shadow-blue-500/20"
              : "border-gray-700/40"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold ${
                step === stepItem.number
                  ? "bg-blue-500 text-white"
                  : step > stepItem.number
                  ? "bg-green-500 text-white"
                  : "bg-background text-text-primary"
              }`}
            >
              {step > stepItem.number ? "✓" : stepItem.number}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{stepItem.icon}</span>
                <h3 className="text-sm font-semibold text-text-primary truncate">
                  {stepItem.title}
                </h3>
              </div>
              <p className="text-xs text-text-secondary line-clamp-2">
                {stepItem.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StepsNav;
