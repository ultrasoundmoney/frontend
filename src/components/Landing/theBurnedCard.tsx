import React from "react";
import FirstVidget from "../Vidgets/FirstVidget";
import SecondVidget from "../Vidgets/SecondVidget";
import ThirdVidget from "../Vidgets/ThirdVidget";
import FourthVidget from "../Vidgets/FourthVidget";
import { TranslationsContext } from "../../translations-context";
import { useState, useContext } from "react";
import { StepperContext, StepperPoint } from "../../context/StepperContext";
import { moneyType } from "../Vidgets/helpers";
import { historicalData } from "./historicalData";

const FeeBurnedBlock = () => {
  const t = React.useContext(TranslationsContext);
  const [isShow, setIsShow] = useState(false);
  const [numberETHBlock, setNumberETHBlock] = useState(5);
  const [currentMoneyType, setCurrentMoneyType] = useState<moneyType>(
    "Infationary"
  );
  const stepperPoints = useContext(StepperContext);
  const controlPoints: StepperPoint[] = stepperPoints?.stepperElements
    ? Object.keys(stepperPoints.stepperElements).map((element) => {
        return stepperPoints?.stepperElements[element];
      })
    : [];
  const [currentIndexHistorical, setCurrentIndexHistorical] = useState(0);

  function onScroll() {
    //change data vidgets
    const bodyHeight = document.body.scrollHeight;
    const breackPointShowVidgets =
      controlPoints[0].offsetY - window.innerHeight / 2.4;
    const showVidgets = window.scrollY > breackPointShowVidgets;

    const currentIndex = showVidgets
      ? Math.round(
          (window.scrollY - breackPointShowVidgets) /
            Math.round(bodyHeight / historicalData.length)
        )
      : 0;
    if (currentIndex <= historicalData.length - 1 && currentIndex >= 0) {
      setCurrentIndexHistorical(currentIndex);
    }
    if (window.scrollY > controlPoints[4].offsetY) {
      setNumberETHBlock(0);
      setCurrentMoneyType("Deflationary");
      return;
    } else if (window.scrollY > controlPoints[3].offsetY) {
      setNumberETHBlock(1);
      setCurrentMoneyType("Infationary");
      return;
    } else if (window.scrollY > controlPoints[2].offsetY) {
      setNumberETHBlock(2);
      return;
    } else if (window.scrollY > controlPoints[1].offsetY) {
      setNumberETHBlock(3);
      return;
    } else if (window.scrollY > controlPoints[0].offsetY) {
      setNumberETHBlock(5);
      return;
    }
    //cahnge visibility vidgets bar
    if (showVidgets) {
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
        className={`fixed-fee-burned z-10 inset-x-0 bottom-0 grid grid-cols-2 gap-1 sm:gap-2 lg:flex lg:flex-nowrap justify-center w-full max-w-7xl md:mx-auto px-2 lg:px-4 sticky lg:gap-4 pb-2 lg:pb-4 ${
          isShow ? "active" : ""
        }`}
      >
        <FirstVidget
          date={historicalData[currentIndexHistorical][0]}
          currentMoneyType={currentMoneyType}
        />
        <SecondVidget
          name={t.landing_feeburned_card2_name}
          cost={historicalData[currentIndexHistorical][1]}
          number={historicalData[currentIndexHistorical][2]}
        />
        <ThirdVidget
          numberETHBlock={numberETHBlock}
          name={t.landing_feeburned_card3_name}
        />
        <FourthVidget name={t.landing_feeburned_card4_name} />
      </div>
    </>
  );
};

export default FeeBurnedBlock;
