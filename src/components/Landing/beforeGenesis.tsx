import * as React from "react";
import EthLogo from "../../assets/ethereum-logo-2014-5.svg";
import { useTranslations } from "../../utils/use-translation";
import Timeline from "./timeline";

const BeforeGenesis: React.FC<{}> = () => {
  const { translations: t } = useTranslations();
  return (
    <>
      <div
        id="before-genesis"
        className="flex flex-col justify-center w-full lg:w-6/12 md:m-auto px-4 md:px-8 lg:px-0"
      >
        <img
          className="text-center mx-auto mb-8"
          width="30"
          height="48"
          src={EthLogo}
          alt="ultra sound money"
        />
        <h1 className="text-white font-light text-base md:text-3xl leading-normal text-center mb-6 leading-title">
          {t.landing_before_genesis_title}
        </h1>
        <p className="text-blue-shipcove font-light text-sm text-center mb-10">
          {t.landing_before_genesis_text}
        </p>
      </div>
      <Timeline />
    </>
  );
};

export default BeforeGenesis;
