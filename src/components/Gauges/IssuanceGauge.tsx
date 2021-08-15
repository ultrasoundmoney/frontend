import { FC } from "react";
import BaseGauge from "./IssuanceBurnBaseGuage";
import * as EtherStaticData from "../../static-ether-data";

type IssuanceGaugeProps = {
  includePowIssuance: boolean;
};

const IssuanceGauge: FC<IssuanceGaugeProps> = ({ includePowIssuance }) => {
  const powIssuancePerMinute = StaticEtherData.powIssuancePerDay / (24 * 60);
  const posIssuancePerMinute = StaticEtherData.posIssuancePerDay / (24 * 60);
  const issuance = includePowIssuance
    ? powIssuancePerMinute + posIssuancePerMinute
    : posIssuancePerMinute;

  return <BaseGauge title="issuance" value={issuance} />;
};

export default IssuanceGauge;
