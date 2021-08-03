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
        <div className="eth-status text-lg font-light text-white text-left xl:leading-10 font-roboto">
          {title}
        </div>
      );
    } else if (type === 2) {
      return (
        <div className="flex flex-wrap justify-between">
          <div className="eth-supply text-41xl font-light text-white text-left xl:leading-18 font-roboto">
            {title}
          </div>
          <div className="eth-supply-incr md:pl-8 text-base font-light text-green-mediumspring text-left leading-loose1 font-roboto">
            {number}
          </div>
        </div>
      );
    } else if (type === 3) {
      return (
        <div
          className="eth-burn-fee card-text text-21xl font-light text-white text-left leading-10 font-roboto"
          dangerouslySetInnerHTML={{
            __html: title,
          }}
        />
      );
    } else {
      return (
        <div className="text-lg font-light text-white text-left leading-10 font-roboto">
          {title}
        </div>
      );
    }
  };
  const getClass =
    className != undefined || className != null
      ? `card bg-blue-tangaroa rounded-lg py-3 md:m-2 px-8 ${className}`
      : `card bg-blue-tangaroa rounded-lg py-3 md:m-2 px-8`;
  return (
    <>
      <div id={id} className={getClass}>
        <div className="eth-date text-base font-light text-blue-shipcove text-left xl:leading-card font-roboto">
          {name}
        </div>
        {renderType()}
      </div>
    </>
  );
};

export default Card;
