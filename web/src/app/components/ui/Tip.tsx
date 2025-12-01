function Tip({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mt-4 p-4 bg-blue-500/10 backdrop-blur-lg border border-blue-500/30 rounded-lg">
      <div className="flex items-start gap-2">
        <span className="text-lg">💡</span>
        <div>
          <h3 className="font-semibold text-text-primary text-sm mb-0.5">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-text-secondary">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Tip;
