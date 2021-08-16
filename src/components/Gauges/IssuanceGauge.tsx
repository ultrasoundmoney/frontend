import { FC } from "react";
import BaseGauge from "./IssuanceBurnBaseGauge";
import * as StaticEtherData from "../../static-ether-data";
import colors from "../../colors";

type IssuanceGaugeProps = {
  simulateMerge: boolean;
};

const IssuanceGauge: FC<IssuanceGaugeProps> = ({
  simulateMerge: simulateMerge,
}) => {
  const issuance = simulateMerge
    ? (StaticEtherData.powIssuancePerDay * 365.25) / 1000000
    : ((StaticEtherData.powIssuancePerDay + StaticEtherData.posIssuancePerDay) *
        365.25) /
      1000000;

  return (
    <div className="flex flex-col justify-start items-center bg-blue-tangaroa px-4 md:px-0 py-4 pt-7 rounded-lg md:rounded-l-none lg:rounded-l-lg">
      <BaseGauge
        title="issuance"
        value={issuance}
        valueFillColor={colors.drop}
        needleColor={colors.drop}
        emoji="💧"
      />
    </div>
  );
};

export default IssuanceGauge;
