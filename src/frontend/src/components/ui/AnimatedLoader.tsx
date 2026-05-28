interface AnimatedLoaderProps {
  text?: string;
  size?: "sm" | "md" | "lg";
}

export default function AnimatedLoader({
  text = "Analyzing...",
  size = "md",
}: AnimatedLoaderProps) {
  const sizes = { sm: "w-6 h-6", md: "w-10 h-10", lg: "w-16 h-16" };
  const textSizes = { sm: "text-xs", md: "text-sm", lg: "text-base" };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div
          className={`${sizes[size]} rounded-full border-2 border-transparent border-t-[#38E6D0] border-r-[#43E7A2] animate-spin-slow`}
        />
        <div
          className="absolute inset-1 rounded-full border-2 border-transparent border-b-[#00BFFF] animate-spin-slow"
          style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-[#38E6D0] animate-pulse" />
        </div>
      </div>
      {text && (
        <p
          className={`${textSizes[size]} text-[#38E6D0] animate-pulse font-medium tracking-wider`}
        >
          {text}
        </p>
      )}
    </div>
  );
}
