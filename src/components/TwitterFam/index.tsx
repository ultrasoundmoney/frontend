import type { FC, RefObject } from "react";
import { useCallback, useRef, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import Skeleton from "react-loading-skeleton";
import { usePopper } from "react-popper";
import type { FamProfile } from "../../api/profiles";
import { useProfiles } from "../../api/profiles";
import { useActiveBreakpoint } from "../../utils/use-active-breakpoint";
import ImageWithTooltip from "../ImageWithTooltip";
import Modal from "../Modal";
import Tooltip from "../Tooltip";
import Twemoji from "../Twemoji";

// See if merging with leaderboards tooltip makes sense after making it more generic.
export const useTooltip = () => {
  const { md } = useActiveBreakpoint();
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
  const [selectedItem, setSelectedItem] = useState<FamProfile>();
  const [showTooltip, setShowTooltip] = useState(false);
  const onTooltip = useRef<boolean>(false);
  const onImage = useRef<boolean>(false);

  const handleImageMouseEnter = useCallback(
    (profile: FamProfile, ref: RefObject<HTMLImageElement>) => {
      // The ranking data isn't there yet so no tooltip can be shown.
      if (profile === undefined) {
        return;
      }

      onImage.current = true;

      // Delayed show.
      const id = window.setTimeout(() => {
        if (onImage.current || onTooltip.current) {
          setRefEl(ref.current);
          setSelectedItem(profile);
          setShowTooltip(true);
        }
      }, 300);

      return () => window.clearTimeout(id);
    },
    [onImage, onTooltip],
  );

  const handleImageMouseLeave = useCallback(() => {
    onImage.current = false;

    // Delayed hide.
    const id = window.setTimeout(() => {
      if (!onImage.current && !onTooltip.current) {
        setShowTooltip(false);
        setSelectedItem(undefined);
      }
    }, 300);

    return () => window.clearTimeout(id);
  }, [onImage, onTooltip]);

  const handleTooltipEnter = useCallback(() => {
    onTooltip.current = true;
  }, []);

  const handleTooltipLeave = useCallback(() => {
    onTooltip.current = false;

    // Delayed hide.
    const id = window.setTimeout(() => {
      if (!onImage.current && !onTooltip.current) {
        setShowTooltip(false);
        setSelectedItem(undefined);
      }
    }, 100);

    return () => window.clearTimeout(id);
  }, [onImage, onTooltip]);

  const handleClickImage = useCallback(
    (ranking: FamProfile | undefined) => {
      if (md) {
        return;
      }

      setSelectedItem(ranking);
    },
    [md, setSelectedItem],
  );

  return {
    attributes,
    handleClickImage,
    handleImageMouseEnter,
    handleImageMouseLeave,
    handleTooltipEnter,
    handleTooltipLeave,
    selectedItem,
    setPopperEl,
    setSelectedItem,
    showTooltip,
    popperStyles: styles,
  };
};

const TwitterFam: FC = () => {
  const famCount = useProfiles()?.count;
  const profiles = useProfiles()?.profiles;
  const { md } = useActiveBreakpoint();

  // Copy batsound feedback
  const [isCopiedFeedbackVisible, setIsCopiedFeedbackVisible] = useState(false);
  const onBatSoundCopied = () => {
    setIsCopiedFeedbackVisible(true);
    setTimeout(() => setIsCopiedFeedbackVisible(false), 400);
  };

  // Support profile skeletons.
  const currentProfiles =
    profiles === undefined
      ? (new Array(120).fill(undefined) as undefined[])
      : profiles;

  const {
    attributes,
    handleClickImage,
    handleImageMouseEnter,
    handleImageMouseLeave,
    handleTooltipEnter,
    handleTooltipLeave,
    popperStyles,
    selectedItem,
    setPopperEl,
    setSelectedItem,
    showTooltip,
  } = useTooltip();

  return (
    <>
      <h1 className="text-white font-light text-center text-2xl md:text-3xl xl:text-41xl mb-8">
        <a
          target="_blank"
          href="https://twitter.com/i/lists/1376636817089396750/members"
          rel="noopener noreferrer"
          role="link"
          title="join the ultra sound Twitter fam"
          className="hover:underline hover:text-blue-spindle relative h-full"
        >
          {famCount === undefined ? (
            <>
              join <Skeleton inline={true} width="4rem" /> fam members
            </>
          ) : (
            `join 5000+ fam members`
          )}
        </a>
      </h1>
      <div className="flex items-center justify-center">
        <p className="text-blue-shipcove md:text-lg">wear the bat signal</p>
        <div className="w-4"></div>
        <CopyToClipboard text={"🦇🔊"} onCopy={onBatSoundCopied}>
          <span className="relative bg-blue-midnightexpress border border-gray-700 rounded-full p-2 pl-5 flex w-48 mx-auto justify-between items-center text-2xl isolate clipboard-emoji">
            <Twemoji className="flex gap-x-1" imageClassName="w-7" wrapper>
              🦇🔊
            </Twemoji>
            <span className="font-light text-base copy-container rounded-full bg-mediumspring text-blue-midnightexpress px-5 py-1 isolate select-none">
              copy
            </span>
            <span
              className={`absolute left-0 right-0 top-0 bottom-0 p-1 bg-blue-midnightexpress flex justify-center items-center rounded-full transition-opacity ${
                isCopiedFeedbackVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              <p className="font-inter font-light text-base text-white">
                copied!
              </p>
            </span>
          </span>
        </CopyToClipboard>
      </div>
      <div className="h-16"></div>
      <div className="flex flex-wrap justify-center">
        {currentProfiles.map((profile, index) => (
          <ImageWithTooltip
            key={profile?.profileUrl ?? index}
            className="m-2 w-10 h-10 select-none"
            imageUrl={profile?.profileImageUrl}
            isDoneLoading={profile !== undefined}
            skeletonDiameter="40px"
            onMouseEnter={(ref) =>
              !md || profile === undefined
                ? () => undefined
                : handleImageMouseEnter(profile, ref)
            }
            onMouseLeave={() =>
              !md ? () => undefined : handleImageMouseLeave()
            }
            onClick={() => handleClickImage(profile)}
            height={40}
            width={40}
          />
        ))}
      </div>
      <>
        <div
          ref={setPopperEl}
          className="z-10 hidden md:block p-4"
          style={{
            ...popperStyles.popper,
            visibility: showTooltip && md ? "visible" : "hidden",
          }}
          {...attributes.popper}
          onMouseEnter={handleTooltipEnter}
          onMouseLeave={handleTooltipLeave}
        >
          <Tooltip
            description={selectedItem?.bio}
            famFollowerCount={selectedItem?.famFollowerCount}
            followerCount={selectedItem?.followersCount}
            imageUrl={selectedItem?.profileImageUrl}
            links={selectedItem?.links}
            title={selectedItem?.name}
            twitterUrl={selectedItem?.profileUrl}
          />
        </div>
        <Modal
          onClickBackground={() => setSelectedItem(undefined)}
          show={!md && selectedItem !== undefined}
        >
          {!md && selectedItem !== undefined && (
            <Tooltip
              description={selectedItem.bio}
              famFollowerCount={selectedItem.famFollowerCount}
              followerCount={selectedItem.followersCount}
              imageUrl={selectedItem.profileImageUrl}
              links={selectedItem.links}
              onClickClose={() => setSelectedItem(undefined)}
              title={selectedItem.name}
              twitterUrl={selectedItem.profileUrl}
            />
          )}
        </Modal>
      </>
    </>
  );
};

export default TwitterFam;
