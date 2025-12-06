export default function Loading({
  className = "items-center",
  size = "h-16 w-16",
}: {
  className?: string;
  size?: string;
}) {
  return (
    <div className={`min-h-screen flex justify-center   ${className} `}>
      <div
        className={`animate-spin rounded-full ${size} border-b-2 border-blue-500`}
      ></div>
    </div>
  );
}
