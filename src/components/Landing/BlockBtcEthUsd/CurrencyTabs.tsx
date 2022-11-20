import type graphTypes from "./helpers";
import styles from "./BlockBtcEthUsd.module.scss";

type CurrencyTabsProps = {
  setSpecificTab: (type: graphTypes) => void;
  cryptoType: string;
};

const CurrencyTabs: React.FC<CurrencyTabsProps> = ({
  setSpecificTab,
  cryptoType,
}) => {
  return (
    <div className="flex flex-wrap justify-center text-center">
      <div
        onClick={() => {
          setSpecificTab("btc");
        }}
        className={`
          cursor-pointer rounded-lg py-3 pl-10
          pr-6 font-roboto text-sm leading-none text-white
          ${styles.spanBtc} mx-2 transition-all duration-100
          ${
            cryptoType === "btc"
              ? "bg-slateus-700 hover:bg-slateus-700 focus:bg-slateus-700"
              : "bg-transparent hover:bg-slateus-700 focus:bg-slateus-700"
          }
        `}
      >
        BTC
      </div>
      <div
        onClick={() => {
          setSpecificTab("usd");
        }}
        className={`cursor-pointer rounded-lg py-3 pl-10
          pr-6 font-roboto text-sm leading-none text-white
          ${styles.spanUsd} mx-2 transition-all duration-100
          ${
            cryptoType === "usd"
              ? "bg-slateus-700 hover:bg-slateus-700 focus:bg-slateus-700"
              : "bg-transparent hover:bg-slateus-700 focus:bg-slateus-700"
          }
        `}
      >
        USD
      </div>
      <div
        onClick={() => {
          setSpecificTab("eth");
        }}
        className={`cursor-pointer rounded-lg py-3 pl-10
          pr-6 font-roboto text-sm leading-none text-white
          ${styles.spanEth} mx-2 transition-all duration-100
          ${
            cryptoType === "eth"
              ? "bg-slateus-700 hover:bg-slateus-700 focus:bg-slateus-700"
              : "bg-transparent hover:bg-slateus-700 focus:bg-slateus-700"
          }
        `}
      >
        ETH
      </div>
    </div>
  );
};
export default CurrencyTabs;
