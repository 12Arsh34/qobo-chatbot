import React from 'react';
import { motion } from 'framer-motion';

const TypingIndicator = () => {
  const containerVariants = {
    start: {
      transition: {
        staggerChildren: 0.2,
      },
    },
    end: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const dotVariants = {
    start: {
      y: "0%",
    },
    end: {
      y: "100%",
    },
  };

  const dotTransition = {
    duration: 0.5,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut",
  };

  return (
    <div className="flex w-full justify-start mb-6">
      <div className="flex max-w-[90%] items-center gap-3 sm:max-w-[75%]">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white shadow-qobo ring-1 ring-gray-100">
          <span className="font-logo text-lg font-extrabold">
            <span className="text-primary">q</span>
            <span className="text-secondary">o</span>
          </span>
        </div>

        <div className="flex items-center gap-3 rounded-[1.4rem] rounded-tl-md border border-gray-100 bg-white px-5 py-4 shadow-qobo">
          <span className="text-sm font-bold text-gray-600">Qobo AI is thinking</span>
          <motion.div
            className="flex items-center gap-1.5"
            variants={containerVariants}
            initial="start"
            animate="end"
          >
            <motion.span
              className="block h-2 w-2 rounded-full bg-primary"
              variants={dotVariants}
              transition={dotTransition}
            />
            <motion.span
              className="block h-2 w-2 rounded-full bg-secondary"
              variants={dotVariants}
              transition={dotTransition}
            />
            <motion.span
              className="block h-2 w-2 rounded-full bg-primary"
              variants={dotVariants}
              transition={dotTransition}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
