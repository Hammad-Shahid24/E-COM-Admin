import { FC, ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const slideUpVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

interface AnimatedSectionProps {
  children: ReactNode;
  delay: number;
}

const AnimatedSection: FC<AnimatedSectionProps> = ({ children, delay }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={slideUpVariants}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
