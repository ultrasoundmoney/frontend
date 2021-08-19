import * as React from "react";
import TwitterProfile from "../TwitterCommunity/TwitterProfile";
import SpanMoji from "../SpanMoji";
import { TranslationsContext } from "../../translations-context";
import { famBasePath } from "../../api";

type Empty = { type: "empty" };
type FollowedBy = {
  type: "followers";
  count: number;
  followers: TwitterProfile[];
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

const FollowingYou: React.FC = () => {
  const t = React.useContext(TranslationsContext);
  const [handle, setHandle] = React.useState<string>("");
  const [followers, setFollowers] = React.useState<FollowedByResult>({
    type: "empty",
  });

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
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
      const body = await res.json();
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
      <h1 className="text-white font-light text-center text-2xl md:text-3xl xl:text-41xl mb-8">
        {t.title_following_you}
        <SpanMoji emoji=" 👀" />
      </h1>
      <p
        className={`text-blue-shipcove leading-6 md:leading-none text-center font-light text-base lg:text-lg mb-14`}
      >
        {t.teaser_following_you}
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
          className="show-me md:w-32 -ml-28 px-5 text-xs text-white border border-white bg-transparent rounded-full hover:bg-gray-700"
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
              <TwitterProfile profileList={followers.followers} />
              {followers.count > followers.followers.length && (
                <p className="text-white text-xl p-8 text-center">{`+${new Intl.NumberFormat().format(
                  followers.count - followers.followers.length
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
    </>
  );
};

export default FollowingYou;
