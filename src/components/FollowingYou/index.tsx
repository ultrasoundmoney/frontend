import * as React from "react";
import { useTranslations } from "../../utils/use-translation";

type Empty = { type: "empty" };
type FollowedByCount = { type: "followedByCount"; count: number };
type HandleNotFound = { type: "handleNotFound" };
type Searching = { type: "searching" };

type FollowedByResult = FollowedByCount | HandleNotFound | Empty | Searching;

const FollowingYou: React.FC = () => {
  const { translations: t } = useTranslations();
  const [handle, setHandle] = React.useState<string>("");
  const [followedByCount, setFollowedByCount] = React.useState<
    FollowedByResult
  >({ type: "empty" });

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    setFollowedByCount({ type: "searching" });

    const cleanHandle = handle.startsWith("@") ? handle.slice(1) : handle;

    const res = await fetch(
      `https://api.ultrasound.money/fam/${cleanHandle}/followed-by-count`,
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );

    if (res.status === 404) {
      setFollowedByCount({ type: "handleNotFound" });
      return;
    }

    const body = await res.json();
    setFollowedByCount({
      type: "followedByCount",
      count: body.followedByCount,
    });
  };

  return (
    <>
      <h1 className="text-white text-2xl md:text-3xl text-center font-light mb-8">
        {t.title_following_you}
      </h1>
      <p
        className={`text-white leading-6 md:leading-none text-center font-light text-base lg:text-lg mb-14`}
      >
        {t.teaser_following_you}
      </p>
      <form className="flex justify-center" onSubmit={handleSubmit}>
        <input
          className="md:w-96 p-4 pr-32 bg-transparent border border-gray-500 rounded-full text-xs text-white"
          type="text"
          placeholder="@vitalikbuterin"
          value={handle}
          onChange={(event) => setHandle(event.target.value)}
        />
        <button
          className="md:w-32 -ml-28 md:-ml-32 px-6 text-xs text-white border border-white bg-transparent rounded-full hover:bg-gray-700"
          type="submit"
        >
          Show Me →
        </button>
      </form>
      {followedByCount.type === "empty" ? null : followedByCount.type ===
        "handleNotFound" ? (
        <p className="text-white text-xl p-8 text-center">handle not found</p>
      ) : followedByCount.type === "searching" ? (
        <p className="text-white text-xl p-8 text-center">searching...</p>
      ) : followedByCount.type === "followedByCount" ? (
        <>
          <p className="text-white text-4xl pt-8 font-bold pb-4 text-center">
            {followedByCount.count}
          </p>
          <p className="text-white text-2xl pb-8 text-center max-w-md mx-auto">
            {"🦇".repeat(followedByCount.count)}
          </p>
        </>
      ) : (
        <p>error</p>
      )}
    </>
  );
};

export default FollowingYou;
