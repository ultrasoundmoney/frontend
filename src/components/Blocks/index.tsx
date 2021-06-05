import * as React from "react";
import Block from "./block";

type EthBlocksPros = {
  Data?: Data;
  currentBlockNr: number;
};
const EthBlocks: React.FC<EthBlocksPros> = ({ currentBlockNr, Data }) => {
  const remamingBlocks = currentBlockNr - Number(Data.countdownNr);
  return (
    <>
      <div className="sm:flex sm:justify-between md:justify-start sm:content-center w-auto">
        <Block
          title={Data.title_countdown}
          currentBlockNr={Number(Data.countdownNr)}
        />
        <Block
          title={Data.title_current_block}
          currentBlockNr={currentBlockNr}
        />
        <Block
          title={Data.title_remaning_block}
          currentBlockNr={remamingBlocks}
        />
      </div>
    </>
  );
};

export default EthBlocks;
