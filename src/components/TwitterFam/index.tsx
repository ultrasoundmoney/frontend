import {
  FC,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Clipboard from "react-clipboard.js";
import Skeleton from "react-loading-skeleton";
import { usePopper } from "react-popper";
import { FamProfile, useProfiles } from "../../api/fam";
import { FeatureFlagsContext } from "../../feature-flags";
import * as Format from "../../format";
import { useActiveBreakpoint } from "../../utils/use-active-breakpoint";
import ImageWithTooltip from "../ImageWithTooltip";
import { Modal } from "../Modal";
import Tooltip from "../Tooltip";
import Twemoji from "../Twemoji";

const TwitterFam: FC = () => {
  const famCount = useProfiles()?.count;
  const profiles = useProfiles()?.profiles;
  const { md } = useActiveBreakpoint();

  // Popper Tooltip
  const [refEl, setRefEl] = useState<HTMLImageElement | null>(null);
  const [popperEl, setPopperEl] = useState<HTMLDivElement | null>(null);
  const { styles, attributes } = usePopper(refEl, popperEl, {
    modifiers: [
      {
        name: "flip",
      },
    ],
  });
  const [selectedProfile, setSelectedProfile] = useState<FamProfile>();
  const [showTooltip, setShowTooltip] = useState(false);
  const [showTimer, setShowTimer] = useState<number>();
  const [hideTimer, setHideTimer] = useState<number>();

  const handleImageMouseEnter = useCallback(
    (profile: FamProfile, ref: RefObject<HTMLImageElement>) => {
      // The profile data isn't there yet so no tooltip can be shown.
      if (profile === undefined) {
        return;
      }

      // If we were waiting to hide, we're hovering again, so leave the tooltip open.
      window.clearTimeout(hideTimer);

      const id = window.setTimeout(() => {
        setRefEl(ref.current);
        setSelectedProfile(profile);
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

    // If we never made it passed waiting and opened the tooltip, there is nothing to hide.
    if (selectedProfile === undefined) {
      return;
    }

    const id = window.setTimeout(() => {
      setShowTooltip(false);
    }, 300);
    setHideTimer(id);

    return () => window.clearTimeout(id);
  }, [setHideTimer, showTimer, selectedProfile]);

  const handleTooltipEnter = useCallback(() => {
    // If we were waiting to hide, we're hovering again, so leave the tooltip open.
    window.clearTimeout(hideTimer);
  }, [hideTimer]);

  const handleTooltipLeave = useCallback(() => {
    const id = window.setTimeout(() => {
      setShowTooltip(false);
    }, 300);
    setHideTimer(id);

    return () => window.clearTimeout(id);
  }, []);

  // Copy batsound feedback
  const [isCopiedFeedbackVisible, setIsCopiedFeedbackVisible] = useState(false);
  const onBatSoundCopied = () => {
    setIsCopiedFeedbackVisible(true);
    setTimeout(() => setIsCopiedFeedbackVisible(false), 400);
  };

  // Workaround to try and improve scroll to behavior for #join-the-fam .
  // TODO: check if this is still needed.
  useEffect(() => {
    if (window.location.hash === "#join-the-fam" && document !== null) {
      document
        .querySelector("#join-the-fam")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Support profile skeletons.
  const currentProfiles =
    profiles === undefined
      ? (new Array(120).fill(undefined) as undefined[])
      : profiles;

  const handleClickProfile = useCallback(
    (profile: FamProfile | undefined) => {
      if (md) {
        return;
      }

      setSelectedProfile(profile);
    },
    [md, setSelectedProfile],
  );

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
            `join ${Format.formatNoDigit(famCount)} fam members`
          )}
        </a>
      </h1>
      <div className="flex items-center">
        <p className="text-blue-shipcove md:text-lg">wear the bat signal</p>
        <div className="w-4"></div>
        <Clipboard data-clipboard-text={"🦇🔊"} onSuccess={onBatSoundCopied}>
          <span className="relative bg-blue-midnightexpress border border-gray-700 rounded-full p-2 pl-5 flex w-48 mx-auto justify-between items-center text-2xl isolate clipboard-emoji">
            <Twemoji className="flex gap-x-1" imageClassName="w-7" wrapper>
              🦇🔊
            </Twemoji>
            <span className="font-light text-base copy-container rounded-full bg-green-mediumspring text-blue-midnightexpress px-5 py-1 isolate">
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
        </Clipboard>
      </div>
      <div className="h-16"></div>
      <div className="flex flex-wrap justify-center">
        {currentProfiles.map((profile, index) => (
          <div className="m-2 w-10 h-10" key={profile?.profileUrl ?? index}>
            <ImageWithTooltip
              description={profile?.bio}
              famFollowerCount={profile?.famFollowerCount}
              followerCount={profile?.followersCount}
              imageUrl={profile?.profileImageUrl}
              links={profile?.links}
              skeletonDiameter="40px"
              title={profile?.name}
              tooltipImageUrl={profile?.profileImageUrl}
              twitterUrl={profile?.profileUrl}
              onMouseEnter={(ref) =>
                !md || profile === undefined
                  ? () => undefined
                  : handleImageMouseEnter(profile, ref)
              }
              onMouseLeave={() =>
                !md ? () => undefined : handleImageMouseLeave()
              }
              onClick={() =>
                md || profile === undefined
                  ? () => undefined
                  : handleClickProfile(profile)
              }
            />
          </div>
        ))}
      </div>
      <>
        <div
          ref={setPopperEl}
          className="z-10 hidden md:block p-4"
          style={{
            ...styles.popper,
            visibility: showTooltip ? "visible" : "hidden",
          }}
          {...attributes.popper}
          onMouseOver={handleTooltipEnter}
          onMouseOut={handleTooltipLeave}
        >
          <Tooltip
            description={selectedProfile?.bio}
            famFollowerCount={selectedProfile?.famFollowerCount}
            followerCount={selectedProfile?.followersCount}
            imageUrl={selectedProfile?.profileImageUrl}
            links={selectedProfile?.links}
            title={selectedProfile?.name}
            twitterUrl={selectedProfile?.profileUrl}
          />
        </div>
        <Modal
          onClickBackground={() => setSelectedProfile(undefined)}
          show={!md && selectedProfile !== undefined}
        >
          {!md && selectedProfile !== undefined && (
            <Tooltip
              description={selectedProfile.bio}
              famFollowerCount={selectedProfile.famFollowerCount}
              followerCount={selectedProfile.followersCount}
              imageUrl={selectedProfile.profileImageUrl}
              links={selectedProfile.links}
              onClickClose={() => setSelectedProfile(undefined)}
              title={selectedProfile.name}
              twitterUrl={selectedProfile.profileUrl}
            />
          )}
        </Modal>
      </>
    </>
  );
};

export default TwitterFam;
