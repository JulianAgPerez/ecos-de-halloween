import { FC, ReactNode } from "react";
import { motion } from "framer-motion";
import { IconType } from "react-icons";

const SIZES = {
  sm: "text-2xl md:text-3xl",
  md: "text-3xl md:text-4xl",
  lg: "text-4xl md:text-5xl",
};

interface SectionHeadingProps {
  icon?: IconType;
  children: ReactNode;
  className?: string;
  size?: keyof typeof SIZES;
}

const SectionHeading: FC<SectionHeadingProps> = ({
  icon: Icon,
  children,
  className = "",
  size = "md",
}) => (
  <motion.h3
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.5 }}
    className={`mb-6 font-creepster text-center text-amber-400 ${SIZES[size]} ${className}`}
  >
    {Icon && (
      <Icon className="mr-3 inline-block -translate-y-0.5 text-purple-400" />
    )}
    {children}
  </motion.h3>
);

export default SectionHeading;