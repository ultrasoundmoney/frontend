import { FC, useCallback } from "react";
import CountUp from "react-countup";
import { LeaderboardEntry } from ".";
import * as Api from "../../api";
import imageIds from "../../assets/leaderboard-image-ids.json";
import { featureFlags } from "../../feature-flags";
import { weiToEth } from "../../utils/metric-utils";
import { Unit } from "../ComingSoon";

type Props = {
  category: string | null;
  detail?: string;
  fees: number;
  id: string;
  image: string | undefined;
  isBot: boolean;
  name?: string;
  type: LeaderboardEntry["type"];
  unit: Unit;
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

const LeaderboardRow: FC<Props> = ({
  category,
  detail,
  fees,
  id,
  image,
  isBot,
  name,
  type,
  unit,
}) => {
  const imgSrc =
    typeof image === "string"
      ? image
      : type === "eth-transfers"
      ? "/leaderboard-images/transfer-v2.svg"
      : isBot
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

  // custom text for contract creations
  if (type === "contract-creations") {
    name = "new contracts";
  }

  //Your handler Component
  const onImageError = useCallback((e) => {
    e.target.src = "/leaderboard-images/question-mark-v2.svg";
  }, []);

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
          <img
            className="w-8 h-8 leaderboard-image"
            src={imgSrc}
            alt=""
            onError={onImageError}
          />
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
          {featureFlags.leaderboardCategory && category && (
            <p className="px-1.5 py-0.5 ml-2 text-sm rounded-sm text-blue-manatee font-normal hidden md:block lg:hidden xl:block bg-blue-highlightbg">
              {category}
            </p>
          )}
          <p className="pl-2 truncate font-extralight text-blue-shipcove hidden md:block lg:hidden xl:block">
            {name?.startsWith("0x") && name.length === 42 ? "" : detail}
          </p>
          <p className="pl-4 whitespace-nowrap ml-auto font-roboto font-light">
            <CountUp
              start={0}
              end={unit === "eth" ? weiToEth(fees) : fees / 1000}
              preserveValue={true}
              separator=","
              decimals={unit === "eth" ? 2 : 1}
              duration={0.8}
              suffix={unit === "eth" ? undefined : "K"}
            />
            <span className="font-inter">&thinsp;</span>
            <span className="text-blue-spindle font-extralight">
              {unit === "eth" ? "ETH" : "USD"}
            </span>
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

export default LeaderboardRow;
