import * as React from "react";
import { useTranslations } from "../../utils/use-translation";
import Card from "../Card/card";
import TimeLineContentBlock from "../ContentBlock/TimeLineContent";

const EIPByzantium: React.FC<{}> = () => {
  const { translations: t } = useTranslations();
  return (
    <>
      <TimeLineContentBlock
        blockNrAndTime={t.landing_byzantium_date}
        title={t.landing_byzantium_title}
        text={t.landing_byzantium_text}
      >
        <div className="flex flex-wrap w-full md:w-7/12 md:mx-auto mb-8">
          <Card
            type={1}
            name={t.landing_byzantium_card_name}
            title={t.landing_byzantium_card_title}
            className="flex-1"
          />
          <Card
            type={2}
            name={t.landing_byzantium_card2_name}
            title={t.landing_byzantium_card2_title}
            number={t.landing_byzantium_card2_title1}
            className="flex-initial"
          />
          <Card
            type={3}
            name={t.landing_byzantium_card3_name}
            title={t.landing_byzantium_card3_title}
            className="flex-1"
          />
        </div>
      </TimeLineContentBlock>
    </>
  );
};

export default EIPByzantium;
