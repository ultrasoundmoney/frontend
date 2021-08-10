import { FC, memo, useState, useCallback } from "react";
import CountUp from "react-countup";
import imageIds from "../../assets/leaderboard-image-ids.json";
import { weiToEth } from "../../utils/metric-utils";
import { useActiveBreakpoint } from "../../utils/use-active-breakpoint";
import useSWR from "swr";
import FeePeriodControl, { Timeframe } from "../fee-period-control";

const botContracts = ["0xbf0c5d82748ed81b5794e59055725579911e3e4e"];
const botContractMap = new Set(botContracts);

// Ideally we solve this with etags instead. Can be removed once covid punks have left the leaderboard.
const bustcacheAlts = {
  // Covid Punks
  "0xe4cfae3aa41115cb94cff39bb5dbae8bd0ea9d41":
    "/leaderboard-images/0xe4cfae3aa41115cb94cff39bb5dbae8bd0ea9d41-alt.png",
};

const FeeUser: FC<{
  name?: string;
  detail?: string;
  address?: string;
  fees: number;
  id: string;
}> = ({ address, detail, name, fees, id }) => {
  const isBot = botContractMap.has(address);
  const imgSrc = isBot
    ? "/leaderboard-images/bot.svg"
    : bustcacheAlts[id] !== undefined
    ? bustcacheAlts[id]
    : imageIds.includes(id)
    ? `/leaderboard-images/${id}.png`
    : "/leaderboard-images/question-mark.png";

  return (
    <div className="flex flex-row pt-5 md:pt-6 justify-between items-center hover:opacity-80">
      <div className="flex flex-row items-center overflow-hidden">
        <img
          className="w-8 h-8 flex-shrink-0 leaderboard-image"
          src={imgSrc}
          alt=""
        />
        <p className="font-inter text-white pl-4 whitespace-nowrap text-base md:text-lg">
          {name || address}
        </p>
        <p className="font-inter font-extralight text-blue-shipcove pl-2 whitespace-nowrap truncate text-base md:text-lg">
          {detail}
        </p>
      </div>
      <p className="font-roboto font-light text-white pl-4 whitespace-nowrap text-base md:text-lg">
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
  );
};

type FeeUser = {
  name: string | undefined;
  detail: string | undefined;
  address: string | undefined;
  image: string | undefined;
  fees: number;
};

type FeeBurner = { fees: string; id: string; name: string };
type LeaderboardUpdate = {
  number: number;
  leaderboard1h: FeeBurner[];
  leaderboard24h: FeeBurner[];
  leaderboard7d: FeeBurner[];
  leaderboard30d: FeeBurner[];
  leaderboardAll: FeeBurner[];
};

const feePeriodToUpdateMap: Record<Timeframe, string> = {
  t1h: "leaderboard1h",
  t24h: "leaderboard24h",
  t7d: "leaderboard7d",
  t30d: "leaderboard30d",
  tAll: "leaderboardAll",
};

const useLeaderboard = () => {
  const { data, error } = useSWR<LeaderboardUpdate>(
    `https://api.ultrasound.money/fees/burn-leaderboard`,
    { refreshInterval: 8000 }
  );

  return {
    leaderboard: {
      leaderboard1h: data?.leaderboard1h,
      leaderboard24h: data?.leaderboard24h,
      leaderboard7d: data?.leaderboard7d,
      leaderboard30d: data?.leaderboard30d,
      leaderboardAll: data?.leaderboardAll,
    },
    isLoading: !error && !data,
    isError: error,
  };
};

const BurnLeaderboard: FC = () => {
  const [feePeriod, setFeePeriod] = useState<Timeframe>("t24h");
  const onSetFeePeriod = useCallback(setFeePeriod, [setFeePeriod]);

  const { leaderboard } = useLeaderboard();
  const selectedLeaderboard: FeeBurner[] | undefined =
    leaderboard && leaderboard[feePeriodToUpdateMap[feePeriod]];

  const { md, lg } = useActiveBreakpoint();

  const balancePadding = lg ? "4.2rem" : md ? "3.5rem" : undefined;

  return (
    <div
      style={{
        paddingBottom: balancePadding,
      }}
      className="bg-blue-tangaroa w-full rounded-lg p-8"
    >
      <h2 className="font-inter font-light text-blue-shipcove text-xl mb-4 md:text-xl">
        burn leaderboard
      </h2>
      <FeePeriodControl timeframe={feePeriod} onSetFeePeriod={onSetFeePeriod} />
      {selectedLeaderboard === undefined ? (
        <p className="text-lg text-center text-gray-500 pt-16 pb-20">
          loading...
        </p>
      ) : (
        selectedLeaderboard
          .slice(0, 10)
          .map((feeUser) => (
            <FeeUser
              key={feeUser.name}
              name={feeUser.name.split(":")[0]}
              detail={feeUser.name.split(":")[1]}
              id={feeUser.id}
              fees={Number(feeUser.fees)}
            />
          ))
      )}
    </div>
  );
};

export default memo(BurnLeaderboard);
