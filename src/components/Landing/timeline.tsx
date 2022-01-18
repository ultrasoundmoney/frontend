import * as React from "react";
import EthLogo from "../../assets/ethereum-logo-2014-5.svg";

const Timeline: React.FC = () => {
  return (
    <>
      <div className="timeline_wrapper pl-4 md:pl-0 content-center h-96 mb-12">
        <div className="eclips">
          <div className="eclips-line"></div>
        </div>
        <div className="eclips">
          <div className="eclips-line"></div>
        </div>
        <div className="eclips">
          <div className="eclips-line"></div>
        </div>
        <div className="eclips-eth">
          <div className="eclips-eth-line-top"></div>
          {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
          <img src={EthLogo} alt="ultra sound money" />
          <div className="eclips-eth-line-right" />
          <div className="eclips-bottom">
            <div className="eclips-bottom-line"></div>
          </div>
        </div>
        <div className="eclips">
          <div className="eclips-line"></div>
        </div>
        <div className="eclips">
          <div className="eclips-line"></div>
        </div>
      </div>
    </>
  );
};

export default Timeline;
