import type { FC, ReactNode } from "react";

const Modal: FC<{
  children: ReactNode;
  onClickBackground: () => void;
  show: boolean;
}> = ({ children, onClickBackground, show }) => (
  <div
    className={`
      fixed top-0 left-0 bottom-0 right-0
      flex justify-center items-center
      z-20
      bg-blue-highlightbg/60
      ${show ? "" : "hidden"}`}
    onClick={onClickBackground}
  >
    {children}
  </div>
);

export default Modal;
