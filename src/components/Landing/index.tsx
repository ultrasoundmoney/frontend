import * as React from "react";
// import Navigation from "../Navigation";
import Navigation from "../Navigation/Nav";
import Intro from "./Intro";
import BeforeGenesis from "./beforeGenesis";
import GenesisBlock from "./gennesis";
import EIPByzantium from "./eipByzantium";
import EIPConstantinopole from "./eipConstantinopole";
import EIP1559 from "./eip1559";
import BlockGoal from "./goal";
import FeeBurnedBlcok from "./feeBurn";
import TheMergeBlock from "./theMerge";
import EtherTheUltraSound from "./theUltraSound";
import TwitterCommunity from "../TwitterCommunity";
import FaqBlock from "./faq";
import NftDrop from "../NftDrop/index";
import FollowingYou from "../FollowingYou";
import AOS from "aos";
import "aos/dist/aos.css";
// import SupplyView from "../SupplyView";

const LandingPage: React.FC<{}> = () => {
  React.useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);
  return (
    <>
      <div className="wrapper bg-blue-midnightexpress">
        <div className="container m-auto">
          <Navigation />
          <Intro />
          <BeforeGenesis />
          <GenesisBlock />
          <EIPByzantium />
          <EIPConstantinopole />
          <EIP1559 />
          <BlockGoal />
          {/* <div
            data-aos="fade-up"
            data-aos-anchor-placement="top-bottom"
            data-aos-offset="100"
            data-aos-delay="100"
            data-aos-duration="1000"
            data-aos-easing="ease-in-out"
            className="flex flex-col px-4 md:px-0 mb-16"
          >
            <div className="w-full md:w-5/6 lg:w-5/6 md:m-auto relative bg-blue-tangaroa md:px-8 py-4 md:py-8 md:py-16 rounded-xl">
              <SupplyView />
            </div>
          </div> */}
          <FeeBurnedBlcok />
          <TheMergeBlock />
          <EtherTheUltraSound />
          <FaqBlock />
          <section
            data-aos="fade-up"
            data-aos-anchor-placement="top-center"
            data-aos-delay="50"
            data-aos-duration="1000"
            data-aos-easing="ease-in-out"
            className="flex px-4 md:px-8 lg:px-0 py-8 md:py-40"
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
