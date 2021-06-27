import * as React from "react";
import Card from "../Card/card";
import TimeLineContentBlock from "../ContentBlock/TimeLineContent";

const EIPConstantinopole: React.FC<{}> = () => {
  return (
    <>
      <TimeLineContentBlock
        blockNrAndTime="Block 4,370,000, Oct 16, 2017"
        title="EIP Constantinopole"
        text="EIP (Ethereum Imprevement Proposal) is open access to digital money and data-friendly services for everyone – no matter your background or location. It's a community-built technology behind the cryptocurrency ether (ETH) "
      >
        <div className="flex flex-wrap w-full md:w-7/12 md:mx-auto mb-8">
          <Card
            type={1}
            name={"Status"}
            title={"Money (Infationary)"}
            className="flex-1"
          />
          <Card
            type={2}
            name={"Eth Supply"}
            title={"72M"}
            number={"↑+5.3%"}
            className="flex-initial"
          />
          <Card
            type={3}
            name={"Block Reward"}
            title={"3 ETH/<span>Block</span>"}
            className="flex-1"
          />
        </div>
      </TimeLineContentBlock>
    </>
  );
};

export default EIPConstantinopole;
