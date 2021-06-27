import * as React from "react";
import ContentBlock from "../ContentBlock/ContentBlcok";

const TheMergeBlock: React.FC<{}> = () => {
  return (
    <>
      <ContentBlock
        title={"What's Next?"}
        text={
          '"The Merge" is an upgrade to Ethereum that swaps out the current proof-of-work (PoW) consensus mechanism with a more eco-friendly, efficient, and secure proof-of-stake (PoS) consensus mechanism.'
        }
        styles="block-fee-burn"
      />
    </>
  );
};

export default TheMergeBlock;
