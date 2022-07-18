// import * as DateFns from "date-fns";
// import { useContext } from "react";
// import Skeleton from "react-loading-skeleton";
// import { FeatureFlagsContext } from "../../feature-flags";
// import { pipe } from "../../fp";
// import { MoneyAmount } from "../Amount";
import { AmountUnitSpace } from "../Spacing";
import { TextRoboto, UnitText } from "../Texts";
import { WidgetBackground, WidgetTitle } from "../WidgetSubcomponents";
// import PreciseEth from "./PreciseEth";

// const formatTimeElapsed = (dateTime: Date) =>
//   pipe(
//     DateFns.differenceInDays(new Date(), dateTime),
//     (days) => `${days} days`,
//   );

const PeakSupplyWidget = () => {
  // const { previewSkeletons } = useContext(FeatureFlagsContext);
  // const supplyPeak = {
  //   totalSupply: 119000000,
  //   setOn: DateFns.subDays(new Date(), 3),
  // };

  return (
    <WidgetBackground>
      <div className="flex flex-col gap-y-4">
        {/* Keeps the height of this widget equal to the adjacent one. */}
        <WidgetTitle className="flex items-center min-h-[21px]">
          supply peak
        </WidgetTitle>
        {/* Keeps the height of this widget equal to the adjacent one. */}
        <div className="text-[1.73rem] font-light whitespace-nowrap">
          <TextRoboto>-</TextRoboto>
          <AmountUnitSpace />
          <UnitText>ETH</UnitText>
        </div>
        {/* <PreciseEth>{undefined}</PreciseEth> */}
        {/* <span className="font-inter text-blue-spindle text-xs md:text-sm font-extralight"> */}
        {/*   {"set "} */}
        {/*   <span className="font-roboto text-white font-light [word-spacing:-0.3em]"> */}
        {/*     {/1* {supplyPeak === undefined || previewSkeletons ? ( *1/} */}
        {/*     {/1*   <Skeleton inline={true} width="2rem" /> *1/} */}
        {/*     {/1* ) : ( *1/} */}
        {/*     {/1*   formatTimeElapsed(supplyPeak.setOn) *1/} */}
        {/*     {/1* )} *1/} */}
        {/*     unknown days */}
        {/*   </span> */}
        {/*   {" ago"} */}
        {/* </span> */}
        <span className="font-inter text-blue-spindle text-xs md:text-sm font-extralight">
          waiting for the merge...
        </span>
      </div>
    </WidgetBackground>
  );
};

export default PeakSupplyWidget;
