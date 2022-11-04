/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import React, { useRef } from "react";
import FirstVidget from "../Vidgets/FirstVidget";
import SecondVidget from "../Vidgets/SecondVidget";
import ThirdVidget from "../Vidgets/ThirdVidget";
import FourthVidget from "../Vidgets/FourthVidget";
import TranslationsContext from "../../contexts/TranslationsContext";
import { useState, useContext } from "react";
import type { StepperPoint } from "../../contexts/StepperContext";
import { StepperContext } from "../../contexts/StepperContext";
import type { moneyType } from "../Vidgets/helpers";
import { historicalData } from "./historicalData";
import styles from "./Landing.module.scss";
import { OFFSET_FAQ } from "../Navigation/helpers";
import { calcCenterElement } from "../../utils/calcCenterElement";
import { NavigationContext } from "../../contexts/NavigationContext";

const FeeBurnedBlock = () => {
  const t = React.useContext(TranslationsContext);
  const [isShow, setIsShow] = useState(false);
  const [numberETHBlock, setNumberETHBlock] = useState(5);
  const [currentMoneyType, setCurrentMoneyType] =
    useState<moneyType>("Infationary");
  const stepperPoints = useContext(StepperContext);
  const { hidingNavigationPosition } = useContext(NavigationContext);
  const controlPoints: StepperPoint[] = stepperPoints?.stepperElements
    ? // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      (Object.keys(stepperPoints.stepperElements).map((element) => {
        return stepperPoints?.stepperElements[element];
      }) as StepperPoint[])
    : [];
  const [currentIndexHistorical, setCurrentIndexHistorical] = useState(0);

  const vidgets = useRef<HTMLDivElement>(null);
  function onScroll() {
    //change data vidgets
    const bodyHeight = document.body.scrollHeight;
    const breackPointShowVidgets =
      controlPoints[0]?.offsetY! - window.innerHeight / 2.4;

    const showVidgets =
      window.scrollY > breackPointShowVidgets &&
      window.scrollY < hidingNavigationPosition;

    const currentIndexData = showVidgets
      ? Math.round(
          (window.scrollY - breackPointShowVidgets) /
            Math.round(bodyHeight / historicalData.length),
        )
      : 0;

    //cahnge visibility vidgets bar
    if (showVidgets) {
      setIsShow(true);
    } else {
      setIsShow(false);
    }
    //set current data for vidgets
    if (
      currentIndexData <= historicalData.length - 1 &&
      currentIndexData >= 0
    ) {
      setCurrentIndexHistorical(currentIndexData);
    }
    if (window.scrollY > controlPoints[4]?.offsetY!) {
      setNumberETHBlock(0);
      setCurrentMoneyType("Deflationary");
      return;
    } else if (window.scrollY > controlPoints[3]?.offsetY!) {
      setNumberETHBlock(1);
      setCurrentMoneyType("Infationary");
      return;
    } else if (window.scrollY > controlPoints[2]?.offsetY!) {
      setNumberETHBlock(2);
      return;
    } else if (window.scrollY > controlPoints[1]?.offsetY!) {
      setNumberETHBlock(3);
      return;
    } else if (window.scrollY > controlPoints[0]?.offsetY!) {
      setNumberETHBlock(5);
      return;
    }
  }

  React.useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [stepperPoints]);

  return (
    <>
      <div
        ref={vidgets}
        id="eth-card"
        className={`${
          styles.fixedFeeBurned
        } fixed inset-x-0 bottom-0 z-10 grid w-full max-w-screen-2xl grid-cols-2 justify-center gap-1 px-2 pb-2 sm:gap-2 md:mx-auto lg:flex lg:flex-nowrap lg:gap-4 lg:px-4 lg:pb-4 ${
          isShow ? styles.active : ""
        }`}
      >
        <FirstVidget
          date={historicalData[currentIndexHistorical]![0]}
          currentMoneyType={currentMoneyType}
        />
        <SecondVidget
          name={t.landing_feeburned_card2_name}
          cost={historicalData[currentIndexHistorical]![1]}
          number={historicalData[currentIndexHistorical]![2]}
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
