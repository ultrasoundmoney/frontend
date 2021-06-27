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
        </div>
      </div>
    </>
  );
};

export default LandingPage;
