import { FC, memo, useState, useCallback } from "react";
import CountUp from "react-countup";
import { weiToEth } from "../../utils/metric-utils";
import FeePeriodControl from "../FeePeriodControl";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useFeeData } from "../../api";
import * as Api from "../../api";
import { formatZeroDigit } from "../../format";
import BurnProfileTooltip from "./BurnProfileTooltip";

import styles from "./BurnLeaderboard.module.scss";

const getIsContractAddress = (address: unknown): boolean =>
  typeof address === "string" &&
  address.startsWith("0x") &&
  address.length === 42;

const getDescription = (entry: LeaderboardEntry): string => {
  if (entry.type === "eth-transfers") {
    return "ETH burned transfering ETH between accounts.";
  }

  if (entry.type === "contract-creations") {
    return "ETH burned creating new smart contracts.";
  }

  if (entry.type === "contract") {
    if (typeof entry.bio === "string") {
      return entry.bio;
    }

    if (entry.isBot) {
      return "A contract making many seemingly automated transactions.";
    }
  }

  return "Unknown contract.";
};

const getName = (entry: LeaderboardEntry): string => {
  if (entry.type === "contract") {
    const shortAddress =
      "0x" + entry.address.slice(2, 6) + "..." + entry.address.slice(38, 42);
    // Right now contract entries always have a name. In the future the API should only return names it has.
    if (typeof entry.name === "string") {
      return getIsContractAddress(entry.name)
        ? shortAddress
        : // We have the convention to sometimes add a ':' which Etherscan often does in naming, and display this part differently.
          entry.name.split(":")[0];
    }

    return shortAddress;
  }

  return entry.name;
};

const getDetail = (entry: LeaderboardEntry): string | undefined =>
  entry.type === "contract" && typeof entry.name === "string"
    ? entry.name.split(":")[1]
    : undefined;

const getImage = (entry: LeaderboardEntry): string =>
  entry.type === "eth-transfers"
    ? "/leaderboard-images/transfer-v2.svg"
    : entry.type === "contract-creations"
    ? "/leaderboard-images/contract-creations.svg"
    : typeof entry.image === "string"
    ? entry.image
    : entry.isBot
    ? "/leaderboard-images/bot-v2.svg"
    : "/leaderboard-images/question-mark-v2.svg";

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

type LeaderboardRowProps = {
  address: string | undefined;
  description: string;
  detail: string | undefined;
  fees: number;
  image: string | null;
  key: string;
  name: string;
  twitterFamFollowerCount: number;
  twitterFollowersCount: number;
  twitterHandle: string;
};

const LeaderboardRow: FC<LeaderboardRowProps> = ({
  address,
  description,
  detail,
  fees,
  image,
  key,
  name,
  twitterFamFollowerCount,
  twitterFollowersCount,
  twitterHandle,
}) => {
  const adminToken = getAdminToken();

  const onSetTwitterHandle = useCallback(() => {
    if (adminToken === undefined) {
      console.error("can't set twitter handle, admin token undefined");
      return;
    }
    const handle = window.prompt(`${name} twitter handle`);
    if (handle === null) {
      console.error("can't set null twitter handle");
      return;
    }
    Api.setContractTwitterHandle(adminToken, address, handle);
  }, [adminToken, address, name]);

  const onSetName = useCallback(() => {
    if (adminToken === undefined) {
      console.error("can't set name, admin token undefined");
      return;
    }
    const nameInput = window.prompt(`${name} name`);
    if (nameInput === null) {
      console.error("can't set null name");
      return;
    }
    Api.setContractName(adminToken, address, nameInput);
  }, [adminToken, address, name]);

  const onSetCategory = useCallback(() => {
    if (adminToken === undefined) {
      console.error("can't set category, admin token undefined");
      return;
    }
    const category = window.prompt(`${name} category`);
    if (category === null) {
      console.error("can't set null category");
      return;
    }
    Api.setContractCategory(adminToken, address, category);
  }, [adminToken, address, name]);

  return (
    <div className="pt-2.5 pb-2.5 pr-2.5 relative">
      <button>
        <div
          className={`flex flex-row items-center font-inter text-white text-base md:text-lg ${styles["leaderboard-row"]}`}
        >
          <BurnProfileTooltip
            key={key}
            item={{
              contractAddress:
                typeof address === "string"
                  ? `https://etherscan.io/address/${address}`
                  : undefined,
              name: name,
              contractImageUrl: image,
              twitterHandle,
              twitterFollowersCount,
              twitterFamFollowerCount,
              description,
            }}
          >
            <div className="flex flex-row items-center">
              <img
                className={`w-8 h-8 leaderboard-image link-animation ${styles["leaderboard-row__child-element"]}`}
                src={image}
                alt=""
              />
              <p
                className={`pl-4 truncate link-animation ${styles["leaderboard-row__child-element"]}`}
              >
                {name === undefined || getIsContractAddress(name) ? (
                  <span className="font-roboto"></span>
                ) : (
                  name || address
                )}
              </p>
              {detail && (
                <p
                  className={`pl-2 truncate font-extralight text-blue-shipcove hidden md:block lg:hidden xl:block link-animation ${styles["leaderboard-row__child-element"]}`}
                >
                  {detail}
                </p>
              )}
            </div>
          </BurnProfileTooltip>
          <p
            className={`pl-4 whitespace-nowrap ml-auto font-roboto font-light link-animation ${styles["leaderboard-row__child-element"]}`}
          >
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
      </button>
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

type ContractEntry = {
  address: string;
  bio: string | null;
  category: string | null;
  famFollowerCount: number | null;
  fees: number;
  followersCount: number | null;
  image: string | null;
  isBot: boolean;
  name: string | null;
  twitterHandle: string | null;
  type: "contract";
  /* deprecated */
  id: string;
};

type EthTransfersEntry = {
  fees: number;
  name: string;
  type: "eth-transfers";
  /* deprecated */
  id: string;
};

type ContractCreationsEntry = {
  fees: number;
  name: string;
  type: "contract-creations";
  /* deprecated */
  id: string;
};

// Name is undefined because we don't always know the name for a contract. Image is undefined because we don't always have an image for a contract. Address is undefined because base fees paid for ETH transfers are shared between many addresses.
export type LeaderboardEntry =
  | ContractEntry
  | EthTransfersEntry
  | ContractCreationsEntry;

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
            {selectedLeaderboard.map((entry) => (
              <CSSTransition
                classNames="fee-block"
                timeout={500}
                key={entry.id}
              >
                <LeaderboardRow
                  key={entry.type === "contract" ? entry.address : entry.name}
                  address={
                    entry.type === "contract" ? entry.address : undefined
                  }
                  name={getName(entry)}
                  detail={getDetail(entry)}
                  fees={Number(entry.fees)}
                  image={getImage(entry)}
                  description={getDescription(entry)}
                  twitterFamFollowerCount={
                    entry.type === "contract" &&
                    typeof entry.famFollowerCount === "number"
                      ? entry.famFollowerCount
                      : undefined
                  }
                  twitterFollowersCount={
                    entry.type === "contract" &&
                    typeof entry.followersCount === "number"
                      ? entry.followersCount
                      : undefined
                  }
                  twitterHandle={
                    entry.type === "contract" &&
                    typeof entry.twitterHandle === "string"
                      ? entry.twitterHandle
                      : undefined
                  }
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
