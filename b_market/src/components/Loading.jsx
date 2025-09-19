import React from "react";
import { motion } from "framer-motion";

export default function YellowAnimatedLoader({
  size = 48,
  label = "Loading",
  className = "",
}) {
  const dotSize = Math.max(4, Math.round(size / 6));
  const gap = dotSize; // spacing between dots
  const totalWidth = dotSize * 3 + gap * 2;

  const variants = {
    initial: { y: 0, scale: 1 },
    animate: (i) => ({
      y: [0, -Math.max(6, dotSize / 1.5), 0],
      scale: [1, 1.3, 1],
      transition: {
        duration: 0.9,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop",
        delay: i * 0.12,
      },
    }),
  };

  return (
    <span
      role="status"
      aria-label={label}
      className={`inline-flex items-center justify-center ${className}`}
    >
      <svg
        width={totalWidth}
        height={size}
        viewBox={`0 0 ${totalWidth} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {[0, 1, 2].map((i) => {
          const cx = dotSize / 2 + i * (dotSize + gap);
          return (
            <motion.circle
              key={i}
              cx={cx}
              cy={size / 2}
              r={dotSize / 2}
              fill="currentColor"
              style={{ color: "rgb(250 204 21)" }}
              custom={i}
              variants={variants}
              initial="initial"
              animate="animate"
            />
          );
        })}
      </svg>
      {/* Visually hidden label for screen readers */}
      <span
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          border: 0,
        }}
      >
        {label}
      </span>
    </span>
  );
}

/* Notes
 - No TypeScript types, plain JSX version.
 - Still requires framer-motion.
 - The visually hidden label is now handled with inline styles instead of Tailwind.
*/
