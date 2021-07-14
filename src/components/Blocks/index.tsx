import * as React from "react";
import Block from "./block";
import { TranslationsContext } from "../../translations-context";

type EthBlocksPros = {
  currentBlockNr: number;
};
const EthBlocks: React.FC<EthBlocksPros> = ({ currentBlockNr }) => {
  const t = React.useContext(TranslationsContext);
  const remamingBlocks = Number(t.countdownNr) - currentBlockNr;
  return (
    <>
      <div className="sm:flex sm:justify-between md:justify-start sm:content-center w-auto">
        <Block
          title={t.title_countdown}
          currentBlockNr={Number(t.countdownNr)}
          isHas
        />
        <Block
          title={t.title_current_block}
          currentBlockNr={currentBlockNr}
          isHas
        />
        <Block
          title={t.title_remaning_block}
          currentBlockNr={remamingBlocks}
          isHas={false}
        />
      </div>
    </>
  );
};

export default EthBlocks;
