import { FC, RefObject, useCallback, useState } from "react";
import { usePopper } from "react-popper";
import { famBasePath, FamProfile } from "../../api/fam";
import { formatNoDigit } from "../../format";
import { useActiveBreakpoint } from "../../utils/use-active-breakpoint";
import ImageWithTooltip from "../ImageWithTooltip";
import Modal from "../Modal";
import SpanMoji from "../SpanMoji";
import Tooltip from "../Tooltip";
import styles from "./FollowingYou.module.scss";

type Empty = { type: "empty" };
type FollowedBy = {
  type: "followers";
  count: number;
  followers: FamProfile[];
};
type HandleNotFound = { type: "handleNotFound" };
type Searching = { type: "searching" };
type UnknownError = { type: "unknownError" };

type FollowedByResult =
  | FollowedBy
  | HandleNotFound
  | Empty
  | Searching
  | UnknownError;

export const useTooltip = () => {
  const { md } = useActiveBreakpoint();

  // Tooltip logic to be abstracted
  // Popper Tooltip
  const [refEl, setRefEl] = useState<HTMLImageElement | null>(null);
  const [popperEl, setPopperEl] = useState<HTMLDivElement | null>(null);
  const { styles, attributes } = usePopper(refEl, popperEl, {
    placement: "right",
    modifiers: [
      {
        name: "flip",
      },
    ],
  });
  const [selectedEntry, setSelectedEntry] = useState<FamProfile>();
  const [showTooltip, setShowTooltip] = useState(false);
  const [showTimer, setShowTimer] = useState<number>();
  const [hideTimer, setHideTimer] = useState<number>();

  const handleImageMouseEnter = useCallback(
    (entry: FamProfile, ref: RefObject<HTMLImageElement>) => {
      // The ranking data isn't there yet so no tooltip can be shown.
      if (entry === undefined) {
        return;
      }

      // If we were waiting to hide, we're hovering again, so leave the tooltip open.
      window.clearTimeout(hideTimer);

      const id = window.setTimeout(() => {
        setRefEl(ref.current);
        setSelectedEntry(entry);
        setShowTooltip(true);
      }, 300);
      setShowTimer(id);

      return () => window.clearTimeout(id);
    },
    [hideTimer],
  );

  const handleImageMouseLeave = useCallback(() => {
    // If we were waiting to show, we stopped hovering, so stop waiting and don't show any tooltip.
    window.clearTimeout(showTimer);

    // If we never made it past waiting and opened the tooltip, there is nothing to hide.
    if (selectedEntry === undefined) {
      return;
    }

    // Hide the tooltip after a small delay.
    const id = window.setTimeout(() => {
      setShowTooltip(false);
      setSelectedEntry(undefined);
    }, 300);
    setHideTimer(id);

    return () => window.clearTimeout(id);
  }, [setHideTimer, showTimer, selectedEntry]);

  const handleTooltipEnter = useCallback(() => {
    // If we were waiting to hide, we're hovering again, so leave the tooltip open.
    window.clearTimeout(hideTimer);
  }, [hideTimer]);

  const handleTooltipLeave = useCallback(() => {
    const id = window.setTimeout(() => {
      setShowTooltip(false);
      setSelectedEntry(undefined);
    }, 100);
    setHideTimer(id);

    return () => window.clearTimeout(id);
  }, []);

  const handleClickImage = useCallback(
    (ranking: FamProfile | undefined) => {
      if (md) {
        return;
      }

      setSelectedEntry(ranking);
    },
    [md, setSelectedEntry],
  );

  return {
    attributes,
    handleClickImage,
    handleImageMouseEnter,
    handleImageMouseLeave,
    handleTooltipEnter,
    handleTooltipLeave,
    selectedEntry,
    setPopperEl,
    setSelectedEntry,
    showTooltip,
    popperStyles: styles,
  };
};

const FollowingYou: FC = () => {
  const { md } = useActiveBreakpoint();
  const [handle, setHandle] = useState<string>("");
  const [followers, setFollowers] = useState<FollowedByResult>({
    type: "empty",
  });
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    setFollowers({ type: "searching" });

    const cleanHandle = handle.startsWith("@") ? handle.slice(1) : handle;

    const res = await fetch(`${famBasePath}/${cleanHandle}/followed-by`);

    if (res.status === 404) {
      setFollowers({ type: "handleNotFound" });
      return;
    }

    if (res.status === 200) {
      const body = (await res.json()) as {
        followers: FamProfile[];
        count: number;
      };
      // Somehow clicking show me rapidly can have res 200, but still have body
      // be undefined on mobile.
      if (body.followers !== undefined) {
        setFollowers({
          type: "followers",
          count: body.count,
          followers: body.followers,
        });
        return;
      }
    }

    setFollowers({ type: "unknownError" });
  };

  const {
    attributes,
    handleClickImage,
    handleTooltipEnter,
    handleTooltipLeave,
    handleImageMouseLeave,
    handleImageMouseEnter,
    selectedEntry,
    setPopperEl,
    setSelectedEntry,
    showTooltip,
    popperStyles,
  } = useTooltip();

  return (
    <>
      <div className="flex justify-center items-center">
        <h2
          className={`
            flex items-center
            font-inter font-light
            text-white text-center text-2xl md:text-3xl xl:text-41xl
            mb-6
          `}
        >
          me & the fam
          <SpanMoji imageClassName="h-[30px] ml-2" emoji="👀" />
        </h2>
      </div>
      <p
        className={`text-blue-shipcove leading-6 md:leading-none text-center font-light text-base lg:text-lg mb-16`}
      >
        do we know each other? find out how many of us follow you.
      </p>
      <form className="flex justify-center" onSubmit={handleSubmit}>
        <input
          className="md:w-96 p-4 pr-32 bg-transparent border border-gray-500 rounded-full text-xs text-white"
          type="text"
          placeholder="@vitalikbuterin"
          value={handle}
          spellCheck="false"
          onChange={(event) => setHandle(event.target.value)}
        />
        <button
          className={`
            ${styles.showMe}
            md:w-32 -ml-28 px-5
            text-xs text-white
            border border-white
            bg-transparent hover:bg-gray-700
            rounded-full
            select-none
          `}
          type="submit"
        >
          show me →
        </button>
      </form>
      {followers.type === "empty" ? null : followers.type ===
        "handleNotFound" ? (
        <p className="text-white text-xl p-8 text-center">handle not found</p>
      ) : followers.type === "searching" ? (
        <p className="text-white text-xl p-8 text-center">searching...</p>
      ) : followers.type === "unknownError" ? (
        <p className="text-white text-xl p-8 text-center">
          error fetching followers
        </p>
      ) : followers.type === "followers" ? (
        <div className="my-8">
          {followers.count === 0 ? (
            <p className="text-white text-xl p-8 text-center">
              no fam followers found
            </p>
          ) : (
            <>
              <div className="flex flex-wrap justify-center">
                {followers.followers.map((profile, index) => (
                  <div
                    className="m-2 w-10 h-10"
                    key={profile.profileUrl ?? index}
                  >
                    <ImageWithTooltip
                      imageUrl={profile?.profileImageUrl}
                      key={profile.profileUrl}
                      onClick={() => handleClickImage(profile)}
                      onMouseEnter={(ref) =>
                        handleImageMouseEnter(profile, ref)
                      }
                      onMouseLeave={handleImageMouseLeave}
                    />
                  </div>
                ))}
              </div>
              {followers.count > followers.followers.length && (
                <p className="text-white text-xl p-8 text-center">{`+${formatNoDigit(
                  followers.count - followers.followers.length,
                )} more!`}</p>
              )}
            </>
          )}
        </div>
      ) : (
        <p className="text-white text-xl p-8 text-center">
          unknown followers state
        </p>
      )}
      <>
        <div
          ref={setPopperEl}
          className="z-20 hidden md:block p-4"
          style={{
            ...popperStyles.popper,
            visibility: showTooltip ? "visible" : "hidden",
          }}
          {...attributes.popper}
          onMouseOver={handleTooltipEnter}
          onMouseOut={handleTooltipLeave}
        >
          <Tooltip
            description={selectedEntry?.bio}
            famFollowerCount={selectedEntry?.famFollowerCount}
            followerCount={selectedEntry?.followersCount}
            imageUrl={selectedEntry?.profileImageUrl}
            links={selectedEntry?.links}
            onClickClose={() => setSelectedEntry(undefined)}
            title={selectedEntry?.name}
            twitterUrl={selectedEntry?.profileUrl}
          />
        </div>
        <Modal
          onClickBackground={() => setSelectedEntry(undefined)}
          show={!md && selectedEntry !== undefined}
        >
          {selectedEntry !== undefined && (
            <Tooltip
              description={selectedEntry?.bio}
              famFollowerCount={selectedEntry?.famFollowerCount}
              followerCount={selectedEntry?.followersCount}
              imageUrl={selectedEntry?.profileImageUrl}
              links={selectedEntry?.links}
              onClickClose={() => setSelectedEntry(undefined)}
              title={selectedEntry?.name}
              twitterUrl={selectedEntry?.profileUrl}
            />
          )}
        </Modal>
      </>
    </>
  );
};

export default FollowingYou;
