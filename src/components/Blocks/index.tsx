import * as React from "react";
import { useTranslations } from "../../utils/use-translation";
import Block from "./block";

type EthBlocksPros = {
  currentBlockNr: number;
};
const EthBlocks: React.FC<EthBlocksPros> = ({ currentBlockNr }) => {
  const { translations: t } = useTranslations();
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
