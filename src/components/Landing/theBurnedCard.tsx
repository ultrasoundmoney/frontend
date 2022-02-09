import * as React from "react";
import Card from "../Card/card";
import { TranslationsContext } from "../../translations-context";
import { useState } from "react";

type FeeBurnedBlockProps = {
  lineHeight?: string;
};
const FeeBurnedBlock: React.FC<FeeBurnedBlockProps> = () => {
  const t = React.useContext(TranslationsContext);
  const [isShow, setIsShow] = useState(true);

  function onScroll() {
    const isTopScreen = window.scrollY < window.innerHeight / 3;
    setIsShow(isTopScreen);
  }

  React.useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div
        id="eth-card"
        className={`fixed-fee-burned flex flex-wrap justify-center w-full md:w-full xl:w-10/12 md:mx-auto px-4 md:px-4 sticky gap-4 pb-4 ${
          isShow && "active"
        }`}
      >
        <Card
          type={1}
          name={`Status ${t.landing_feeburned_card1_name}`}
          title={t.landing_feeburned_card1_title}
          className="burned_1 w-full md:w-3/12"
        />
        <Card
          type={2}
          name={t.landing_feeburned_card2_name}
          title={t.landing_feeburned_card2_title}
          number={t.landing_feeburned_card2_title1}
          className="burned_2 w-full md:w-3/12"
        />
        <Card
          type={3}
          name={t.landing_feeburned_card3_name}
          title={t.landing_feeburned_card3_title}
          className="burned_3 w-full md:w-3/12"
        />
        <Card
          type={3}
          name={t.landing_feeburned_card4_name}
          title={t.landing_feeburned_card4_title}
          className="burned_4 w-full md:w-3/12"
        />
      </div>
    </>
  );
};

export default FeeBurnedBlock;
