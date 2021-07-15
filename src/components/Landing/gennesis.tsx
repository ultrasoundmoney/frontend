import * as React from "react";
import Card from "../Card/card";
import TimeLineContentBlock from "../ContentBlock/TimeLineContent";
import { TranslationsContext } from "../../translations-context";

const GenesisBlock: React.FC<{}> = () => {
  const t = React.useContext(TranslationsContext);
  return (
    <>
      <TimeLineContentBlock
        blockNrAndTime={t.landing_genesis_date}
        title={t.landing_genesis_title}
        text={t.landing_genesis_text}
        id="genesis"
      >
        <div className="w-full lg:w-7/12 md:flex md:flex-wrap md:mx-auto mb-8 px-4 md:px-8 lg:px-0">
          <Card
            type={1}
            name={t.landing_genesis_card_name}
            title={t.landing_genesis_card_title}
            className="w-full md:w-auto md:flex-1 mb-4 lg:mb-0"
          />
          <Card
            type={2}
            name={t.landing_genesis_card2_name}
            title={t.landing_genesis_card2_title}
            number={t.landing_genesis_card2_title1}
            className="w-full md:w-auto md:flex-initial mb-4 lg:mb-0"
          />
          <Card
            type={3}
            name={t.landing_genesis_card3_name}
            title={t.landing_genesis_card3_title}
            className="w-full md:w-auto md:flex-1 mb-4 lg:mb-0"
          />
        </div>
      </TimeLineContentBlock>
    </>
  );
};

export default GenesisBlock;
