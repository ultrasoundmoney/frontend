import { FC, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { famBasePath, FamProfile } from "../../api/fam";
import { formatNoDigit } from "../../format";
import SpanMoji from "../SpanMoji";
import FamAvatar from "../TwitterFam/FamAvatar";
import { FamModal, FamModalContent } from "../TwitterFam/FamModal";
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
  const [handle, setHandle] = useState<string>("");
  const [followers, setFollowers] = useState<FollowedByResult>({
    type: "empty",
  });
  const [selectedProfile, setSelectedProfile] = useState<
    FamProfile | undefined
  >();

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

  return (
    <>
      <div className="flex justify-center items-center mb-8">
        <h1 className="text-white font-light text-center text-2xl md:text-3xl xl:text-41xl">
          me & the fam
        </h1>
        <SpanMoji emoji="👀" />
      </div>
      <p
        className={`text-blue-shipcove leading-6 md:leading-none text-center font-light text-base lg:text-lg mb-14`}
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
                {followers.followers.map((profile, index) =>
                  profile === undefined ? (
                    <Skeleton circle={true} height="40px" width="40" />
                  ) : (
                    <FamAvatar
                      key={index}
                      onClick={setSelectedProfile}
                      profile={profile}
                    />
                  ),
                )}
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
      <FamModal
        show={selectedProfile !== undefined}
        onClickBackground={() => setSelectedProfile(undefined)}
      >
        <FamModalContent
          onClickClose={() => setSelectedProfile(undefined)}
          profile={selectedProfile}
        ></FamModalContent>
      </FamModal>
    </>
  );
};

export default FollowingYou;
