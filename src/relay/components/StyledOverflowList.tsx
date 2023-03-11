import type { FC, ReactNode } from "react";
import scrollbarStyles from "../../styles/Scrollbar.module.scss";

type Props = {
  children: ReactNode;
  height: string;
};

const StyledOverflowList: FC<Props> = ({ children, height }) => (
  <ul
    className={`
      -mr-3 flex
      flex-col gap-y-4
      overflow-y-auto pr-2
      ${height}
      ${scrollbarStyles["styled-scrollbar-vertical"]}
      ${scrollbarStyles["styled-scrollbar-horizontal"]}
      ${scrollbarStyles["styled-scrollbar"]}
    `}
  >
    {children}
  </ul>
);

export default StyledOverflowList;
