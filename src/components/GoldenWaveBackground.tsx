import React from "react";

export const GoldenWaveBackground: React.FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute top-0 left-0 h-96 w-full bg-gradient-to-b from-yellow-500/50 via-amber-400/30 to-transparent blur-3xl" />

      <div className="absolute top-20 left-[-20%] h-80 w-[140%] bg-gradient-to-r from-yellow-400/40 via-amber-300/50 to-yellow-500/40 blur-3xl rounded-[100%]" />

      <div className="absolute top-40 right-[-10%] h-96 w-[120%] bg-gradient-to-l from-amber-500/30 via-yellow-400/40 to-transparent blur-3xl" />
    </div>
  );
};
