import { FC, useEffect, useState } from "react";
import Clipboard from "react-clipboard.js";
import Skeleton from "react-loading-skeleton";
import { FamProfile, useProfiles } from "../../api/fam";
import * as Format from "../../format";
import SpanMoji from "../SpanMoji";
import FamAvatar from "./FamAvatar";
import { FamModal, FamModalContent } from "./FamModal";

const TwitterFam: FC = () => {
  const famCount = useProfiles()?.count;
  const profiles = useProfiles()?.profiles;
  const [selectedProfile, setSelectedProfile] = useState<FamProfile>();

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

  const currentProfiles =
    profiles === undefined
      ? (new Array(120).fill(undefined) as undefined[])
      : profiles;

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
      <div className="flex items-center justify-center">
        <p className="text-blue-shipcove md:text-lg">wear the bat signal</p>
        <div className="w-4"></div>
        <Clipboard data-clipboard-text={"🦇🔊"} onSuccess={onBatSoundCopied}>
          <span className="relative bg-blue-midnightexpress border border-gray-700 rounded-full p-2 pl-5 flex w-48 mx-auto justify-between items-center text-2xl isolate clipboard-emoji">
            <SpanMoji emoji="🦇🔊" />
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
        {currentProfiles.map((profile, index) =>
          profile === undefined ? (
            <Skeleton key={index} circle={true} height="40px" width="40" />
          ) : (
            <FamAvatar
              key={index}
              onClick={setSelectedProfile}
              profile={profile}
            />
          ),
        )}
      </div>
      <FamModal
        onClickBackground={() => setSelectedProfile(undefined)}
        show={selectedProfile !== undefined}
      >
        <FamModalContent
          onClickClose={() => setSelectedProfile(undefined)}
          profile={selectedProfile}
        ></FamModalContent>
      </FamModal>
    </>
  );
};

export default TwitterFam;
