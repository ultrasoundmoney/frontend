/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React from "react";
import * as Sentry from "@sentry/react";
import Navigation from "../Navigation/Nav";
import Intro from "./Intro";
import BeforeGenesis from "./beforeGenesis";
import GenesisBlock from "./gennesis";
import EIPByzantium from "./eipByzantium";
import EIPConstantinopole from "./eipConstantinopole";
import EIP1559 from "./eip1559";
import BlockGoal from "./goal";
import TheMergeBlock from "./theMerge";
import EtherTheUltraSound from "./BlockBtcEthUsd";
import TwitterFam from "../TwitterFam";
import FaqBlock from "./faq";
import NftDrop from "../NftDrop/index";
import FollowingYou from "../FollowingYou";
import AOS from "aos";
import "aos/dist/aos.css";
import SupplyViewNew from "../SupplyViewNew";
import SupplyView from "../SupplyView";
import TheBurnedCard from "./theBurnedCard";
import Stepper from "../Navigation/Stepper";
import { SectionTitle, TextInterLink, TextRoboto } from "../Texts";
import { SteppersProvider } from "../../context/StepperContext";
import styles from "./Landing.module.scss";
import WidgetGroup1 from "../widget-group-1";
import TotalValueSecured from "../TotalValueSecured";
import Scarcity from "../Scarcity";
import ValidatorRewardsWidget from "../ValidatorRewards";
import Flippenings from "../Flippenings";
import PriceModel from "../PriceModel";
import IssuanceBreakdown from "../IssuanceBreakdown";

const SectionDivider: React.FC<{ title: string; subtitle?: string }> = ({
  title,
  subtitle,
}) => (
  <>
    <div className="h-32"></div>
    <SectionTitle title={title} subtitle={subtitle} />
    <div className="h-16"></div>
  </>
);

const LandingPage: React.FC = () => {  
  React.useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);

  return (
    <SteppersProvider>
      <div className="wrapper">
        <Stepper />
        <Navigation />
        <Intro />
        <BeforeGenesis />
        <section data-navigationtrackingblock>
          <div>
            <GenesisBlock />
          </div>
          <div>
            <EIPByzantium />
          </div>
          <div>
            <EIPConstantinopole />
          </div>
          <div>
            <EIP1559 />
          </div>
          <div>
            <BlockGoal />
            <div
              data-aos="fade-up"
              data-aos-anchor-placement="top-bottom"
              data-aos-offset="100"
              data-aos-delay="100"
              data-aos-duration="1000"
              data-aos-easing="ease-in-out"
              className="flex flex-col px-4 md:px-0 mt-6 mb-16"
              id="supplyview"
            >
              <div className="w-full md:w-5/6 lg:w-5/6 md:m-auto relative md:px-11 py-4 md:py-11 rounded-xl">
                <SupplyViewNew />
              </div>
              <div className="flex flex-wrap justify-center pt-20">
                <div id="line__supplyview" className={`${styles.eclipsHr}`} />
              </div>
            </div>
            <TheMergeBlock />
          </div>
        </section>
        <EtherTheUltraSound />
        <SectionDivider
            title="the dashboard"
            subtitle="securing the internet of value"
          />
        <Sentry.ErrorBoundary
          fallback={
            <div className="bg-blue-tangaroa w-4/6 m-auto p-8 rounded-lg font-roboto text-white text-xl text-center">
              an unexpected exception occured, devs have been notified.
            </div>
          }
        >
          <WidgetGroup1 />
        </Sentry.ErrorBoundary>
        <SectionDivider
          title="total value secured—TVS"
          subtitle="securing the internet of value"
        />
        <div className="flex flex-col px-4 md:px-16">
          <TotalValueSecured></TotalValueSecured>
        </div>
        <SectionDivider
          title="monetary premium"
          subtitle="the race to become the most desirable money"
        />
        <div className="flex flex-col lg:flex-row gap-y-4 lg:gap-x-4 px-4 md:px-16">
          {/* <video */}
          {/*   className="absolute w-1/2 -left-20 -mt-96 opacity-20 -z-10 -mr-8" */}
          {/*   playsInline */}
          {/*   autoPlay */}
          {/*   muted */}
          {/*   loop */}
          {/*   poster="/orbs1.jpg" */}
          {/* > */}
          {/*   <source src="/orbs1.webm" type="video/webm; codecs='vp9'" /> */}
          {/*   <source src="/orbs1.mp4" type="video/mp4" /> */}
          {/* </video> */}
          <div className="flex flex-col basis-1/2 gap-y-4">
            <Scarcity />
            <ValidatorRewardsWidget />
            <Flippenings />
          </div>
          <div className="basis-1/2 flex flex-col gap-y-4">
            <PriceModel />
            <IssuanceBreakdown />
          </div>
        </div>
        <div className="flex flex-col px-4 md:px-16">
          <SectionDivider
            title="project the supply"
            subtitle="get ready for a peakening"
          />
          <div className="w-full md:m-auto relative bg-blue-tangaroa px-2 md:px-4 xl:px-12 py-4 md:py-8 xl:py-12 rounded-xl">
            <SupplyView />
          </div>
        </div>
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
            <TwitterFam />
          </div>
        </section>
        <section
          data-aos="fade-up"
          data-aos-anchor-placement="top-center"
          data-aos-delay="50"
          data-aos-duration="1000"
          data-aos-easing="ease-in-out"
          className="relative flex px-4 md:px-8 lg:px-0 py-24"
        >
          <div className="w-full md:w-5/6 lg:w-2/3 md:m-auto relative">
            <FollowingYou />
          </div>
        </section>
        <NftDrop />
        <TheBurnedCard />
      </div>
    </SteppersProvider>
  );
};

export default LandingPage;
