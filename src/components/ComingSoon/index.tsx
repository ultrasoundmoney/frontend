import * as React from "react";
import EthBlocks from "../Blocks";
import CountDown from "../CountDown/index";

const ComingSoon: React.FC<{ Data?: Data }> = () => {
  return (
    <>
      <div className="wrapper bg-blue-midnightexpress h-screen ">
        <div className="container m-auto coming-soon">
          <div className="flex">
            <div className="w-full md:w-3/6 md:m-auto md:pt-52 md:pb-5">
              <CountDown targetDate="June 03, 2021" targetTime="23:19:00" />
            </div>
          </div>
          <div className="flex">
            <div className="w-full md:w-3/6 md:m-auto">
              <EthBlocks />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComingSoon;
