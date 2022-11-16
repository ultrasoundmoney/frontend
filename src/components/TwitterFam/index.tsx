import type { FC, RefObject } from "react";
import { useCallback, useRef, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { usePopper } from "react-popper";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import type { FamProfile } from "../../api/profiles";
import { useProfiles } from "../../api/profiles";
import { useActiveBreakpoint } from "../../utils/use-active-breakpoint";
import ImageWithTooltip from "../ImageWithTooltip";
import Modal from "../Modal";
import FamTooltip from "../FamTooltip";
import Twemoji from "../Twemoji";
import { WidgetBackground, WidgetTitle } from "../WidgetSubcomponents";
import BasicErrorBoundary from "../BasicErrorBoundary";
import SectionDivider from "../SectionDivider";

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

      // onImage.current = true;
      if (!showTooltip && !onTooltip.current) {
        setRefEl(ref.current);
        setSelectedItem(profile);
        setShowTooltip(true);
      } else {
        setShowTooltip(false);
        setSelectedItem(undefined);
      }


      // // Delayed show.
      // const id = window.setTimeout(() => {
      //   if (onImage.current || onTooltip.current) {
      //     setRefEl(ref.current);
      //     setSelectedItem(profile);
      //     setShowTooltip(true);
      //   }
      // }, 300);

      // return () => window.clearTimeout(id);
    },
    [showTooltip, setShowTooltip, setSelectedItem, setRefEl, onImage, onTooltip],
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
  const profiles = useProfiles()?.profiles;
  const { md } = useActiveBreakpoint();
  const fullScreenHandle = useFullScreenHandle();

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
  // const currentProfiles = new Array(120).fill(undefined) as undefined[]

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
      <SectionDivider
        title="join the fam"
      />
      <BasicErrorBoundary>
        <div className="flex flex-col gap-y-4 lg:flex-row lg:gap-x-4 w-full">
          <div className="flex basis-1/2 flex-col gap-y-4">
            <WidgetBackground>
              <WidgetTitle>FAM COUNT</WidgetTitle>
              <div className="mt-4 flex flex-col gap-y-4">
                <div className="h-1"></div>
                <h1 className="mb-4 text-2xl font-light text-white md:text-3xl xl:text-41xl">
                  {profiles?.length?.toLocaleString("en-US")} <span className="text-blue-spindle font-extralight text-2xl md:text-2xl xl:text-4xl">members</span>
                </h1>
              </div>
            </WidgetBackground>
          </div>
          <div className="flex basis-1/2 flex-col gap-y-4">
            <WidgetBackground>
              <WidgetTitle>WEAR THE BAT SIGNAL</WidgetTitle>
              <div className="flex flex-row justify-between">
                <div className="mt-4 flex flex-col gap-y-4">
                  <div className="h-1"></div>
                  <h1 className="mb-2 text-center text-2xl font-light text-white md:text-3xl xl:text-41xl">
                    <Twemoji className="flex gap-x-1" imageClassName="w-11" wrapper>
                      🦇🔊
                    </Twemoji>
                  </h1>
                </div>
                <div className="mt-4 flex flex-col gap-y-4">
                  <div className="h-1"></div>
                  <CopyToClipboard text={"🦇🔊"} onCopy={onBatSoundCopied}>
                  <button type="button" className="bg-gradient-to-r from-[#00FFFB] via-[#54C4F4] via-[#5487F4] to-[#6A54F4] rounded-full p-px">
                    <button className="rounded-full px-5 py-1 pb-2 text-base font-light text-white bg-slateus-700">
                      {isCopiedFeedbackVisible ? 'copied!' : 'copy'}
                    </button>
                  </button>
                  </CopyToClipboard>
                </div>
              </div>
            </WidgetBackground>
          </div>
        </div>
      </BasicErrorBoundary>
      <div className="h-12"></div>
      <FullScreen handle={fullScreenHandle}>
        <div className="flex flex-wrap justify-center w-screen">
          <TransformWrapper
            initialScale={2}
            initialPositionX={0}
            initialPositionY={0}
            wheel={{ wheelDisabled: true }}
          >
            {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
              <>
                <div
                  style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}
                >
                  <button
                    className={`
                      ml-4 flex
                      select-none items-center rounded
                      border border-transparent
                      bg-blue-tangaroa
                      px-2 py-1
                    `}
                    onClick={() => zoomIn()}
                  >
                    <img
                      style={{ color: 'white' }}
                      src={`/magnifying-glass-plus.svg`}
                      alt="magnifying-glass-plus"
                      width={15}
                      height={15}
                    />
                  </button>
                  <button
                    className={`
                      ml-4 flex
                      select-none items-center rounded
                      border border-transparent
                      bg-blue-tangaroa
                      px-2 py-1
                    `}
                    onClick={() => zoomOut()}
                  >
                    <img
                      style={{ color: 'white' }}
                      src={`/magnifying-glass-minus.svg`}
                      alt="magnifying-glass-minus"
                      width={15}
                      height={15}
                    />
                  </button>
                  <button
                    className={`
                      ml-4 flex
                      select-none items-center rounded
                      border border-transparent
                      bg-blue-tangaroa
                      px-2 py-1
                    `}
                    onClick={() => resetTransform()}
                  >
                      <img
                        style={{ color: 'white' }}
                        src={`/rotate-right.svg`}
                        alt="rotate-right"
                        width={15}
                        height={15}
                      />
                  </button>
                  <button
                    className={`
                      ml-4 flex
                      select-none items-center rounded
                      border border-transparent
                      bg-blue-tangaroa
                      px-2 py-1
                    `}
                    onClick={fullScreenHandle.active ? fullScreenHandle.exit : fullScreenHandle.enter}
                  >
                    <img
                      style={{ color: 'white' }}
                      src={fullScreenHandle.active ? `/compress.svg` : `/expand.svg`}
                      alt="expand"
                      width={15}
                      height={15}
                    />
                  </button>
                </div>
                <TransformComponent
                  wrapperStyle={{ height: fullScreenHandle.active ? '100%' : 500, cursor: "move" }}
                >
                  {currentProfiles.map((profile, index) => (
                    <ImageWithTooltip
                      key={profile?.profileUrl ?? index}
                      // className="m-2 h-10 w-10 select-none"
                      className="m-1 h-3 w-3 select-none"
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
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        </div>
      </FullScreen>
      <>
        <div
          ref={setPopperEl}
          className="z-10 hidden p-4 md:block"
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

export default TwitterFam;
