/// Shows a list of relays and how much they censor..
import type { FC } from "react";
import DefaultLink from "../../../components/DefaultLink";
import BodyTextV3 from "../../../components/TextsNext/BodyTextV3";
import LabelText from "../../../components/TextsNext/LabelText";
import QuantifyText from "../../../components/TextsNext/QuantifyText";
import { WidgetBackground } from "../../../components/WidgetSubcomponents";
import { formatPercentOneDecimal } from "../../../format";
import StyledOverflowList from "../../components/StyledOverflowList";
import type { Relay } from "./RelayCensorshipWidget";

type Props = {
  relays: Relay[];
  timeFrame: "d7" | "d30";
};

const RelayListWidget: FC<Props> = ({ relays }) => (
  <WidgetBackground>
    <div className="flex flex-col gap-y-4">
      <StyledOverflowList height="h-[214px]">
        <table className="w-full table-auto">
          <thead className="sticky top-0 border-b-4 border-transparent bg-slateus-700">
            <tr>
              <th className="p-0 text-left">
                <LabelText>relay</LabelText>
              </th>
              <th className="p-0 text-right">
                <LabelText>censors</LabelText>
              </th>
              <th className="hidden p-0 text-right sm:table-cell">
                <LabelText>sanctioned</LabelText>
              </th>
              <th className="p-0 text-right">
                <LabelText>dominance</LabelText>
              </th>
            </tr>
          </thead>
          <tbody className="w-full">
            {relays.map(
              ({
                blocks_with_sanctioned_entity,
                censors,
                description,
                dominance,
                id,
                name,
                url,
              }) => (
                <tr
                  className={`border-t-[16px] border-transparent first:border-t-0 last:pb-0 hover:brightness-75`}
                  key={id}
                >
                  <td className="p-0 max-w-[70px] truncate xs:max-w-[85px]">
                    <DefaultLink className="truncate" href={url}>
                      <BodyTextV3>{name}</BodyTextV3>
                      <BodyTextV3
                        className={`${
                          description === undefined ? "hidden" : "inline"
                        }`}
                        color="text-slateus-200"
                      >
                        {" "}
                        {description}
                      </BodyTextV3>
                    </DefaultLink>
                  </td>
                  <td className="p-0 text-right max-w-[70px] xs:max-w-[85px]">
                    <BodyTextV3
                      color={censors ? "text-red-400" : "text-green-400"}
                    >
                      {censors ? "yes" : "no"}
                    </BodyTextV3>
                  </td>
                  <td className="hidden p-0 text-right sm:table-cell xs-w-sm[70px] xs:max-w-[85px]">
                    <QuantifyText
                      unitPostfix="blocks"
                      unitPostfixColor="text-slateus-200"
                    >
                      {blocks_with_sanctioned_entity}
                    </QuantifyText>
                  </td>
                  <td className="p-0 text-right max-w-[70px] xs:max-w-[85px]">
                    <QuantifyText size="text-sm sm:text-base">
                      {formatPercentOneDecimal(dominance)}
                    </QuantifyText>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </StyledOverflowList>
    </div>
  </WidgetBackground>
);

export default RelayListWidget;
