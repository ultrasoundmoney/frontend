import type { FC } from "react";
import BodyTextV3 from "../../../components/TextsNext/BodyTextV3";
import QuantifyText from "../../../components/TextsNext/QuantifyText";
import {
  WidgetBackground,
  WidgetTitle,
} from "../../../components/WidgetSubcomponents";
import { formatPercentOneDecimal } from "../../../format";
import StyledList from "../../components/StyledList";

type LidoOperator = {
  censoring: boolean;
  description?: string;
  dominance: number;
  name: string;
};

type Api = {
  lido_operators_per_time_frame: Record<"d1", LidoOperator[]>;
};

const api: Api = {
  lido_operators_per_time_frame: {
    d1: [
      {
        censoring: false,
        dominance: 0.042,
        name: "p2p.org",
      },
      {
        censoring: false,
        dominance: 0.04,
        name: "Blockscape",
      },
      {
        censoring: false,
        dominance: 0.039,
        name: "Staking Facilities",
      },
      {
        censoring: true,
        dominance: 0.03,
        name: "Stakefish",
      },
      {
        censoring: false,
        dominance: 0.021,
        name: "DSRV",
      },
      {
        censoring: false,
        dominance: 0.04,
        name: "loperator 1",
      },
      {
        censoring: true,
        dominance: 0.04,
        name: "loperator 2",
      },
      {
        censoring: false,
        dominance: 0.04,
        name: "loperator 3",
      },
    ],
  },
};

type Props = {
  timeFrame: "d1";
};

const LidoOperatorList: FC<Props> = ({ timeFrame }) => {
  const operators = api.lido_operators_per_time_frame[timeFrame];

  return (
    <WidgetBackground>
      <div className="flex flex-col gap-y-4">
        <div className="grid grid-cols-3 md:grid-cols-4">
          <WidgetTitle className="md:col-span-2">operator</WidgetTitle>
          <WidgetTitle className="text-right">censoring</WidgetTitle>
          <WidgetTitle className="text-right">dominance</WidgetTitle>
        </div>
        <StyledList height="h-[182px]">
          {operators.map(({ name, censoring, dominance, description }) => (
            <li
              key={`${name}${description ?? ""}`}
              className="grid grid-cols-3 hover:opacity-60 md:grid-cols-4"
            >
              <div className="col-span-1 md:col-span-2">
                <BodyTextV3>{name}</BodyTextV3>
                {description !== undefined && (
                  <BodyTextV3
                    className="hidden md:inline"
                    color="text-slateus-400"
                  >
                    {" "}
                    {description}
                  </BodyTextV3>
                )}
              </div>
              <BodyTextV3
                className="text-right"
                color={censoring ? "text-white" : "text-emerald-400"}
              >
                {censoring ? "yes" : "no"}
              </BodyTextV3>
              <QuantifyText className="text-right" size="text-sm md:text-base">
                {formatPercentOneDecimal(dominance)}
              </QuantifyText>
            </li>
          ))}
        </StyledList>
      </div>
    </WidgetBackground>
  );
};

export default LidoOperatorList;
