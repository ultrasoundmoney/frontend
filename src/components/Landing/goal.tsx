import * as React from "react";
import IconBlock from "../ContentBlock/IconBlock";

type GoalBlcokProps = {
  styles?: string;
  title: string;
};
const GoalBlcok: React.FC<GoalBlcokProps> = ({ title, styles }) => {
  const getClassName =
    styles != undefined || styles != null
      ? `block w-full md:w-7/12 md:m-auto ${styles}`
      : `block w-full md:w-7/12 md:m-auto`;
  return (
    <>
      <div className={getClassName}>
        <h1
          className="text-white font-light text-base md:text-3xl leading-normal text-center mb-6 leading-title"
          dangerouslySetInnerHTML={{
            __html: title,
          }}
        />
        <div className="w-full flex flex-wrap justify-between py-8">
          <IconBlock
            icon="🔭"
            title="Predictable Transaction Fees"
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt"
          />
          <IconBlock
            icon="🚀"
            title="Predictable Transaction Fees"
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt"
          />
          <IconBlock
            icon="😃"
            title="Predictable Transaction Fees"
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt"
          />
        </div>
      </div>
    </>
  );
};

export default GoalBlcok;
