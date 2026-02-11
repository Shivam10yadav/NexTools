import { motion } from "framer-motion";

const pageVariants = {
  initial: {
    opacity: 0,
    y: 40,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -40,
  },
};

const pageTransition = {
  duration: 0.4,
  ease: "easeInOut",
};

export default function PageTransition({ children }) {
  return (
<motion.div
  className="min-h-screen bg-black"
  variants={pageVariants}
  initial="initial"
  animate="animate"
  exit="exit"
  transition={pageTransition}
>

      {children}
    </motion.div>
  );
}
