import * as React from "react";

type CardProps = {
  type: number;
  className?: string;
  name: string;
  title: string;
  number?: string;
};

const Card: React.FC<CardProps> = ({
  type,
  name,
  title,
  number,
  className,
}) => {
  const renderType = () => {
    if (type === 1) {
      return (
        <div className="text-lg font-light text-white text-left leading-10">
          {title}
        </div>
      );
    } else if (type === 2) {
      return (
        <div className="flex flex-wrap justify-between">
          <div className="text-41xl font-light text-white text-left leading-18">
            {title}
          </div>
          <div className="md:pl-8 text-base font-light text-green-mediumspring text-left leading-loose1">
            {number}
          </div>
        </div>
      );
    } else if (type === 3) {
      return (
        <div
          className="card-text text-21xl font-light text-white text-left leading-10"
          dangerouslySetInnerHTML={{
            __html: title,
          }}
        />
      );
    } else {
      return (
        <div className="text-lg font-light text-white text-left leading-10">
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
      <div className={getClass}>
        <div className="text-base font-light text-blue-shipcove text-left leading-card">
          {name}
        </div>
        {renderType()}
      </div>
    </>
  );
};

export default Card;
