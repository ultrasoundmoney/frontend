import { FC, memo, useState, useRef, useMemo } from "react";
import useWebSocket from "react-use-websocket";
import CountUp from "react-countup";
import _ from "lodash";
import imageIds from "../../assets/leaderboard-image-ids.json";

type FeePeriod = "24h" | "7d" | "30d" | "all";

const FeeUser: FC<{
  name?: string;
  detail?: string;
  address?: string;
  fees: number;
  id: string;
}> = ({ address, detail, name, fees, id }) => (
  <div className="flex flex-row pt-6 md:pt-6 justify-between items-center hover:opacity-80">
    <div className="flex flex-row items-center overflow-hidden">
      {imageIds.includes(id) ? (
        <img
          className="w-8 h-8 flex-shrink-0 leaderboard-image"
          src={`/leaderboard-images/${id}.png`}
          alt=""
        />
      ) : (
        <div className="p-4"></div>
      )}
      <p className="font-roboto text-sm text-white pl-4 truncate md:text-lg">
        {name || address} <span className="text-blue-shipcove">{detail}</span>
      </p>
    </div>
    <p className="font-roboto font-light text-sm text-white ml-8 whitespace-nowrap md:text-lg">
      <CountUp
        start={0}
        end={fees / 10000000} // TEMP HACK ASSUMING 10 Gwei base gas price
        preserveValue={true}
        separator=","
        decimals={2}
        duration={1}
      />{" "}
      <span className="text-blue-manatee">ETH</span>
    </p>
  </div>
);

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
  leaderboard24h: FeeBurner[];
  leaderboard7d: FeeBurner[];
  leaderboard30d: FeeBurner[];
  leaderboardAll: FeeBurner[];
  type: "leaderboard-update";
};

const feePeriodToUpdateMap: Record<FeePeriod, string> = {
  "24h": "leaderboard24h",
  "7d": "leaderboard7d",
  "30d": "leaderboard30d",
  all: "leaderboardAll",
};
const BurnLeaderboard: FC = () => {
  const [feePeriod, setFeePeriod] = useState<FeePeriod>("24h");

  const { lastJsonMessage } = useWebSocket(
    "ws://api.ultrasound.money/fees/base-fee-feed",
    {
      share: true,
      filter: (message) =>
        JSON.parse(message.data).type === "leaderboard-update",
      retryOnError: true,
      shouldReconnect: () => true,
    }
  );
  const messageHistory = useRef<LeaderboardUpdate[]>([]);

  messageHistory.current = useMemo(() => {
    // Initially the message is null. We don't need that one.
    if (lastJsonMessage === null) {
      return messageHistory.current;
    }

    // Sometimes the hook calls us with a message that passes the memo check, yet contains the same values, extra guard here.
    if (
      !_.isEmpty(messageHistory.current) &&
      _.last(messageHistory.current).number === lastJsonMessage.number
    ) {
      return messageHistory.current;
    }

    return [...messageHistory.current, lastJsonMessage];
  }, [lastJsonMessage]);

  const leaderboard = _.last(messageHistory.current);
  const selectedLeaderboard: FeeBurner[] | undefined =
    leaderboard && leaderboard[feePeriodToUpdateMap[feePeriod]];

  const activeFeePeriodClasses =
    "text-white border-blue-highlightborder rounded-sm bg-blue-highlightbg";
  return (
    <div className="bg-blue-tangaroa w-full rounded-lg p-8">
      <h2 className="font-inter font-light text-white text-xl mb-4 md:text-xl">
        burn leaderboard
      </h2>
      <div className="flex flex-row items-center mx-auto mb-4 md:m-0">
        <button
          className={`font-inter text-sm px-4 py-1 border border-transparent ${
            feePeriod === "24h" ? activeFeePeriodClasses : "text-blue-manatee "
          }`}
          onClick={() => setFeePeriod("24h")}
        >
          24h
        </button>
        <button
          className={`font-inter text-sm px-4 py-1 border border-transparent ${
            feePeriod === "7d" ? activeFeePeriodClasses : "text-blue-manatee"
          }`}
          onClick={() => setFeePeriod("7d")}
        >
          7d
        </button>
        <button
          className={`font-inter text-sm px-4 py-1 border border-transparent ${
            feePeriod === "30d" ? activeFeePeriodClasses : "text-blue-manatee"
          }`}
          onClick={() => setFeePeriod("30d")}
        >
          30d
        </button>
        <button
          className={`font-inter text-sm px-4 py-1 border border-transparent ${
            feePeriod === "all" ? activeFeePeriodClasses : "text-blue-manatee"
          }`}
          onClick={() => setFeePeriod("all")}
        >
          all
        </button>
      </div>
      {selectedLeaderboard === undefined ? (
        <p className="text-lg text-center text-gray-500 pt-16 pb-20">
          loading...
        </p>
      ) : (
        selectedLeaderboard
          .slice(0, 8)
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
