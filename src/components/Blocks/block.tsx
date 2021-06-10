import * as React from "react";

type BlockPros = {
  title: string;
  currentBlockNr: number;
  isHas: boolean;
};
const Block: React.FC<BlockPros> = ({ title, currentBlockNr, isHas }) => {
  const getBlocksNumber = new Intl.NumberFormat().format(currentBlockNr);
  return (
    <>
      <div className="flex-1 bg-blue-tangaroa sm:mx-2 px-5 py-3 rounded-md mb-4 w-full first:ml-0 last:mr-0">
        <div className="text-xs text-blue-spindle text-left font-light uppercase leading-2">
          {title}
        </div>
        <div className="text-base text-white font-light text-left">
          {isHas && "#"}
          {getBlocksNumber}
        </div>
      </div>
    </>
  );
};

export default Block;
