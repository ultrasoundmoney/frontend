import type { ReactNode } from "react";

type CardProps = {
  name: string;
  children: ReactNode;
};

const Card: React.FC<CardProps> = ({ name, children }) => {
  return (
    <>
      <div className="card w-full rounded-lg bg-slateus-700 py-2 px-4 sm:py-3 sm:px-6 lg:w-3/12">
        <div className="mb-1 text-left font-roboto text-2xs font-light text-slateus-400 sm:text-sm md:text-base lg:text-sm xl:mb-0 xl:leading-card">
          {name}
        </div>
        {children}
      </div>
    </>
  );
};

export default Card;
