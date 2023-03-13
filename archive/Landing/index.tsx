import AOS from "aos";
import "aos/dist/aos.css";
import React from "react";
import { NavigationProvider } from "../../contexts/NavigationContext";
import { SteppersProvider } from "../../contexts/StepperContext";
import FollowingYou from "../FollowingYou";
import Navigation from "../Navigation/Nav";
import Stepper from "../Navigation/Stepper";
import SupplyViewNew from "../SupplyViewNew";
import TwitterFam from "../TwitterFam";
import BeforeGenesis from "./beforeGenesis";
import EtherTheUltraSound from "./BlockBtcEthUsd";
import EIP1559 from "./eip1559";
import EIPByzantium from "./eipByzantium";
import EIPConstantinopole from "./eipConstantinopole";
import FaqBlock from "./faq";
import GenesisBlock from "./gennesis";
import BlockGoal from "./goal";
import Intro from "./Intro";
import styles from "./Landing.module.scss";
import TheBurnedCard from "./theBurnedCard";
import TheMergeBlock from "./theMerge";

const LandingPage: React.FC = () => {
  React.useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);

  return (
    <SteppersProvider>
      <NavigationProvider>
        <div className="wrapper">
          <Stepper />
          <Navigation />
          <div className="container mx-auto">
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
                  className="mt-6 mb-16 flex flex-col px-4 md:px-0"
                  id="supplyview"
                >
                  <div className="relative w-full rounded-xl py-4 md:m-auto md:w-5/6 md:px-11 md:py-11 lg:w-5/6">
                    <SupplyViewNew />
                  </div>
                  <div className="flex flex-wrap justify-center pt-20">
                    <div
                      id="line__supplyview"
                      className={`${styles.eclipsHr}`}
                    />
                  </div>
                </div>
                <TheMergeBlock />
              </div>
            </section>
            <EtherTheUltraSound />

            <FaqBlock />
            <section
              data-aos="fade-up"
              data-aos-anchor-placement="top-center"
              data-aos-delay="50"
              data-aos-duration="1000"
              data-aos-easing="ease-in-out"
              className="flex px-4 py-8 md:px-8 md:py-40 lg:px-0"
              id="fam"
            >
              <div className="relative w-full md:m-auto md:w-5/6 lg:w-2/3">
                <TwitterFam />
              </div>
            </section>
            <section
              data-aos="fade-up"
              data-aos-anchor-placement="top-center"
              data-aos-delay="50"
              data-aos-duration="1000"
              data-aos-easing="ease-in-out"
              className="relative mb-32 flex px-4 py-24 md:px-8 lg:px-0"
            >
              <div className="relative w-full md:m-auto md:w-5/6 lg:w-2/3">
                <FollowingYou />
              </div>
            </section>
            <TheBurnedCard />
          </div>
        </div>
      </NavigationProvider>
    </SteppersProvider>
  );
};

export default LandingPage;
