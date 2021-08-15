import { FC } from "react";
import BaseGauge from "./IssuanceBurnBaseGauge";
import * as StaticEtherData from "../../static-ether-data";
import SpanMoji from "../SpanMoji";
import colors from "../../colors";

type IssuanceGaugeProps = {
  includePowIssuance: boolean;
};

const IssuanceGauge: FC<IssuanceGaugeProps> = ({ includePowIssuance }) => {
  const powIssuancePerMinute = StaticEtherData.powIssuancePerDay / (24 * 60);
  const posIssuancePerMinute = StaticEtherData.posIssuancePerDay / (24 * 60);
  const issuance = includePowIssuance
    ? powIssuancePerMinute + posIssuancePerMinute
    : posIssuancePerMinute;

  return (
    <div className="flex flex-col justify-start items-center bg-blue-tangaroa px-4 md:px-0 py-4 pt-7 rounded-lg md:rounded-l-none lg:rounded-l-lg">
      <SpanMoji className="text-4xl" emoji="💧" />
      <BaseGauge
        title="issuance"
        value={issuance}
        valueFillColor={colors.drop}
        needleColor={colors.drop}
      />
    </div>
  );
};

export default IssuanceGauge;
