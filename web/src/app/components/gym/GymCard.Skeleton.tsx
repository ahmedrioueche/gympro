export default function GymCardSkeleton() {
  return (
    <div className="w-full bg-background border border-border rounded-2xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="relative bg-primary/10 p-6 md:p-8 border-b border-border/50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Icon/Logo + Name */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Logo skeleton */}
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-border animate-pulse"></div>

            <div className="flex-1">
              {/* Name skeleton */}
              <div className="h-8 md:h-10 bg-border rounded-lg w-48 md:w-64 mb-2 animate-pulse"></div>
              {/* Slogan skeleton */}
              <div className="h-4 bg-border rounded w-32 md:w-40 animate-pulse"></div>
            </div>
          </div>

          {/* Status Badge skeleton */}
          <div className="absolute top-4 right-4 md:relative md:top-auto md:right-auto w-20 h-8 md:w-24 md:h-10 bg-border rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 md:p-8 lg:p-10">
        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Location Card */}
          <div className="bg-surface/50 rounded-xl p-5 border border-border/50">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-border rounded animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-border rounded w-16 animate-pulse"></div>
                <div className="h-4 bg-border rounded w-full animate-pulse"></div>
                <div className="h-3 bg-border rounded w-3/4 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Contact Card */}
          <div className="bg-surface/50 rounded-xl p-5 border border-border/50">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-border rounded animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-border rounded w-16 animate-pulse"></div>
                <div className="h-4 bg-border rounded w-32 animate-pulse"></div>
                <div className="h-3 bg-border rounded w-40 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Members Card */}
          <div className="bg-surface/50 rounded-xl p-5 border border-border/50 md:col-span-2 lg:col-span-1">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-border rounded animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-border rounded w-16 animate-pulse"></div>
                <div className="h-8 bg-border rounded w-32 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Website */}
        <div className="mb-8 p-4 bg-primary/5 border border-primary/20 rounded-xl">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-border rounded animate-pulse"></div>
            <div className="h-4 bg-border rounded w-48 animate-pulse"></div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 h-14 bg-primary rounded-xl animate-pulse"></div>
          <div className="flex-1 h-14 bg-surface border-2 border-border rounded-xl animate-pulse"></div>
        </div>
      </div>

      {/* Bottom gradient bar */}
      <div className="h-2 bg-gradient-to-r from-primary via-secondary to-primary opacity-50"></div>
    </div>
  );
}
