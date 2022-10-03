import type { FC, ReactNode } from "react";
import styles from "./index.module.scss";

const MainTitle: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div
    className={`
      mx-auto
      mt-16
      bg-transparent
      px-4 text-center
      text-[4.6rem] font-extralight leading-[5.4rem]
      text-white
      md:px-16
      md:text-[4.0rem]
      md:leading-[5.4rem]
      lg:text-[4.8rem]
      ${styles.gradientText}
      ${className}
    `}
  >
    {children}
  </div>
);

export default MainTitle;
