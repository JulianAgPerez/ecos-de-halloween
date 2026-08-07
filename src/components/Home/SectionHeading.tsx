import { FC, ReactNode } from "react";
import { IconType } from "react-icons";
import Reveal from "./Reveal";

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
  <Reveal className={`mb-6 ${className}`} amount={0.5} y={12}>
    <h3 className={`font-creepster text-center text-amber-400 ${SIZES[size]}`}>
      {Icon && (
        <Icon className="mr-3 inline-block -translate-y-0.5 text-purple-400" />
      )}
      {children}
    </h3>
  </Reveal>
);

export default SectionHeading;