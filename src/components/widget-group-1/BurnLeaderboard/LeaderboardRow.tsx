import * as DateFns from "date-fns";
import { FC, ReactEventHandler, useCallback } from "react";
import Skeleton from "react-loading-skeleton";
import { useAdminToken } from "../../../admin";
import {
  Category,
  categoryDisplayMap,
  getIsKnownCategory,
} from "../../../api/burn_categories";
import * as Contracts from "../../../api/contracts";
import { LeaderboardEntry } from "../../../api/leaderboards";
import { Unit } from "../../../denomination";
import { FeatureFlags } from "../../../feature-flags";
import { AnimatedAmount } from "../../Amount";
import { AmountUnitSpace } from "../../Spacing";

const onSetTwitterHandle = async (
  address: string,
  token: string | undefined,
) => {
  const handle = window.prompt(`input twitter handle`);
  if (handle === null) {
    return;
  }
  await Contracts.setContractTwitterHandle(address, handle, token);
};

const onSetName = async (address: string, token: string | undefined) => {
  const nameInput = window.prompt(`input name`);
  if (nameInput === null) {
    return;
  }
  await Contracts.setContractName(address, nameInput, token);
};

const onSetCategory = async (address: string, token: string | undefined) => {
  const category = window.prompt(`input category`);
  if (category === null) {
    return;
  }
  await Contracts.setContractCategory(address, category, token);
};

const getOpacityFromAge = (dt: Date | undefined) =>
  dt === undefined
    ? 1
    : Math.min(
        1,
        0.2 + (0.8 / 168) * DateFns.differenceInHours(new Date(), dt),
      );

const AdminControls: FC<{
  address: string;
  freshness: Contracts.MetadataFreshness | undefined;
}> = ({ address, freshness }) => {
  const adminToken = useAdminToken();

  return (
    <>
      <div className="flex flex-row gap-4">
        <a
          className="text-pink-300 hover:opacity-60 hover:text-pink-300 cursor-pointer"
          onClick={() => onSetTwitterHandle(address, adminToken)}
          target="_blank"
          rel="noreferrer"
        >
          set handle
        </a>
        <a
          className="text-pink-300 hover:opacity-60 hover:text-pink-300 cursor-pointer"
          onClick={() => onSetName(address, adminToken)}
          target="_blank"
          rel="noreferrer"
        >
          set name
        </a>
        <a
          className="text-pink-300 hover:opacity-60 hover:text-pink-300 cursor-pointer"
          onClick={() => onSetCategory(address, adminToken)}
          target="_blank"
          rel="noreferrer"
        >
          set category
        </a>
        <a
          className="text-pink-300 hover:opacity-60 hover:text-pink-300 cursor-pointer"
          onClick={() =>
            Contracts.setContractLastManuallyVerified(address, adminToken)
          }
          target="_blank"
          rel="noreferrer"
        >
          set verified
        </a>
      </div>
      <div className="flex text-sm text-white gap-x-4 mt-2">
        <span
          className="bg-gray-700 rounded-lg py-1 px-2"
          style={{
            opacity: getOpacityFromAge(freshness?.openseaContractLastFetch),
          }}
        >
          {freshness?.openseaContractLastFetch === undefined
            ? "never fetched"
            : `opensea fetch ${DateFns.formatDistanceToNowStrict(
                freshness.openseaContractLastFetch,
              )} ago`}
        </span>
        <span
          className="bg-gray-700 rounded-lg py-1 px-2"
          style={{
            opacity: getOpacityFromAge(freshness?.lastManuallyVerified),
          }}
        >
          {freshness?.lastManuallyVerified === undefined
            ? "never verified"
            : `last verified ${DateFns.formatDistanceToNowStrict(
                freshness.lastManuallyVerified,
              )} ago`}
        </span>
      </div>
    </>
  );
};

type Props = {
  address?: string;
  adminToken?: string;
  category?: Category | string | undefined;
  detail?: string;
  fees: number | undefined;
  freshness?: Contracts.MetadataFreshness;
  featureFlags: FeatureFlags;
  image?: string | undefined;
  isBot?: boolean | undefined;
  name: string | undefined;
  type: LeaderboardEntry["type"] | undefined;
  unit: Unit;
};

const LeaderboardRow: FC<Props> = ({
  address,
  adminToken,
  category,
  detail,
  featureFlags,
  fees,
  freshness,
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

  //Your handler Component
  const onImageError = useCallback<ReactEventHandler<HTMLImageElement>>((e) => {
    (e.target as HTMLImageElement).src =
      "/leaderboard-images/question-mark-v2.svg";
  }, []);

  return (
    <>
      <div className="pt-2.5 pb-2.5 pr-2.5">
        <a
          href={
            address === undefined
              ? undefined
              : `https://etherscan.io/address/${address}`
          }
          target="_blank"
          rel="noreferrer"
        >
          <div
            className={`
              hover:opacity-60 link-animation
              flex flex-row items-center
              font-inter font-light
              text-white text-base md:text-lg
            `}
          >
            <img
              className="w-8 h-8 rounded-full"
              src={imgSrc}
              alt=""
              onError={onImageError}
              width="32"
              height="32"
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
            <p
              className={`
                px-1.5 py-0.5 ml-2
                text-sm text-blue-manatee
                font-normal
                bg-blue-highlightbg
                rounded-sm
                whitespace-nowrap
                hidden md:block
                ${category ? "block" : "md:hidden"}
              `}
            >
              {featureFlags.showCategorySlugs
                ? category
                : getIsKnownCategory(category)
                ? categoryDisplayMap[category]
                : category}
            </p>
            {detail && (
              <p className="pl-2 truncate font-extralight text-blue-shipcove hidden md:block lg:hidden xl:block">
                {detail}
              </p>
            )}
            <p className="pl-4 whitespace-nowrap ml-auto font-roboto font-light">
              {fees === undefined ? (
                <Skeleton inline={true} width="4rem" />
              ) : (
                <AnimatedAmount unit={unit}>{fees}</AnimatedAmount>
              )}
              <AmountUnitSpace />
              <span className="text-blue-spindle font-extralight">
                {unit === "eth" ? "ETH" : "USD"}
              </span>
            </p>
          </div>
        </a>
        {adminToken !== undefined && address !== undefined && (
          <AdminControls address={address} freshness={freshness} />
        )}
      </div>
    </>
  );
};

export default LeaderboardRow;
