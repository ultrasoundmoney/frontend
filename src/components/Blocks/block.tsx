import * as React from "react";

type BlockPros = {
  title: string;
  currentBlockNr: number;
};
const Block: React.FC<BlockPros> = ({ title, currentBlockNr }) => {
  return (
    <>
      <div className="flex-1 bg-blue-tangaroa sm:mx-2 px-5 py-3 rounded-md mb-4 w-full first:ml-0 last:mr-0">
        <div className="text-xs text-blue-spindle text-left font-light uppercase leading-2">
          {title}
        </div>
        <div className="text-base text-white font-light text-left">
          #{currentBlockNr}
        </div>
      </div>
    </>
  );
};

export default Block;
