import type { FC, ReactNode } from "react";
import styles from "./index.module.scss";

const MainTitle: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div
    className={`
      mt-16
      bg-transparent
      font-extralight
      text-white text-center
      mx-auto px-4 md:px-16
      text-[4.6rem]
      md:text-[4.0rem]
      lg:text-[4.8rem]
      leading-[5.4rem]
      md:leading-[5.4rem]
      ${styles.gradientText}
      ${className}
    `}
  >
    {children}
  </div>
);

export default MainTitle;
