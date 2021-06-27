import * as React from "react";
import ContentBlock from "../ContentBlock/ContentBlcok";
import EthLogo from "../../assets/ethereum-logo-2014-5.svg";

const EIP1559: React.FC<{}> = () => {
  return (
    <>
      <ContentBlock
        img={EthLogo}
        title={"EIP 1559 aka (The Fee 🔥 Burn)"}
        text={
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud e "
        }
        styles="block-fee-burn"
      />
    </>
  );
};

export default EIP1559;
