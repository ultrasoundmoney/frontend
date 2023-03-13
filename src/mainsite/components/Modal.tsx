import type { FC, ReactNode } from "react";

const Modal: FC<{
  children: ReactNode;
  onClickBackground: () => void;
  show: boolean;
}> = ({ children, onClickBackground, show }) => (
  <div
    className={`
      fixed top-0 left-0 bottom-0 right-0
      z-20 flex items-center
      justify-center
      bg-slateus-600/60
      ${show ? "" : "hidden"}`}
    onClick={onClickBackground}
  >
    {children}
  </div>
);

export default Modal;
