import * as React from "react";
import { useTranslations } from "../../utils/use-translation";
import Card from "../Card/card";
import TimeLineContentBlock from "../ContentBlock/TimeLineContent";

const EIPConstantinopole: React.FC<{}> = () => {
  const { translations: t } = useTranslations();
  return (
    <>
      <TimeLineContentBlock
        blockNrAndTime={t.landing_constantinopole_date}
        title={t.landing_constantinopole_title}
        text={t.landing_constantinopole_text}
        id="eip-constantinople"
      >
        <div className="flex flex-wrap w-full lg:w-7/12 md:mx-auto mb-8 px-4 md:px-8 lg:px-0">
          <Card
            type={1}
            name={t.landing_constantinopole_card_name}
            title={t.landing_constantinopole_card_title}
            className="w-full md:w-auto md:flex-1 mb-4 lg:mb-0"
          />
          <Card
            type={2}
            name={t.landing_constantinopole_card2_name}
            title={t.landing_constantinopole_card2_title}
            number={t.landing_constantinopole_card2_title1}
            className="w-full md:w-auto md:flex-initial mb-4 lg:mb-0"
          />
          <Card
            type={3}
            name={t.landing_constantinopole_card3_name}
            title={t.landing_constantinopole_card3_title}
            className="w-full md:w-auto md:flex-1 mb-4 lg:mb-0"
          />
        </div>
      </TimeLineContentBlock>
    </>
  );
};

export default EIPConstantinopole;
