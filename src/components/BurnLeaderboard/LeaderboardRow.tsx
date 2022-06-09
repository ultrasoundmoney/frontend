import { FC, useCallback } from "react";
import CountUp from "react-countup";
import Skeleton from "react-loading-skeleton";
import { LeaderboardEntry } from ".";
import * as Api from "../../api";
import { featureFlags } from "../../feature-flags";
import * as Format from "../../format";
import { Unit } from "../ComingSoon/CurrencyControl";
import { AmountUnitSpace } from "../Spacing";

const getAdminToken = (): string | undefined => {
  if (typeof window === "undefined") {
    return undefined;
  }

  const urlSearchParams = new URLSearchParams(window.location.search);
  const adminToken = urlSearchParams.get("admin-token");

  if (typeof adminToken !== "string" || adminToken.length === 0) {
    return undefined;
  }

  return adminToken;
};

const onSetTwitterHandle = (adminToken: string, address: string) => {
  const handle = window.prompt(`input twitter handle`);
  if (handle === null) {
    return;
  }
  Api.setContractTwitterHandle(adminToken, address, handle);
};

const onSetName = (adminToken: string, address: string) => {
  const nameInput = window.prompt(`input name`);
  if (nameInput === null) {
    return;
  }
  Api.setContractName(adminToken, address, nameInput);
};

const onSetCategory = (adminToken: string, address: string) => {
  const category = window.prompt(`input category`);
  if (category === null) {
    return;
  }
  Api.setContractCategory(adminToken, address, category);
};

const AdminControls: FC<{ adminToken: string; address: string }> = ({
  adminToken,
  address,
}) => (
  <div className="flex flex-row gap-4">
    <a
      className="text-pink-300 hover:opacity-60 hover:text-pink-300 cursor-pointer"
      onClick={() => onSetTwitterHandle(adminToken, address)}
      target="_blank"
      rel="noreferrer"
    >
      set handle
    </a>
    <a
      className="text-pink-300 hover:opacity-60 hover:text-pink-300 cursor-pointer"
      onClick={() => onSetName(adminToken, address)}
      target="_blank"
      rel="noreferrer"
    >
      set name
    </a>
    <a
      className="text-pink-300 hover:opacity-60 hover:text-pink-300 cursor-pointer"
      onClick={() => onSetCategory(adminToken, address)}
      target="_blank"
      rel="noreferrer"
    >
      set category
    </a>
  </div>
);

type Props = {
  address?: string;
  category?: string | undefined;
  detail?: string;
  fees: number | undefined;
  image?: string | undefined;
  isBot?: boolean | undefined;
  name: string | undefined;
  type: LeaderboardEntry["type"] | undefined;
  unit: Unit;
};

const LeaderboardRow: FC<Props> = ({
  address,
  category,
  detail,
  fees,
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
      : "/leaderboard-images/question-mark-v2.svg";

  const adminToken = getAdminToken();

  //Your handler Component
  const onImageError = useCallback((e) => {
    e.target.src = "/leaderboard-images/question-mark-v2.svg";
  }, []);

  return (
    <div className="pt-2.5 pb-2.5 pr-2.5">
      <a
        href={
          typeof address !== undefined
            ? `https://etherscan.io/address/${address}`
            : undefined
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
            {typeof name === "string" ? (
              name
            ) : typeof address === "string" ? (
              <span className="font-roboto">
                {"0x" + address.slice(2, 6)}
                <span className="font-inter">...</span>
                {address.slice(38, 42)}
              </span>
            ) : (
              <Skeleton inline={true} width="12rem" />
            )}
          </p>
          {featureFlags.leaderboardCategory && category && (
            <p className="px-1.5 py-0.5 ml-2 text-sm rounded-sm text-blue-manatee font-normal hidden md:block lg:hidden xl:block bg-blue-highlightbg">
              {category}
            </p>
          )}
          {detail && (
            <p className="pl-2 truncate font-extralight text-blue-shipcove hidden md:block lg:hidden xl:block">
              {detail}
            </p>
          )}
          <p className="pl-4 whitespace-nowrap ml-auto font-roboto font-light">
            {fees === undefined ? (
              <Skeleton inline={true} width="4rem" />
            ) : (
              <CountUp
                start={0}
                end={unit === "eth" ? Format.ethFromWei(fees) : fees / 1000}
                preserveValue={true}
                separator=","
                decimals={unit === "eth" ? 2 : 1}
                duration={0.8}
                suffix={unit === "eth" ? undefined : "K"}
              />
            )}
            <AmountUnitSpace />
            <span className="text-blue-spindle font-extralight">
              {unit === "eth" ? "ETH" : "USD"}
            </span>
          </p>
        </div>
      </a>
      {adminToken !== undefined && address !== undefined && (
        <AdminControls address={address} adminToken={adminToken} />
      )}
    </div>
  );
};

export default LeaderboardRow;
