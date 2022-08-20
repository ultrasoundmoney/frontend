import * as React from "react";
import Link from "next/link";
import SupplyChart from "./SupplyChart";
import { useTranslations } from "../../utils/use-translation";
import styles from "./SupplyChart.module.scss";

const DEFAULT_PROJECTED_ETH_STAKING = 10e6;
const DEFAULT_PROJECTED_BASE_GAS_PRICE = 50;

const SupplyView: React.FC = () => {
  const { translations: t } = useTranslations();
  const [showBreakdown] = React.useState(false);

  return (
    <div
      className={`${styles.supplyGraphSection} flex justify-between items-center`}
    >
      <div
        className={`${styles.supplyGraphText} relative pl-14 w-2/5 box-border`}
      >
        <h1 className="text-white font-light text-base md:text-28xl leading-normal text-left mb-8 font-inter">
          {t.supplu_chart_title}
        </h1>
        <p
          className="text-blue-shipcove font-light text-sm text-left mb-8 font-inter leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: t.sypply_chart_description,
          }}
        ></p>
        <button
          type="button"
          style={{ background: "#2D344A", fontSize: "12px" }}
          className="flex-none px-5 py-2 text-base text-white hover:opacity-75 rounded-3xl"
        >
          <Link href="/">
            <a rel="noreferrer">{t.sypply_chart_button}</a>
          </Link>
        </button>
      </div>
      <div
        className={`${styles.supplyGraph} relative w-1/2 box-border overflow-hidden p-3 md:p-7 rounded-lg`}
      >
        <p
          style={{
            fontSize: "12px",
            color: "#B5BDDB",
            marginBottom: "40px",
            marginTop: "10px",
            marginLeft: "10px",
          }}
        >
          ETH SUPPLY
        </p>
        {/* blue blure */}
        <svg
          className="absolute top-0 left-0 w-full h-full"
          width="624"
          height="468"
          viewBox="0 0 624 468"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.14" filter="url(#filter0_f_1633_1005)">
            <ellipse
              cx="336.876"
              cy="254.181"
              rx="275.876"
              ry="177.181"
              fill="#0037FA"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_1633_1005"
              x="-139"
              y="-123"
              width="951.752"
              height="754.361"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="100"
                result="effect1_foregroundBlur_1633_1005"
              />
            </filter>
          </defs>
        </svg>
        <SupplyChart
          projectedStaking={DEFAULT_PROJECTED_ETH_STAKING}
          projectedBaseGasPrice={DEFAULT_PROJECTED_BASE_GAS_PRICE}
          showBreakdown={showBreakdown}
        />
      </div>
    </div>
  );
};

export default SupplyView;
