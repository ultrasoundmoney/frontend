import type { ReactNode } from "react";

type CardProps = {
  name: string;
  children: ReactNode;
};

const Card: React.FC<CardProps> = ({ name, children }) => {
  return (
    <>
      <div className="w-full lg:w-3/12 card bg-blue-tangaroa rounded-lg py-2 px-4 sm:py-3 sm:px-6">
        <div className="text-2xs sm:text-sm md:text-base lg:text-sm font-light mb-1 xl:mb-0 text-blue-shipcove text-left xl:leading-card font-roboto">
          {name}
        </div>
        {children}
      </div>
    </>
  );
};

export default Card;
