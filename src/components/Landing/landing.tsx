/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as React from "react";
import Navigation from "../Navigation/Nav";
import Intro from "./Intro";
import EtherTheUltraSound from "./BlockBtcEthUsd";
import TwitterCommunity from "../TwitterCommunity";
import FaqBlock from "./faq";
import NftDrop from "../NftDrop/index";
import FollowingYou from "../FollowingYou";
import TheMergeBlock from "./theMerge";
import Stepper from "../Navigation/Stepper";
import StepperNavigator from "../Navigation/StepperNavigator";

const LandingPage: React.FC<{}> = () => {
  const dummyPoints = [
    {
      offsetY: 1000,
      name: "Genesis",
    },
    {
      offsetY: 2600,
      name: "Byzantium",
    },
    {
      offsetY: 3200,
      name: "Constantinopole",
    },
    {
      offsetY: 3800,
      name: "EIP 1559",
    },
    {
      offsetY: 4400,
      name: "Merge",
    },
  ];
  return (
    <>
      <div className="wrapper bg-blue-midnightexpress blurred-bg-image">
        <div
          style={{
            position: "absolute",
            top: 1000,
            color: "white",
          }}
        >
          Genesis
        </div>
        <div
          style={{
            position: "absolute",
            top: 2600,
            color: "white",
          }}
        >
          Byzantium
        </div>
        <div
          style={{
            position: "absolute",
            top: 3200,
            color: "white",
          }}
        >
          Constantinopole
        </div>
        <div
          style={{
            position: "absolute",
            top: 3800,
            color: "white",
          }}
        >
          EIP 1559
        </div>
        <div
          style={{
            position: "absolute",
            top: 4400,
            color: "white",
          }}
        >
          Merge
        </div>
        <div className="container m-auto">
          <Navigation />
          <div className="w-full">
            <Intro />
          </div>
          <TheMergeBlock />
          <div className="w-full">
            <Stepper controlPoints={dummyPoints} />
          </div>
          <EtherTheUltraSound />
          <section>
            <StepperNavigator />
          </section>
          <FaqBlock />
          <section
            data-aos="fade-up"
            data-aos-anchor-placement="top-center"
            data-aos-delay="50"
            data-aos-duration="1000"
            data-aos-easing="ease-in-out"
            className="flex px-4 md:px-8 lg:px-0 py-8 md:py-40"
            id="join-the-fam"
          >
            <div className="w-full md:w-5/6 lg:w-2/3 md:m-auto relative">
              <TwitterCommunity />
            </div>
          </section>
          <section
            data-aos="fade-up"
            data-aos-anchor-placement="top-center"
            data-aos-delay="50"
            data-aos-duration="1000"
            data-aos-easing="ease-in-out"
            className="flex px-4 md:px-8 lg:px-0 py-24"
          >
            <div className="w-full md:w-5/6 lg:w-2/3 md:m-auto relative">
              <FollowingYou />
            </div>
          </section>
          <NftDrop />
        </div>
      </div>
    </>
  );
};

export default LandingPage;
