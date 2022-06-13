import { FC, HTMLAttributes } from "react";

type Props = {
  className?: HTMLAttributes<HTMLDivElement>["className"];
};

const Background: FC<Props> = ({ className, children }) => (
  <div className={`bg-blue-tangaroa w-full rounded-lg p-8 ${className ?? ""}`}>
    {children}
  </div>
);

export default Background;
