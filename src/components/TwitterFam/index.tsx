import { FC, RefObject } from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { usePopper } from "react-popper";
import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import type { FamProfile } from "../../api/profiles";
import { useProfiles } from "../../api/profiles";
import { useActiveBreakpoint } from "../../utils/use-active-breakpoint";
import Modal from "../Modal";
import FamTooltip from "../FamTooltip";
import Twemoji from "../Twemoji";
import { WidgetBackground, WidgetTitle } from "../WidgetSubcomponents";
import BasicErrorBoundary from "../BasicErrorBoundary";
import SectionDivider from "../SectionDivider";
import ClickAwayListener from "react-click-away-listener";
import ImageWithOnClickTooltip from "../ImageWithOnClickTooltip";
import imageWithOnClickStyles from "../ImageWithOnClickTooltip.module.scss";
import followingYouStyles from "../FollowingYou/FollowingYou.module.scss";
import coordinates from '../../../public/sprite/coordinates.json'
import properties from '../../../public/sprite/properties.json'

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

  const handleImageClick = useCallback(
    (profile: FamProfile, ref: RefObject<HTMLImageElement>) => {
      // The ranking data isn't there yet so no tooltip can be shown.
      if (profile === undefined) {
        return;
      }

      // onImage.current = true;
      // wait for the click-a-way event to fire before showing the tooltip
      const id = window.setTimeout(() => {
        if (!showTooltip && !onTooltip.current) {
          setRefEl(ref.current);
          setSelectedItem(profile);
          setShowTooltip(true);
        } else {
          setShowTooltip(false);
          setSelectedItem(undefined);
        }
      }, 50);

      return () => window.clearTimeout(id);
    },
    [showTooltip, setShowTooltip, setSelectedItem, setRefEl, onTooltip],
  );

  const handleClickAway = useCallback(() => {
    onImage.current = false;

    if (!onImage.current && !onTooltip.current) {
      setShowTooltip(false);
      setSelectedItem(undefined);
    }
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
    }, 200);

    return () => window.clearTimeout(id);
  }, [onImage, onTooltip]);

  return {
    attributes,
    // handleClickImage,
    handleImageClick,
    handleClickAway,
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
  const [searchValue, setSearchValue] = useState("");
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
    // handleClickImage,
    handleImageClick,
    handleClickAway,
    handleTooltipEnter,
    handleTooltipLeave,
    popperStyles,
    selectedItem,
    setPopperEl,
    setSelectedItem,
    showTooltip,
  } = useTooltip();

  const panZoomRef = useRef<ReactZoomPanPinchRef>(null);

  const generateImageKeyfromUrl = (url: string | undefined) => {
    // i.e. https://pbs.twimg.com/profile_images/1537478481096781825/J1BDruLr.png
    if (url?.includes('default_profile_images')) {
      return 'default_profile-images.png';
    }
    const userId = url?.split('profile_images')?.[1]?.split('/')[1]; // i.e. 1579896394919383051
    const fileName = `${userId}-::-${url?.split('profile_images')?.[1]?.split('/')[2]}`; // i.e. 1579896394919383051-::-ahIN3HUB.jpg
    return `profile_images/${fileName}`;
  }

  const getXAndY = (imageUrl: string | undefined, sizeFactor: number) => {
    if (imageUrl !== undefined) {
      const key = generateImageKeyfromUrl(imageUrl);
      let x = coordinates?.[key as keyof typeof coordinates]?.x / sizeFactor;
      let y = coordinates?.[key as keyof typeof coordinates]?.y / sizeFactor;
      // x is going right to left not left to right
      x = properties?.width / sizeFactor - x;
      // y is going bottom to top not top to bottom
      y = properties?.height / sizeFactor - y;
      if (Number.isNaN(x)) {
        x = coordinates?.['profile_images/default_profile-images.png' as keyof typeof coordinates ]?.x / sizeFactor;
        y = coordinates?.['profile_images/default_profile-images.png' as keyof typeof coordinates ]?.y / sizeFactor;
      }
      return { x, y };
    }
    return { x: null, y: null };
  }
  
  const filteredProfiles = useMemo(() => {
    // remove an @ if user started with it
    let cleanSearchValue = searchValue;
    if (searchValue.startsWith("@")) {
      cleanSearchValue = searchValue.slice(1);
    }
    // return all profiles if search is empty
    if (cleanSearchValue === "") {
      return profiles;
    }
    // filter profiles
    return profiles?.filter((profile) => {
      if (profile === undefined) {
        return false;
      }
      // search by name or handle (case insensitive)
      const lcSearchValue = cleanSearchValue.toLowerCase();
      return profile.name.toLowerCase().includes(lcSearchValue) || profile.handle.toLowerCase().includes(lcSearchValue);
    });
  }, [profiles, searchValue]);
  const filteredProfilesCount = filteredProfiles?.length;

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
                  {profiles?.length?.toLocaleString("en-US")} <span className="text-slateus-400 font-extralight text-2xl md:text-2xl xl:text-4xl">members</span>
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
      <BasicErrorBoundary>
        <WidgetBackground className="w-full">
          <div className="flex justify-between">
          <WidgetTitle>FAM EXPLORER</WidgetTitle>
          {searchValue && (
            <WidgetTitle className="lowercase text-emerald-400" >{filteredProfilesCount} matches</WidgetTitle>
          )}
          </div>
          <FullScreen
            handle={fullScreenHandle}
            className="bg-slateus-700"
          >
            <div
              className={`
                flex
                flex-wrap
                justify-center
              `}
            >
              <TransformWrapper
                ref={panZoomRef}
                initialScale={2}
                initialPositionX={0}
                initialPositionY={0}
                wheel={{ wheelDisabled: true }}
                panning={{ excluded: [`${imageWithOnClickStyles["fam-image-sprite"]}`] }}
                // onZoomStop={handleOnZoomStop}
              >
                {({ zoomIn, zoomOut, resetTransform, zoomToElement, ...rest }) => (
                  <>
                    <div
                      className="grid gap-3 grid-cols-4 my-4"
                    >
                      <button
                        className={`
                          flex
                          select-none items-center
                          border rounded-lg
                          border-slateus-400
                          bg-slateus-600
                          px-2 py-2
                        `}
                        onClick={() => zoomIn()}
                      >
                        <span
                          className="w-3 h-3 leading-[9px]"
                        >
                          +
                        </span>
                      </button>
                      <button
                        className={`
                          flex
                          select-none items-center
                          border rounded-lg
                          border-slateus-400
                          bg-slateus-600
                          px-2 py-1
                        `}
                        onClick={() => zoomOut()}
                      >
                        <span
                          className="w-3 h-3 leading-[9px]"
                        >
                          -
                        </span>
                      </button>
                      <button
                        className={`
                          flex
                          select-none items-center
                          border rounded-lg
                          border-slateus-400
                          bg-slateus-600
                          px-2 py-1
                        `}
                        onClick={() => resetTransform()}
                      >
                          <img
                            src={`/rotate-right.svg`}
                            alt="rotate-right"
                            width={12}
                            height={12}
                          />
                      </button>
                      <button
                        className={`
                          flex
                          select-none items-center
                          border rounded-lg
                          border-slateus-400
                          bg-slateus-600
                          px-2 py-1
                        `}
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        // todo: reset the zoom and position on exit
                        onClick={fullScreenHandle.active ? fullScreenHandle.exit : fullScreenHandle.enter}
                      >
                        <img
                          src={fullScreenHandle.active ? `/compress.svg` : `/expand.svg`}
                          alt="expand"
                          width={12}
                          height={12}
                        />
                      </button>
                    </div>
                    <TransformComponent
                      wrapperStyle={{ height: fullScreenHandle.active ? '100%' : 500, cursor: "move", width: '100%' }}
                    >
                      {profiles?.map((profile, index) => (
                        <ClickAwayListener onClickAway={handleClickAway} key={profile?.profileUrl ?? index}>
                          <ImageWithOnClickTooltip
                            className={`m-1 h-3 w-3 select-none
                              ${filteredProfiles?.findIndex((p) => p.name === profile.name) === -1 && '!brightness-[0.25]'}
                            `}
                            imageUrl={profile?.profileImageUrl}
                            handle={profile?.handle}
                            isDoneLoading={profile !== undefined}
                            skeletonDiameter="20px"
                            onClick={(ref) =>
                              !md || profile === undefined
                                ? () => undefined
                                : handleImageClick(profile, ref)
                            }
                            height={20}
                            width={20}
                            currentScale={panZoomRef.current?.state?.scale}
                            getXAndY={getXAndY}
                          />
                        </ClickAwayListener>
                      ))}
                    </TransformComponent>
                    {/* Search for your profile form */}
                    <div
                      className={`
                        mt-6
                        ${fullScreenHandle.active ? 'absolute -top-2 right-4 bg-slateus-700 rounded-full' : ''}
                      `}
                    >
                      <form
                        className={`
                          flex
                          justify-center
                        `}
                        onSubmit={(event) => {
                          console.log('event:', event);
                          event.preventDefault();
                          if (filteredProfiles?.[0]) {
                            zoomToElement(document.getElementById(filteredProfiles[0].handle.toLowerCase()) || '', 3);
                          }
                        }}
                      >
                        <input
                          className="rounded-full border border-gray-500 bg-transparent p-4 pr-32 text-xs text-white md:w-96"
                          type="text"
                          placeholder="@vitalikbuterin"
                          value={searchValue}
                          spellCheck="false"
                          // onChange={(event) => setSearchValue(event.target.value)}
                          onChange={(event) => {
                            setSearchValue(event.target.value);
                          }}
                        />
                        <button
                          className={`
                            ${followingYouStyles.showMe}
                            -ml-28 select-none rounded-full
                            border border-white
                            bg-transparent px-5
                            text-xs text-white
                            hover:bg-gray-700
                            md:w-32
                            disabled:opacity-50
                          `}
                          type="submit"
                          disabled={filteredProfilesCount !== 1}
                        >
                          show me →
                        </button>
                      </form>
                    </div>
                  </>
                )}
              </TransformWrapper>
            </div>
          </FullScreen>
        </WidgetBackground>
      </BasicErrorBoundary>
      <>
        <div
          ref={setPopperEl}
          className="z-10 hidden p-4 md:block"
          style={{
            ...popperStyles.popper,
            visibility: showTooltip && md ? "visible" : "hidden",
          }}
          {...attributes.popper}
          // onMouseEnter={handleTooltipEnter}
          // onMouseLeave={handleTooltipLeave}
        >
          <FamTooltip
            description={selectedItem?.bio}
            famFollowerCount={selectedItem?.famFollowerCount}
            followerCount={selectedItem?.followersCount}
            imageUrl={selectedItem?.profileImageUrl}
            onClickClose={() => handleClickAway()}
            links={selectedItem?.links}
            title={selectedItem?.name}
            twitterUrl={selectedItem?.profileUrl}
            width="min-w-[20rem] max-w-sm"
            getXAndY={getXAndY}
          />
        </div>
        <Modal
          onClickBackground={() => handleClickAway()}
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
              getXAndY={getXAndY}
            />
          )}
        </Modal>
      </>
    </>
  );
};

export default TwitterFam;
