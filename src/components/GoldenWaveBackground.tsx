import React from "react";
import { motion, useScroll, useTransform } from "motion/react";

export const GoldenWaveBackground: React.FC = () => {
  const { scrollY } = useScroll();

  const layer1Y = useTransform(scrollY, [0, 1000], [0, 150]);
  const layer2Y = useTransform(scrollY, [0, 1000], [0, 250]);
  const layer3Y = useTransform(scrollY, [0, 1000], [0, 350]);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <motion.div
        style={{ y: layer1Y }}
        className="absolute top-0 left-[-10%] h-[600px] w-[120%] opacity-40"
      >
        <div className="h-full w-full bg-gradient-to-br from-yellow-400 via-amber-300 to-yellow-500 blur-3xl" />
      </motion.div>

      <motion.div
        style={{ y: layer2Y }}
        className="absolute top-40 right-[-15%] h-[700px] w-[130%] opacity-30"
      >
        <div className="h-full w-full bg-gradient-to-bl from-amber-500 via-yellow-400 to-amber-300 blur-3xl" />
      </motion.div>

      <motion.div
        style={{ y: layer3Y }}
        className="absolute top-80 left-[-20%] h-[800px] w-[140%] opacity-25"
      >
        <div className="h-full w-full bg-gradient-to-tr from-yellow-300 via-amber-400 to-yellow-500 blur-3xl" />
      </motion.div>
    </div>
  );
};
