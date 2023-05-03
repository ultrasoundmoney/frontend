import type { FC, RefObject } from "react";
import { useCallback, useRef, useState } from "react";
import { usePopper } from "react-popper";
import type { FamProfile } from "../api/profiles";
import { useProfiles } from "../api/profiles";
import { useActiveBreakpoint } from "../utils/use-active-breakpoint";
import ImageWithTooltip from "./ImageWithTooltip";
import Modal from "./Modal";
import FamTooltip from "./FamTooltip";

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

const FamExplorerV1: FC = () => {
  const profiles = useProfiles()?.profiles;
  const { md } = useActiveBreakpoint();

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
          className="hidden z-10 p-4 md:block"
          style={{
            ...popperStyles.popper,
            visibility: showTooltip && md ? "visible" : "hidden",
          }}
          {...attributes.popper}
          onMouseEnter={handleTooltipEnter}
          onMouseLeave={handleTooltipLeave}
        >
          <FamTooltip
            description={selectedItem?.bio}
            famFollowerCount={selectedItem?.famFollowerCount}
            followerCount={selectedItem?.followersCount}
            imageUrl={selectedItem?.profileImageUrl}
            links={selectedItem?.links}
            title={selectedItem?.name}
            twitterUrl={selectedItem?.profileUrl}
            width="min-w-[20rem] max-w-sm"
          />
        </div>
        <Modal
          onClickBackground={() => setSelectedItem(undefined)}
          show={!md && selectedItem !== undefined}
        >
          {!md && selectedItem !== undefined && (
            <FamTooltip
              description={selectedItem.bio}
              famFollowerCount={selectedItem.famFollowerCount}
              followerCount={selectedItem.followersCount}
              imageUrl={selectedItem.profileImageUrl}
              links={selectedItem.links}
              onClickClose={() => setSelectedItem(undefined)}
              title={selectedItem.name}
              twitterUrl={selectedItem.profileUrl}
              width="min-w-[18rem] max-w-md"
            />
          )}
        </Modal>
      </>
    </>
  );
};

export default FamExplorerV1;
