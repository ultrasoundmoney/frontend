import * as React from "react";

type BlockPros = {
  title: string;
  currentBlockNr: number;
};
const Block: React.FC<BlockPros> = ({ title, currentBlockNr }) => {
  return (
    <>
      <div className="bg-blue-tangaroa md:mx-4 px-8 rounded-md mb-4">
        <div className="text-xs text-blue-spindle text-left font-light uppercase leading-2 pt-2">
          {title}
        </div>
        <div className="text-base text-white font-light text-left pb-3">
          #{currentBlockNr}
        </div>
      </div>
    </>
  );
};

export default Block;
