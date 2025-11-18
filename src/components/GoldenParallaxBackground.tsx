import React from "react";
import { motion, useScroll, useTransform } from "motion/react";

export const GoldenParallaxBackground: React.FC = () => {
  const { scrollY } = useScroll();

  const layer1Y = useTransform(scrollY, [0, 800], [0, 40]);
  const layer2Y = useTransform(scrollY, [0, 800], [0, 80]);
  const layer3Y = useTransform(scrollY, [0, 800], [0, 120]);

  const waveShape =
    "polygon(0% 70%, 20% 40%, 40% 60%, 60% 35%, 80% 55%, 100% 30%, 100% 100%, 0% 100%)";

  return (
    <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
      {/* Wave layer 1 */}
      <motion.div
        style={{ y: layer1Y }}
        className="absolute -top-40 left-0 h-64 w-full opacity-40"
      >
        <div
          className="h-full w-[130%] -translate-x-[15%] bg-gradient-to-r from-yellow-500 via-amber-300 to-yellow-500 blur-3xl"
          style={{ clipPath: waveShape }}
        />
      </motion.div>

      {/* Wave layer 2 */}
      <motion.div
        style={{ y: layer2Y }}
        className="absolute top-40 left-0 h-72 w-full opacity-35"
      >
        <div
          className="h-full w-[140%] -translate-x-[20%] bg-gradient-to-r from-yellow-500 via-yellow-300 to-amber-400 blur-3xl"
          style={{ clipPath: waveShape }}
        />
      </motion.div>

      {/* Wave layer 3 */}
      <motion.div
        style={{ y: layer3Y }}
        className="absolute bottom-[-40px] left-0 h-64 w-full opacity-30"
      >
        <div
          className="h-full w-[130%] -translate-x-[10%] bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 blur-3xl"
          style={{ clipPath: waveShape }}
        />
      </motion.div>
    </div>
  );
};
