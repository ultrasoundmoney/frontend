import * as React from "react";
import Card from "../Card/card";
import { TranslationsContext } from "../../translations-context";
import { useState, useContext } from "react";
import { StepperContext } from "../../context/StepperContext";

type FeeBurnedBlockProps = {
  lineHeight?: string;
};
const FeeBurnedBlock: React.FC<FeeBurnedBlockProps> = () => {
  const t = React.useContext(TranslationsContext);
  const [isShow, setIsShow] = useState(false);
  const stepperPoints = useContext(StepperContext);

  const controlPoints: any[] = Object.keys(
    stepperPoints?.stepperElements as {}
  ).map((element) => {
    return stepperPoints?.stepperElements[element];
  });
  function onScroll() {
    if (
      window.scrollY >
      controlPoints[0].offsetY - window.innerHeight / 2 + 200
    ) {
      setIsShow(true);
    } else {
      setIsShow(false);
    }
  }

  React.useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [stepperPoints]);

  return (
    <>
      <div
        id="eth-card"
        className={`fixed-fee-burned inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-1 sm:gap-2 lg:flex lg:flex-nowrap justify-center w-full max-w-7xl md:mx-auto px-2 lg:px-4 sticky lg:gap-4 pb-2 lg:pb-4 ${
          isShow && "active"
        }`}
      >
        <Card
          type={1}
          name={`Status ${t.landing_feeburned_card1_name}`}
          title={t.landing_feeburned_card1_title}
          className="burned_1 w-full lg:w-3/12"
        />
        <Card
          type={2}
          name={t.landing_feeburned_card2_name}
          title={t.landing_feeburned_card2_title}
          number={t.landing_feeburned_card2_title1}
          className="burned_2 w-full lg:w-3/12"
        />
        <Card
          type={3}
          name={t.landing_feeburned_card3_name}
          title={t.landing_feeburned_card3_title}
          eth={true}
          className="burned_3 w-full lg:w-3/12"
        />
        <Card
          type={3}
          name={t.landing_feeburned_card4_name}
          title={t.landing_feeburned_card4_title}
          className="burned_4 w-full lg:w-3/12"
        />
      </div>
    </>
  );
};

export default FeeBurnedBlock;
