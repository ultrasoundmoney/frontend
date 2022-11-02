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
          cursor-pointer rounded-lg py-3 pl-10
          pr-6 font-roboto text-sm leading-none text-white
          ${styles.spanBtc} mx-2 transition-all duration-100
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
          setSpecificTab("usd");
        }}
        className={`cursor-pointer rounded-lg py-3 pl-10
          pr-6 font-roboto text-sm leading-none text-white
          ${styles.spanUsd} mx-2 transition-all duration-100
          ${
            cryptoType === "usd"
              ? "bg-blue-tangaroa hover:bg-blue-tangaroa focus:bg-blue-tangaroa"
              : "bg-transparent hover:bg-blue-tangaroa focus:bg-blue-tangaroa"
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
              ? "bg-blue-tangaroa hover:bg-blue-tangaroa focus:bg-blue-tangaroa"
              : "bg-transparent hover:bg-blue-tangaroa focus:bg-blue-tangaroa"
          }
        `}
      >
        ETH
      </div>
    </div>
  );
};
export default CurrencyTabs;
