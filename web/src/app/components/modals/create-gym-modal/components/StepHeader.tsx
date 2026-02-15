function StepHeader({ icon, title, desc }) {
  return (
    <div className="text-center mb-6">
      <span className="text-4xl mb-2 block">{icon}</span>
      <h2 className="text-xl font-bold text-text-primary mb-1">{title}</h2>
      <p className="text-sm text-text-secondary">{desc}</p>
    </div>
  );
}

export default StepHeader;
