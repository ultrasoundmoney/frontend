import type { FC } from "react";
import { useState } from "react";
import type { FamProfile } from "../../api/profiles";
import { formatZeroDecimals } from "../../format";
import { useActiveBreakpoint } from "../../utils/use-active-breakpoint";
import ImageWithTooltip from "../ImageWithTooltip";
import Modal from "../Modal";
import { SectionTitle } from "../TextsNext/SectionTitle";
import FamTooltip from "../FamTooltip";
import { useTooltip } from "../TwitterFam";
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
    handleClickImage,
    handleTooltipEnter,
    handleTooltipLeave,
    handleImageMouseLeave,
    handleImageMouseEnter,
    selectedItem,
    setPopperEl,
    setSelectedItem,
    showTooltip,
    popperStyles,
  } = useTooltip();

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
                  <ImageWithTooltip
                    key={profile.profileUrl ?? index}
                    className="m-2 h-10 w-10"
                    imageUrl={profile?.profileImageUrl}
                    onClick={() => handleClickImage(profile)}
                    onMouseEnter={(ref) => handleImageMouseEnter(profile, ref)}
                    onMouseLeave={handleImageMouseLeave}
                    height={40}
                    width={40}
                  />
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
          onMouseOver={handleTooltipEnter}
          onMouseOut={handleTooltipLeave}
        >
          <FamTooltip
            description={selectedItem?.bio}
            famFollowerCount={selectedItem?.famFollowerCount}
            followerCount={selectedItem?.followersCount}
            imageUrl={selectedItem?.profileImageUrl}
            links={selectedItem?.links}
            onClickClose={() => setSelectedItem(undefined)}
            title={selectedItem?.name}
            twitterUrl={selectedItem?.profileUrl}
            width="min-w-[18rem] max-w-sm"
          />
        </div>
        <Modal
          onClickBackground={() => setSelectedItem(undefined)}
          show={!md && selectedItem !== undefined}
        >
          {selectedItem !== undefined && (
            <FamTooltip
              description={selectedItem?.bio}
              famFollowerCount={selectedItem?.famFollowerCount}
              followerCount={selectedItem?.followersCount}
              imageUrl={selectedItem?.profileImageUrl}
              links={selectedItem?.links}
              onClickClose={() => setSelectedItem(undefined)}
              title={selectedItem?.name}
              twitterUrl={selectedItem?.profileUrl}
              width="min-w-[18rem] max-w-sm"
            />
          )}
        </Modal>
      </>
    </>
  );
};

export default FollowingYou;
