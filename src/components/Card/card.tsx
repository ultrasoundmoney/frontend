import { boolean } from "fp-ts";
import * as React from "react";

type CardProps = {
  type: number;
  className?: string;
  name: string;
  title: string;
  number?: string;
  id?: string;
  eth?: boolean;
};

const Card: React.FC<CardProps> = ({
  type,
  name,
  title,
  number,
  className,
  id,
  eth,
}) => {
  const renderType = () => {
    if (type === 1) {
      return (
        <div className="eth-status text-xs sm:text-base md:text-lg lg:text-base xl:text-lg font-light text-white text-left xl:leading-10 font-roboto">
          {title}
        </div>
      );
    } else if (type === 2) {
      return (
        <div className="flex flex-wrap justify-between items-center">
          <div className="eth-supply text-sm sm:text-base md:text-lg lg:text-base xl:text-41xl font-light text-white text-left xl:leading-18 font-roboto">
            {title}
          </div>
          <div className="eth-supply-incr md:pl-8 text-sm sm:text-base font-light text-green-mediumspring text-left font-roboto">
            {number}
          </div>
        </div>
      );
    } else if (type === 3) {
      return (
        <div
          className={`eth-burn-fee card-text text-sm sm:text-base md:text-lg lg:text-base ${
            eth ? "xl:text-21xl" : "xl:text-41xl"
          } xl:leading-18 font-light text-white text-left font-roboto`}
          dangerouslySetInnerHTML={{
            __html: title,
          }}
        />
      );
    } else {
      return (
        <div className="text-base xl:text-lg font-light text-white text-left leading-10 font-roboto">
          {title}
        </div>
      );
    }
  };
  const getClass =
    className != undefined || className != null
      ? `card bg-blue-tangaroa rounded-lg py-2 px-4 sm:py-3 sm:px-6 ${className}`
      : `card bg-blue-tangaroa rounded-lg py-2 px-4 sm:py-3 sm:px-6`;
  return (
    <>
      <div id={id} className={getClass}>
        <div className="eth-date text-2xs sm:text-sm md:text-base lg:text-sm font-light mb-1 xl:mb-0 text-blue-shipcove text-left xl:leading-card font-roboto">
          {name}
        </div>
        {renderType()}
      </div>
    </>
  );
};

export default Card;
