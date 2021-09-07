import { FC, memo, useState, useCallback } from "react";
import CountUp from "react-countup";
import imageIds from "../../assets/leaderboard-image-ids.json";
import { weiToEth } from "../../utils/metric-utils";
import FeePeriodControl, { Timeframe } from "../FeePeriodControl";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useFeeData } from "../../api";

type LeaderboardRowProps = {
  detail?: string;
  fees: number;
  id: string;
  name?: string;
  type: LeaderboardEntry["type"];
};

const LeaderboardRow: FC<LeaderboardRowProps> = ({
  detail,
  fees,
  id,
  name,
  type,
}) => {
  const imgSrc =
    type === "eth-transfers"
      ? "/leaderboard-images/transfer.svg"
      : type === "bot"
      ? "/leaderboard-images/bot.svg"
      : imageIds.includes(id)
      ? `/leaderboard-images/${id}.png`
      : "/leaderboard-images/question-mark.svg";

  return (
    <div className="pt-5 md:pt-6">
      <a
        href={id.startsWith("0x") ? `https://etherscan.io/address/${id}` : ""}
        target="_blank"
        rel="noreferrer"
      >
        <div className="hover:opacity-60 leaderboard-link flex flex-row items-center font-inter text-white text-base md:text-lg">
          <img className="w-8 h-8 leaderboard-image" src={imgSrc} alt="" />
          <p className="pl-4 truncate">
            {name || <span className="font-roboto">{id}</span>}
          </p>
          <p className="pl-2 truncate font-extralight text-blue-shipcove hidden md:block lg:hidden xl:block">
            {detail}
          </p>
          <p className="pl-4 whitespace-nowrap ml-auto font-roboto font-light">
            <CountUp
              start={0}
              end={weiToEth(fees)}
              preserveValue={true}
              separator=","
              decimals={2}
              duration={1}
            />{" "}
            <span className="text-blue-spindle font-extralight">ETH</span>
          </p>
        </div>
      </a>
    </div>
  );
};

type LeaderboardEntry = {
  fees: string;
  id: string;
  name: string;
  type?: "eth-transfers" | "bot" | "other";
};

type LeaderboardUpdate = {
  number: number;
  leaderboard1h: LeaderboardEntry[];
  leaderboard24h: LeaderboardEntry[];
  leaderboard7d: LeaderboardEntry[];
  leaderboard30d: LeaderboardEntry[];
  leaderboardAll: LeaderboardEntry[];
};

const feePeriodToUpdateMap: Record<Timeframe, string> = {
  t1h: "leaderboard1h",
  t24h: "leaderboard24h",
  t7d: "leaderboard7d",
  t30d: "leaderboard30d",
  tAll: "leaderboardAll",
};

const BurnLeaderboard: FC = () => {
  const [feePeriod, setFeePeriod] = useState<Timeframe>("t24h");
  const onSetFeePeriod = useCallback(setFeePeriod, [setFeePeriod]);

  const { leaderboards } = useFeeData();
  const selectedLeaderboard: LeaderboardEntry[] | undefined =
    leaderboards && leaderboards[feePeriodToUpdateMap[feePeriod]];

  return (
    <div className="bg-blue-tangaroa w-full rounded-lg p-8 h-full">
      <div className="flex flex-col justify-between items-start md:flex-row lg:flex-col xl:items-center xl:flex-row">
        <p className="font-inter font-light uppercase text-blue-spindle text-md mb-4 md:mb-0 lg:mb-4 xl:mb-0">
          burn leaderboard
        </p>
        <FeePeriodControl
          timeframe={feePeriod}
          onSetFeePeriod={onSetFeePeriod}
        />
      </div>
      {selectedLeaderboard === undefined ? (
        <p className="text-lg text-center text-gray-500 pt-16 pb-20">
          loading...
        </p>
      ) : (
        <TransitionGroup
          component={null}
          appear={false}
          enter={true}
          exit={false}
        >
          {selectedLeaderboard.slice(0, 10).map((leaderboardRow) => (
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
              />
            </CSSTransition>
          ))}
        </TransitionGroup>
      )}
    </div>
  );
};

export default memo(BurnLeaderboard);
