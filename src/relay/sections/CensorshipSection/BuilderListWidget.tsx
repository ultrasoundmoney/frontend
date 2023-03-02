import type { FC } from "react";
import BodyTextV3 from "../../../components/TextsNext/BodyTextV3";
import QuantifyText from "../../../components/TextsNext/QuantifyText";
import {
  WidgetBackground,
  WidgetTitle,
} from "../../../components/WidgetSubcomponents";
import { formatPercentOneDecimal } from "../../../format";
import StyledList from "../../components/StyledList";

type Relay = {
  censoring: boolean;
  description?: string;
  dominance: number;
  name: string;
};

type Api = {
  relays_per_time_frame: Record<"d1", Relay[]>;
};

const api: Api = {
  relays_per_time_frame: {
    d1: [
      {
        censoring: true,
        dominance: 0.261,
        name: "builder0x69",
      },
      {
        censoring: true,
        dominance: 0.198,
        name: "Flashbots",
      },
      {
        censoring: false,
        dominance: 0.187,
        name: "beaverbuild",
      },
      {
        censoring: true,
        dominance: 0.101,
        name: "rsync-builder",
      },
      {
        censoring: false,
        dominance: 0.099,
        name: "bloXroute",
      },
      {
        censoring: false,
        dominance: 0.04,
        name: "builder 1",
      },
      {
        censoring: true,
        dominance: 0.04,
        name: "builder 2",
      },
      {
        censoring: false,
        dominance: 0.04,
        name: "builder 3",
      },
    ],
  },
};

type Props = {
  timeFrame: "d1";
};

const BuilderListWidget: FC<Props> = ({ timeFrame }) => {
  const relays = api.relays_per_time_frame[timeFrame];

  return (
    <WidgetBackground>
      <div className="flex flex-col gap-y-4">
        <div className="grid grid-cols-3 md:grid-cols-4">
          <WidgetTitle className="md:col-span-2">builder</WidgetTitle>
          <WidgetTitle className="text-right">censoring</WidgetTitle>
          <WidgetTitle className="text-right">dominance</WidgetTitle>
        </div>
        <StyledList height="h-[182px]">
          {relays.map(({ name, censoring, dominance, description }) => (
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

export default BuilderListWidget;
