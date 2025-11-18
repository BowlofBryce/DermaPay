import React from "react";
import { motion, useScroll, useTransform } from "motion/react";

export const GoldenWaveBackground: React.FC = () => {
  const { scrollY } = useScroll();

  const layer1Y = useTransform(scrollY, [0, 600], [0, 20]);
  const layer2Y = useTransform(scrollY, [0, 600], [0, 40]);
  const layer3Y = useTransform(scrollY, [0, 600], [0, 60]);

  const waveShape =
    "polygon(0% 70%, 15% 45%, 35% 60%, 55% 35%, 75% 55%, 100% 30%, 100% 100%, 0% 100%)";

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        style={{ y: layer1Y }}
        className="absolute -top-28 left-[-10%] h-64 w-[130%] opacity-60"
      >
        <div
          className="h-full w-full bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 blur-3xl"
          style={{ clipPath: waveShape }}
        />
      </motion.div>

      <motion.div
        style={{ y: layer2Y }}
        className="absolute top-16 left-[-15%] h-72 w-[140%] opacity-45"
      >
        <div
          className="h-full w-full bg-gradient-to-r from-yellow-500 via-yellow-300 to-amber-400 blur-3xl"
          style={{ clipPath: waveShape }}
        />
      </motion.div>

      <motion.div
        style={{ y: layer3Y }}
        className="absolute bottom-[-40px] left-[-10%] h-64 w-[130%] opacity-35"
      >
        <div
          className="h-full w-full bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 blur-3xl"
          style={{ clipPath: waveShape }}
        />
      </motion.div>
    </div>
  );
};
