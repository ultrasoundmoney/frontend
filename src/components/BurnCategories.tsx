import { FC } from "react";
import { Amount } from "./Amount";
import { LabelText, TextRoboto } from "./Texts";
import WidgetBackground from "./widget-subcomponents/WidgetBackground";
import WidgetTitle from "./widget-subcomponents/WidgetTitle";
import Colors from "../colors";
import { useGroupedData1 } from "../api/grouped_stats_1";

type CategoryBarProps = {
  totalContracts: number;
  nftCount: number;
  defiCount: number;
  gamingCount: number;
};

const CategoryBar: FC<CategoryBarProps> = ({
  totalContracts,
  nftCount,
  defiCount,
  gamingCount,
}) => {
  const nftPercent = (nftCount / totalContracts) * 100;
  const defiPercent = (defiCount / totalContracts) * 100;
  const gamingPercent = (gamingCount / totalContracts) * 100;

  return (
    <div className="relative mt-2 mb-4">
      <div className="h-28 flex items-center">
        <div className="absolute w-full h-2 bg-blue-dusk rounded-full color-animation">
          <div
            className="absolute flex flex-row top-0 left-0 items-center"
            style={{
              width: "100%",
            }}
          >
            <div
              className="flex flex-col items-center"
              style={{
                width: `${nftPercent}%`,
              }}
            >
              <div className="h-2 bg-green-mediumspring rounded-l-full w-full color-animation"></div>
              <p
                className="font-roboto text-white color-animation"
                style={{
                  marginTop: "9px",
                  color: Colors.spindle,
                }}
              >
                {nftCount}
              </p>
            </div>
            <div
              className="flex flex-col items-center"
              style={{
                width: `${defiPercent}%`,
              }}
            >
              <div className="h-2 bg-red-pinkish w-full color-animation"></div>
              <p
                className="font-roboto text-white color-animation"
                style={{
                  marginTop: "9px",
                  color: Colors.spindle,
                }}
              >
                {defiCount}
              </p>
            </div>
            <div
              className="flex flex-col items-center"
              style={{
                width: `${gamingPercent}%`,
              }}
            >
              <div className="h-2 bg-orange-fire w-full color-animation"></div>
              <p
                className="font-roboto text-white color-animation"
                style={{
                  marginTop: "9px",
                  color: Colors.spindle,
                }}
              >
                {gamingCount}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EngineRow: FC<{
  amountFormatted: number;
  link: string;
  name: string;
}> = ({ amountFormatted, link, name }) => (
  <a
    className="grid grid-cols-2 link-animation"
    href={link}
    target="_blank"
    rel="noreferrer"
  >
    <span className="font-inter text-white">{name}</span>
    <TextRoboto className="text-right">{amountFormatted}</TextRoboto>
  </a>
);

const BurnCategories = () => {
  const leaderboards = useGroupedData1()?.leaderboards;
  let totalContracts = 0;
  const counts: Record<string, number> = {};
  leaderboards === undefined
    ? []
    : Object.values(leaderboards)
        .flat()
        .forEach((entry) => {
          if (entry.type !== "contract") {
            return;
          }

          totalContracts++;

          if (typeof entry.category !== "string") {
            return;
          }

          const currentCount = counts[entry.category] || 0;
          const nextCount = currentCount + 1;
          counts[entry.category] = nextCount;
        });

  console.log(totalContracts, counts);

  const burnCategories = {
    nft: 8.6,
    defi: 8.2,
    gaming: 2.1,
    other: 4.5,
  };

  return (
    <WidgetBackground>
      <WidgetTitle title="burn categories" />
      <CategoryBar
        totalContracts={totalContracts}
        nftCount={counts["nft"] ?? 0}
        defiCount={counts["defi"] ?? 0}
        gamingCount={counts["gaming"] ?? 0}
      />
      <div className="flex flex-col gap-y-4">
        <div className="grid grid-cols-2">
          <LabelText>category</LabelText>
          <LabelText className="text-right">count</LabelText>
        </div>
        {
          <>
            <EngineRow amountFormatted={counts["nft"]} link="" name="nft" />
            <EngineRow amountFormatted={counts["defi"]} link="" name="defi" />
            <EngineRow
              amountFormatted={counts["gaming"] ?? 0}
              link=""
              name="gaming"
            />
            <EngineRow amountFormatted={totalContracts} link="" name="total" />
            <EngineRow
              amountFormatted={Object.values(counts).reduce(
                (sum, num) => sum + num,
                0,
              )}
              link=""
              name="identified"
            />
          </>
        }
      </div>
    </WidgetBackground>
  );
};

export default BurnCategories;
