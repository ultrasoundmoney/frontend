import * as React from "react";
import Card from "../Card/card";

type FeeBurnedBlcokProps = {
  lineHeight?: string;
};
const FeeBurnedBlcok: React.FC<FeeBurnedBlcokProps> = ({ lineHeight }) => {
  const getLineHeight =
    lineHeight != undefined || lineHeight != null
      ? `eclips-bottom eclips-bottom__left-0 ${lineHeight}`
      : `eclips-bottom eclips-bottom__left-0`;
  return (
    <>
      <div className="flex flex-wrap justify-center w-full md:w-9/12 md:mx-auto mb-8">
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
        <Card
          type={3}
          name={"Block Reward 🔥"}
          title={"$314.55"}
          className=""
        />
      </div>
      <div className="flex flex-wrap justify-center w-full md:w-7/12 md:mx-auto mb-8">
        <div className={getLineHeight}>
          <div className="eclips-bottom-line" />
        </div>
      </div>
    </>
  );
};

export default FeeBurnedBlcok;
