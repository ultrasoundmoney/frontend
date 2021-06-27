import * as React from "react";
import { useTranslations } from "../../utils/use-translation";
import Card from "../Card/card";

type FeeBurnedBlcokProps = {
  lineHeight?: string;
};
const FeeBurnedBlcok: React.FC<FeeBurnedBlcokProps> = ({ lineHeight }) => {
  const { translations: t } = useTranslations();
  const getLineHeight =
    lineHeight != undefined || lineHeight != null
      ? `eclips-bottom eclips-bottom__left-0 ${lineHeight}`
      : `eclips-bottom eclips-bottom__left-0`;
  return (
    <>
      <div className="flex flex-wrap justify-center w-full md:w-9/12 md:mx-auto mb-8">
        <Card
          type={1}
          name={t.landing_feeburned_card1_name}
          title={t.landing_feeburned_card1_title}
          className="flex-1"
        />
        <Card
          type={2}
          name={t.landing_feeburned_card2_name}
          title={t.landing_feeburned_card2_title}
          number={t.landing_feeburned_card2_title1}
          className="flex-initial"
        />
        <Card
          type={3}
          name={t.landing_feeburned_card3_name}
          title={t.landing_feeburned_card3_title}
          className="flex-1"
        />
        <Card
          type={3}
          name={t.landing_feeburned_card4_name}
          title={t.landing_feeburned_card4_title}
          className=""
        />
      </div>
      <div className="flex flex-wrap justify-center w-full md:w-7/12 md:mx-auto mb-8">
        <div className={getLineHeight}>
          <div className="eclips-bottom-line" />
        </div>
      </div>
    </>
  );
};

export default FeeBurnedBlcok;
