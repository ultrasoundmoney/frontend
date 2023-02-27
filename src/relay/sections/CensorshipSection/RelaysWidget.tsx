import type { FC, ReactNode } from "react";
import { BaseText } from "../../../components/Texts";
import BodyTextV2 from "../../../components/TextsNext/BodyTextV2";
import QuantifyText from "../../../components/TextsNext/QuantifyText";
import {
  WidgetBackground,
  WidgetTitle,
} from "../../../components/WidgetSubcomponents";
import { formatPercentOneDecimal } from "../../../format";
import scrollbarStyles from "../../../styles/Scrollbar.module.scss";

const BodyTextV3: FC<{ children: ReactNode; color?: string }> = ({
  children,
  color,
}) => (
  <BaseText font="font-inter" color={color}>
    {children}
  </BaseText>
);

type Props = {
  relays: Array<{
    censoring: boolean;
    description?: string;
    dominance: number;
    name: string;
  }>;
};

const RelaysWidget: FC<Props> = ({ relays }) => {
  return (
    <WidgetBackground>
      <div className="flex flex-col gap-y-4">
        <div className="grid grid-cols-4">
          <WidgetTitle className="col-span-2">relay</WidgetTitle>
          <WidgetTitle className="text-right">censoring</WidgetTitle>
          <WidgetTitle className="text-right">dominance</WidgetTitle>
        </div>
        <ul
          className={`
            flex max-h-[184px]
            flex-col gap-y-4 overflow-y-auto
            pr-1 md:max-h-[214px]
            ${scrollbarStyles["styled-scrollbar-vertical"]}
            ${scrollbarStyles["styled-scrollbar"]}
          `}
        >
          {relays.map(({ name, censoring, dominance, description }) => (
            <li
              key={`${name}${description ?? ""}`}
              className="grid grid-cols-4 hover:opacity-60"
            >
              <div className="col-span-2">
                <BodyTextV3>{name}</BodyTextV3>
                {description !== undefined && (
                  <BodyTextV3 color="text-slateus-400">
                    {" "}
                    {description}
                  </BodyTextV3>
                )}
              </div>
              {/* We wrap here because the gradient will otherwise logically
              span the whole column but only visually show up as a fraction.
              */}
              <div className="flex justify-end">
                <BodyTextV2
                  color={
                    censoring
                      ? "text-white"
                      : "bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600"
                  }
                >
                  {censoring ? "yes" : "no"}
                </BodyTextV2>
              </div>
              <QuantifyText className="text-right">
                {formatPercentOneDecimal(dominance)}
              </QuantifyText>
            </li>
          ))}
        </ul>
      </div>
    </WidgetBackground>
  );
};

export default RelaysWidget;
