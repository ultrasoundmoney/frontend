import * as React from "react";

const EthBlocks: React.FC<{ Data?: Data }> = () => {
  return (
    <>
      <div className="md:flex justify-start content-center w-full">
        <div className="bg-blue-tangaroa md:mx-4 px-8 rounded-md">
          <div className="text-xs text-blue-spindle text-left font-light uppercase leading-2 pt-2">
            Countdown for block
          </div>
          <div className="text-base text-white font-light text-left pb-3">
            #123424313213313
          </div>
        </div>
        <div className="bg-blue-tangaroa md:mx-4 px-8 rounded-md">
          <div className="text-xs text-blue-spindle text-left font-light uppercase leading-2 pt-2">
            Countdown for block
          </div>
          <div className="text-base text-white font-light text-left pb-3">
            #123424313213313
          </div>
        </div>
        <div className="bg-blue-tangaroa md:mx-4 px-8 rounded-md">
          <div className="text-xs text-blue-spindle text-left font-light uppercase leading-2 pt-2">
            Countdown for block
          </div>
          <div className="text-base text-white font-light text-left pb-3">
            #123424313213313
          </div>
        </div>
      </div>
    </>
  );
};

export default EthBlocks;
