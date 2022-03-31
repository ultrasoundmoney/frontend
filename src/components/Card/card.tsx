import * as React from "react";

type CardProps = {
  type: number;
  className?: string;
  name: string;
  title: string;
  number?: string;
  id?: string;
};

const Card: React.FC<CardProps> = ({
  type,
  name,
  title,
  number,
  className,
  id,
}) => {
  const renderType = () => {
    if (type === 1) {
      return (
        <div className="eth-status text-xs font-light text-white text-left xl:leading-10 font-roboto">
          {title}
        </div>
      );
    } else if (type === 2) {
      return (
        <div className="flex flex-wrap justify-between items-center">
          <div className="eth-supply text-sm xl:text-41xl font-light text-white text-left xl:leading-18 font-roboto">
            {title}
          </div>
          <div className="eth-supply-incr md:pl-8 text-sm xl:text-base font-light text-green-mediumspring text-left font-roboto">
            {number}
          </div>
        </div>
      );
    } else if (type === 3) {
      return (
        <div
          className="eth-burn-fee card-text text-sm xl:text-21xl font-light text-white text-left font-roboto"
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
      ? `card bg-blue-tangaroa rounded-lg py-2 px-4 ${className}`
      : `card bg-blue-tangaroa rounded-lg py-2 px-4`;
  return (
    <>
      <div id={id} className={getClass}>
        <div className="eth-date text-2xs font-light mb-1 text-blue-shipcove text-left xl:leading-card font-roboto">
          {name}
        </div>
        {renderType()}
      </div>
    </>
  );
};

export default Card;
