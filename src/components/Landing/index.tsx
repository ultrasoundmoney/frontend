import * as React from "react";
import Navigation from "../Navigation";
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

const LandingPage: React.FC<{}> = () => {
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
          <FeeBurnedBlcok />
          <TheMergeBlock />
          <EtherTheUltraSound />
          <FaqBlock />
          <section className="flex px-4 md:px-8 lg:px-0 py-8 md:py-40">
            <div className="w-full md:w-5/6 lg:w-2/3 md:m-auto relative">
              <TwitterCommunity />
            </div>
          </section>
          <section className="flex px-4 md:px-8 lg:px-0 py-24">
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
