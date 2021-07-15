import * as React from "react";
import Card from "../Card/card";
import { TranslationsContext } from "../../translations-context";

type FeeBurnedBlcokProps = {
  lineHeight?: string;
};
const FeeBurnedBlcok: React.FC<FeeBurnedBlcokProps> = ({ lineHeight }) => {
  const t = React.useContext(TranslationsContext);
  const getLineHeight =
    lineHeight != undefined || lineHeight != null
      ? `eclips-bottom eclips-bottom__left-0 ${lineHeight}`
      : `eclips-bottom eclips-bottom__left-0`;
  return (
    <>
      <section id="fee-burned">
        <div className="flex flex-wrap justify-center w-full lg:w-9/12 md:mx-auto mb-8 px-4 md:px-8 lg:px-0">
          <Card
            type={1}
            name={t.landing_feeburned_card1_name}
            title={t.landing_feeburned_card1_title}
            className="w-full md:w-auto md:flex-1 mb-4 lg:mb-0"
          />
          <Card
            type={2}
            name={t.landing_feeburned_card2_name}
            title={t.landing_feeburned_card2_title}
            number={t.landing_feeburned_card2_title1}
            className="w-full md:w-auto md:flex-initial mb-4 lg:mb-0"
          />
          <Card
            type={3}
            name={t.landing_feeburned_card3_name}
            title={t.landing_feeburned_card3_title}
            className="w-full md:w-auto md:flex-1 mb-4 lg:mb-0"
          />
          <Card
            type={3}
            name={t.landing_feeburned_card4_name}
            title={t.landing_feeburned_card4_title}
            className="w-full md:w-auto mb-4 lg:mb-0"
          />
        </div>
        <div className="flex flex-wrap justify-center w-full lg:w-7/12 md:mx-auto mb-8 px-4 md:px-8 lg:px-0">
          <div className={getLineHeight}>
            <div className="eclips-bottom-line" />
          </div>
        </div>
      </section>
    </>
  );
};

export default FeeBurnedBlcok;
