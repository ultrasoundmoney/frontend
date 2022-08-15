import type { graphTypes } from "./helpers";
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
          pl-10 pr-6 cursor-pointer py-3
          text-sm text-white rounded-lg font-roboto leading-none
          ${styles.spanBtc} transition-all duration-100 mx-2
          ${
            cryptoType === "btc"
              ? "bg-blue-tangaroa hover:bg-blue-tangaroa focus:bg-blue-tangaroa"
              : "bg-transparent hover:bg-blue-tangaroa focus:bg-blue-tangaroa"
          }
        `}
      >
        BTC
      </div>
      <div
        onClick={() => {
          setSpecificTab("eth");
        }}
        className={`pl-10 pr-6 cursor-pointer py-3
          text-sm text-white rounded-lg font-roboto leading-none
          ${styles.spanEth} transition-all duration-100 mx-2
          ${
            cryptoType === "eth"
              ? "bg-blue-tangaroa hover:bg-blue-tangaroa focus:bg-blue-tangaroa"
              : "bg-transparent hover:bg-blue-tangaroa focus:bg-blue-tangaroa"
          }
        `}
      >
        ETH
      </div>
      <div
        onClick={() => {
          setSpecificTab("usd");
        }}
        className={`pl-10 pr-6 cursor-pointer py-3
          text-sm text-white rounded-lg font-roboto leading-none
          ${styles.spanUsd} transition-all duration-100 mx-2
          ${
            cryptoType === "usd"
              ? "bg-blue-tangaroa hover:bg-blue-tangaroa focus:bg-blue-tangaroa"
              : "bg-transparent hover:bg-blue-tangaroa focus:bg-blue-tangaroa"
          }
        `}
      >
        USD
      </div>
    </div>
  );
};
export default CurrencyTabs;
