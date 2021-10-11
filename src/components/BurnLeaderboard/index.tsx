import { FC, memo, useState, useCallback } from "react";
import CountUp from "react-countup";
import imageIds from "../../assets/leaderboard-image-ids.json";
import { weiToEth } from "../../utils/metric-utils";
import FeePeriodControl from "../FeePeriodControl";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useFeeData } from "../../api";
import * as Api from "../../api";
import { formatZeroDigit } from "../../format";

type LeaderboardRowProps = {
  detail?: string;
  fees: number;
  id: string;
  name?: string;
  type: LeaderboardEntry["type"];
  image: string | undefined;
  category: string | null;
};

const getAdminToken = (): string | undefined => {
  if (typeof window === undefined) {
    return undefined;
  }

  const urlSearchParams = new URLSearchParams(window.location.search);
  const adminToken = urlSearchParams.get("admin-token");

  if (typeof adminToken !== "string" || adminToken.length === 0) {
    return undefined;
  }

  return adminToken;
};

const LeaderboardRow: FC<LeaderboardRowProps> = ({
  detail,
  fees,
  id,
  name,
  type,
  image,
  category,
}) => {
  const imgSrc =
    typeof image === "string"
      ? image
      : type === "eth-transfers"
      ? "/leaderboard-images/transfer-v2.svg"
      : type === "bot"
      ? "/leaderboard-images/bot-v2.svg"
      : type === "contract-creations"
      ? "/leaderboard-images/contract-creations.svg"
      : imageIds.includes(id)
      ? `/leaderboard-images/${id}.png`
      : "/leaderboard-images/question-mark-v2.svg";

  const adminToken = getAdminToken();

  const onSetTwitterHandle = useCallback(() => {
    const handle = window.prompt(`${name} twitter handle`);
    if (adminToken === undefined || handle === null) {
      return;
    }
    Api.setContractTwitterHandle(adminToken, id, handle);
  }, [adminToken, id, name]);

  const onSetName = useCallback(() => {
    const nameInput = window.prompt(`${name} name`);
    if (adminToken === undefined || nameInput === null) {
      return;
    }
    Api.setContractName(adminToken, id, nameInput);
  }, [adminToken, id, name]);

  const onSetCategory = useCallback(() => {
    const category = window.prompt(`${name} category`);
    if (adminToken === undefined || category === null) {
      return;
    }
    Api.setContractCategory(adminToken, id, category);
  }, [adminToken, id, name]);

  return (
    <div className="pt-2.5 pb-2.5 pr-2.5">
      <a
        href={
          id.startsWith("0x") ? `https://etherscan.io/address/${id}` : undefined
        }
        target="_blank"
        rel="noreferrer"
      >
        <div className="hover:opacity-60 link-animation flex flex-row items-center font-inter text-white text-base md:text-lg">
          <img className="w-8 h-8 leaderboard-image" src={imgSrc} alt="" />
          <p className="pl-4 truncate">
            {name?.startsWith("0x") && name.length === 42 ? (
              <span className="font-roboto">
                {"0x" + id.slice(2, 6)}
                <span className="font-inter">...</span>
                {id.slice(38, 42)}
              </span>
            ) : (
              name
            )}
          </p>
          {category && (
            <p className="px-2 py-1 ml-2 text-sm rounded-sm font-extralight text-blue-shipcove hidden md:block lg:hidden xl:block bg-blue-highlightbg">
              {category}
            </p>
          )}
          <p className="pl-2 truncate font-extralight text-blue-shipcove hidden md:block lg:hidden xl:block">
            {name?.startsWith("0x") && name.length === 42 ? "" : detail}
          </p>
          <p className="pl-4 whitespace-nowrap ml-auto font-roboto font-light">
            <CountUp
              start={0}
              end={weiToEth(fees)}
              preserveValue={true}
              separator=","
              decimals={2}
              duration={0.8}
            />{" "}
            <span className="text-blue-spindle font-extralight">ETH</span>
          </p>
        </div>
      </a>
      {adminToken !== undefined && (
        <div className="flex flex-row gap-4">
          <a
            className="text-pink-300 hover:opacity-60 hover:text-pink-300 cursor-pointer"
            onClick={onSetTwitterHandle}
            target="_blank"
            rel="noreferrer"
          >
            set handle
          </a>
          <a
            className="text-pink-300 hover:opacity-60 hover:text-pink-300 cursor-pointer"
            onClick={onSetName}
            target="_blank"
            rel="noreferrer"
          >
            set name
          </a>
          <a
            className="text-pink-300 hover:opacity-60 hover:text-pink-300 cursor-pointer"
            onClick={onSetCategory}
            target="_blank"
            rel="noreferrer"
          >
            set category
          </a>
        </div>
      )}
    </div>
  );
};

export type LeaderboardEntry = {
  fees: string;
  id: string;
  name: string;
  type?: "eth-transfers" | "bot" | "other" | "contract-creations";
  image: string | undefined;
  category: string | null;
};

const feePeriodToUpdateMap: Record<Timeframe, string> = {
  "5m": "leaderboard5m",
  "1h": "leaderboard1h",
  "24h": "leaderboard24h",
  "7d": "leaderboard7d",
  "30d": "leaderboard30d",
  all: "leaderboardAll",
};

type Timeframe = "5m" | "1h" | "24h" | "7d" | "30d" | "all";
const timeframes: Timeframe[] = ["5m", "1h", "24h", "7d", "30d", "all"];

const BurnLeaderboard: FC = () => {
  const [feePeriod, setFeePeriod] = useState<string>("24h");
  const onSetFeePeriod = useCallback(setFeePeriod, [setFeePeriod]);

  const { leaderboards } = useFeeData();
  const selectedLeaderboard: LeaderboardEntry[] | undefined =
    leaderboards && leaderboards[feePeriodToUpdateMap[feePeriod]];

  const LONDON_TIMESTAMP = Date.parse("Aug 5 2021 12:33:42 UTC");
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysSinceLondonFork = formatZeroDigit(
    Math.floor((Date.now() - LONDON_TIMESTAMP) / msPerDay)
  );

  return (
    <div className="bg-blue-tangaroa w-full rounded-lg p-8 h-full">
      <div className="flex flex-col justify-between items-start md:flex-row lg:flex-col xl:items-center xl:flex-row">
        <p className="font-inter font-light text-blue-spindle text-md mb-4 md:mb-0 lg:mb-4 xl:mb-0">
          <span className="uppercase">burn leaderboard</span>{" "}
          {feePeriod === "all" ? (
            <span className="text-blue-manatee font-normal text-sm fadein-animation pl-2">
              ({daysSinceLondonFork}d)
            </span>
          ) : (
            ""
          )}
        </p>
        <FeePeriodControl
          timeframes={timeframes}
          selectedTimeframe={feePeriod}
          onSetFeePeriod={onSetFeePeriod}
        />
      </div>
      {selectedLeaderboard === undefined ? (
        <p className="text-lg text-center text-gray-500 pt-16 pb-20">
          loading...
        </p>
      ) : (
        <div
          className="overflow-auto mt-4 leaderboard-scroller"
          style={{ height: "35.55rem" }}
        >
          <TransitionGroup
            component={null}
            appear={false}
            enter={true}
            exit={false}
          >
            {selectedLeaderboard.map((leaderboardRow) => (
              <CSSTransition
                classNames="fee-block"
                timeout={500}
                key={leaderboardRow.id}
              >
                <LeaderboardRow
                  key={leaderboardRow.name}
                  name={leaderboardRow.name.split(":")[0]}
                  detail={leaderboardRow.name.split(":")[1]}
                  id={leaderboardRow.id}
                  fees={Number(leaderboardRow.fees)}
                  type={leaderboardRow.type || "other"}
                  image={leaderboardRow.image}
                  category={leaderboardRow.category}
                />
              </CSSTransition>
            ))}
          </TransitionGroup>
        </div>
      )}
    </div>
  );
};

export default memo(BurnLeaderboard);
