import type { FC } from "react";
import { useState } from "react";
import type { FamProfile } from "../../api/profiles";
import { formatZeroDecimals } from "../../../format";
import { useActiveBreakpoint } from "../../utils/use-active-breakpoint";
import ImageWithTooltip from "../ImageWithTooltip";
import Modal from "../Modal";
import { SectionTitle } from "../../../components/TextsNext/SectionTitle";
import FamTooltip from "../FamTooltip";
import styles from "./FollowingYou.module.scss";
import ClickAwayListener from "react-click-away-listener";
import { useTooltip } from "../TwitterFam";
import SpriteWithOnClickTooltip from "../../../components/SpriteWithOnClickTooltip";
import { useSpriteSheet } from "../../api/profiles";

const sizeFactor = 2.4; // (from 96px to 40px)

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

    const res = await fetch(`/api/fam/${cleanHandle}/followed-by`);

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
    // handleClickImage,
    handleImageClick,
    handleClickAway,
    popperStyles,
    selectedItem,
    setPopperEl,
    setSelectedItem,
    showTooltip,
  } = useTooltip();

  const { coordinates, properties } = useSpriteSheet() || {};

  const generateImageKeyfromUrl = (url: string | undefined) => {
    // i.e. https://pbs.twimg.com/profile_images/1537478481096781825/J1BDruLr.png
    if (url?.includes('default_profile_images')) {
      return 'default_profile-images.png';
    }
    const userId = url?.split('profile_images')?.[1]?.split('/')[1]; // i.e. 1579896394919383051
    const fileName = `${userId}-::-${url?.split('profile_images')?.[1]?.split('/')[2]}`; // i.e. 1579896394919383051-::-ahIN3HUB.jpg
    return `/sprite-sheet-images/source_images/${fileName}`;
  }

  const getXAndY = (imageUrl: string | undefined, sizeFactor: number) => {
    if (imageUrl !== undefined && coordinates && properties) {
      const key = generateImageKeyfromUrl(imageUrl);
      let x = (coordinates?.[key as keyof typeof coordinates]?.x || 0) / sizeFactor;
      let y = (coordinates?.[key as keyof typeof coordinates]?.y || 0) / sizeFactor;
      // x is going right to left not left to right
      x = properties?.width / sizeFactor - x;
      // y is going bottom to top not top to bottom
      y = properties?.height / sizeFactor - y;
      if (Number.isNaN(x)) {
        x = (coordinates?.['/sprite-sheet-images/source_images/default_profile-images.png' as keyof typeof coordinates ]?.x || 0) / sizeFactor;
        x = properties?.width / sizeFactor - x;
        y = (coordinates?.['/sprite-sheet-images/source_images/default_profile-images.png' as keyof typeof coordinates ]?.y || 0) / sizeFactor;
        y = properties?.height / sizeFactor - y;
      }
      return { x, y };
    }
    return { x: null, y: null };
  }

  return (
    <>
      <SectionTitle subtitle="do we know each other? find out how many of us follow you.">
        me & the fam
      </SectionTitle>
      <p
        className={`mb-16 text-center text-base font-light leading-6 text-slateus-400 md:leading-none lg:text-lg`}
      ></p>
      <form
        className="flex justify-center"
        onSubmit={(event) => {
          handleSubmit(event).catch(console.error);
        }}
      >
        <input
          className="rounded-full border border-gray-500 bg-transparent p-4 pr-32 text-xs text-white md:w-96"
          type="text"
          placeholder="@vitalikbuterin"
          value={handle}
          spellCheck="false"
          onChange={(event) => setHandle(event.target.value)}
        />
        <button
          className={`
            ${styles.showMe}
            -ml-28 select-none rounded-full
            border border-white
            bg-transparent px-5
            text-xs text-white
            hover:bg-gray-700
            md:w-32
          `}
          type="submit"
        >
          show me →
        </button>
      </form>
      {followers.type === "empty" ? null : followers.type ===
        "handleNotFound" ? (
        <p className="p-8 text-center text-xl text-white">handle not found</p>
      ) : followers.type === "searching" ? (
        <p className="p-8 text-center text-xl text-white">searching...</p>
      ) : followers.type === "unknownError" ? (
        <p className="p-8 text-center text-xl text-white">
          error fetching followers
        </p>
      ) : followers.type === "followers" ? (
        <div className="my-8">
          {followers.count === 0 ? (
            <p className="p-8 text-center text-xl text-white">
              no fam followers found
            </p>
          ) : (
            <>
              <div className="flex flex-wrap justify-center">
                {followers.followers.map((profile, index) => (
                  <ClickAwayListener onClickAway={handleClickAway} key={profile?.profileUrl ?? index}>
                    <SpriteWithOnClickTooltip
                      className={`m-[8px] h-10 w-10 select-none`}
                      imageUrl={profile?.profileImageUrl}
                      handle={profile?.handle}
                      isDoneLoading={profile !== undefined}
                      skeletonDiameter="20px"
                      onClick={(ref) =>
                        !md || profile === undefined
                          ? () => undefined
                          : handleImageClick(profile, ref)
                      }
                      getXAndY={getXAndY}
                      excluded={false}
                      properties={properties ?? { width: 0, height: 0 }}
                      sizeFactor={sizeFactor}
                    />
                  </ClickAwayListener>
                  // <ImageWithTooltip
                  //   key={profile.profileUrl ?? index}
                  //   className="m-2 h-10 w-10"
                  //   imageUrl={profile?.profileImageUrl}
                  //   onClick={() => handleClickImage(profile)}
                  //   onMouseEnter={(ref) => handleImageMouseEnter(profile, ref)}
                  //   onMouseLeave={handleImageMouseLeave}
                  //   height={40}
                  //   width={40}
                  // />
                ))}
              </div>
              {followers.count > followers.followers.length && (
                <p className="p-8 text-center text-xl text-white">{`+${formatZeroDecimals(
                  followers.count - followers.followers.length,
                )} more!`}</p>
              )}
            </>
          )}
        </div>
      ) : (
        <p className="p-8 text-center text-xl text-white">
          unknown followers state
        </p>
      )}
      <>
        <div
          ref={setPopperEl}
          className="z-20 hidden p-4 md:block"
          style={{
            ...popperStyles.popper,
            visibility: showTooltip && md ? "visible" : "hidden",
          }}
          {...attributes.popper}
          // onMouseOver={handleTooltipEnter}
          // onMouseOut={handleTooltipLeave}
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
            properties={properties ?? { width: 0, height: 0 }}
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
              getXAndY={getXAndY}
              properties={properties ?? { width: 0, height: 0 }}
            />
          )}
        </Modal>
      </>
    </>
  );
};

export default FollowingYou;
