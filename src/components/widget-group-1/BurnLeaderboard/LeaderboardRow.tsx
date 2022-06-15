import { FC, ReactEventHandler, useCallback, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import {
  Category,
  categoryDisplayMap,
  getIsKnownCategory,
} from "../../../api/burn-categories";
import * as Contracts from "../../../api/contracts";
import { LeaderboardEntry } from "../../../api/leaderboards";
import { Unit } from "../../../denomination";
import { FeatureFlagsContext } from "../../../feature-flags";
import * as Format from "../../../format";
import { MoneyAmountAnimated } from "../../Amount";
import AdminControls from "./AdminControls";

type Props = {
  address?: string;
  adminToken?: string;
  category?: Category | string | undefined;
  detail?: string;
  fees: number | undefined;
  freshness?: Contracts.MetadataFreshness;
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
  fees,
  freshness,
  image,
  isBot,
  name,
  type,
  unit,
}) => {
  const { showCategorySlugs, showMetadataTools } =
    useContext(FeatureFlagsContext);
  const imgSrc =
    typeof image === "string"
      ? image
      : type === "eth-transfers"
      ? "/leaderboard-images/transfer-v2.svg"
      : isBot
      ? "/leaderboard-images/bot-v2.svg"
      : type === "contract-creations"
      ? "/leaderboard-images/contract-creations.svg"
      : undefined;

  const isDoneLoading = type !== undefined;

  //Your handler Component
  const onImageError = useCallback<ReactEventHandler<HTMLImageElement>>((e) => {
    (e.target as HTMLImageElement).src =
      "/leaderboard-images/question-mark-v2.svg";
  }, []);

  const { previewSkeletons } = useContext(FeatureFlagsContext);

  return (
    <>
      <div className="pt-2.5 pb-2.5 pr-2">
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
              hover:opacity-60
              flex flex-row items-center
              font-inter font-light
              text-white text-base md:text-lg
            `}
          >
            {(imgSrc === undefined && !isDoneLoading) || previewSkeletons ? (
              <div className="leading-4">
                <Skeleton circle height="32px" width="32px" />
              </div>
            ) : (
              <img
                className="w-8 h-8 rounded-full select-none"
                src={imgSrc ?? "/leaderboard-images/question-mark-v2.svg"}
                alt=""
                onError={onImageError}
              />
            )}
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
              {showCategorySlugs
                ? category
                : getIsKnownCategory(category)
                ? categoryDisplayMap[category]
                : Format.capitalize(category)}
            </p>
            {detail && (
              <p className="pl-2 truncate font-extralight text-blue-shipcove hidden md:block lg:hidden xl:block">
                {detail}
              </p>
            )}
            <p className="pl-4 whitespace-nowrap ml-auto">
              {fees === undefined ? (
                <Skeleton inline={true} width="4rem" />
              ) : (
                <MoneyAmountAnimated
                  unit={unit}
                  unitText={unit === "eth" ? "ETH" : "USD"}
                >
                  {fees}
                </MoneyAmountAnimated>
              )}
            </p>
          </div>
        </a>
        {adminToken !== undefined &&
          address !== undefined &&
          showMetadataTools && (
            <AdminControls address={address} freshness={freshness} />
          )}
      </div>
    </>
  );
};

export default LeaderboardRow;
