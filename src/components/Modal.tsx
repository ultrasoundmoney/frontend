import { FC } from "react";

export const Modal: FC<{
  onClickBackground: () => void;
  show: boolean;
}> = ({ children, onClickBackground, show }) => (
  <div
    className={`
      fixed top-0 bottom-0 left-0 w-full
      flex justify-center items-center
      z-10
      ${show ? "block" : "hidden"}`}
    style={{
      backgroundColor: "rgba(49, 58, 85, 0.6)",
    }}
    onClick={onClickBackground}
  >
    {children}
  </div>
);
