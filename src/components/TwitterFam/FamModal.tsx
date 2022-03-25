import { CSSProperties, FC, LegacyRef, ReactEventHandler } from "react";
import Skeleton from "react-loading-skeleton";
import {
  FamProfile,
  LinkableCashtag,
  LinkableHashtag,
  LinkableMention,
  Linkables,
  LinkableUrl,
} from "../../api/fam";
import * as Format from "../../format";
import { useActiveBreakpoint } from "../../utils/use-active-breakpoint";
import Twemoji from "../Twemoji";
import styles from "./FamModal.module.scss";

const imageErrorHandler: ReactEventHandler<HTMLImageElement> = (e) => {
  const el = e.currentTarget;
  el.onerror = null;
  el.src = "/avatar.svg";
};

type Text = { type: "text"; text: string[] };
type Url = { type: "url"; linkable: LinkableUrl };
type Hashtag = { type: "hashtag"; linkable: LinkableHashtag };
type Cashtag = { type: "cashtag"; linkable: LinkableCashtag };
type Mention = { type: "mention"; linkable: LinkableMention };

type BioElement = Text | Url | Hashtag | Cashtag | Mention;

const getSortedLinkables = (linkables: Linkables) => {
  const urlLinkables =
    linkables.urls?.map((linkable) => ({
      ...linkable,
      type: "url" as const,
    })) ?? [];
  const mentionLinkables =
    linkables.mentions?.map((linkable) => ({
      ...linkable,
      type: "mention" as const,
    })) ?? [];
  const hashtagLinkables =
    linkables.hashtags?.map((linkable) => ({
      ...linkable,
      type: "hashtag" as const,
    })) ?? [];
  const cashtagLinkables =
    linkables.cashtags?.map((linkable) => ({
      ...linkable,
      type: "cashtag" as const,
    })) ?? [];
  return [
    ...urlLinkables,
    ...mentionLinkables,
    ...hashtagLinkables,
    ...cashtagLinkables,
  ].sort((l1, l2) => (l1.start < l2.start ? -1 : 1));
};

const buildBioElements = (bio: string, linkables: Linkables) => {
  // Linkable indices appear to assume a list of code points not UTF code units which JS uses by default.
  const bioCodePoints = Array.from(bio);

  const sortedLinkables = getSortedLinkables(linkables);

  const bioElements: BioElement[] = [];

  let lastEndIndex = 0;
  for (const linkable of sortedLinkables) {
    const text = bioCodePoints.slice(lastEndIndex, linkable.start);
    bioElements.push({ type: "text", text });
    bioElements.push({ type: linkable.type, linkable } as BioElement);
    lastEndIndex = linkable.end;
  }
  if (lastEndIndex !== bioCodePoints.length - 1) {
    bioElements.push({
      type: "text",
      text: bioCodePoints.slice(lastEndIndex ?? 0),
    });
  }

  return bioElements;
};

const BioWithLinkables: FC<{ bio: string; linkables: Linkables }> = ({
  bio,
  linkables,
}) => {
  const bioElements = buildBioElements(bio, linkables);

  return (
    <>
      {bioElements.map((instruction, index) =>
        instruction.type === "text" ? (
          <p className="inline" key={index}>
            {instruction.text.join("")}
          </p>
        ) : instruction.type === "url" ? (
          <a
            href={instruction.linkable.expanded_url}
            key={index}
            rel="noreferrer"
            target="_blank"
          >
            {instruction.linkable.display_url}
          </a>
        ) : instruction.type === "mention" ? (
          <a
            href={`https://twitter.com/${instruction.linkable.username}`}
            key={index}
            rel="noreferrer"
            target="_blank"
          >
            @{instruction.linkable.username}
          </a>
        ) : instruction.type === "hashtag" ? (
          <a
            href={`https://twitter.com/hashtag/${instruction.linkable.tag}`}
            key={index}
            rel="noreferrer"
            target="_blank"
          >
            #{instruction.linkable.tag}
          </a>
        ) : instruction.type === "cashtag" ? (
          <a
            href={`https://twitter.com/search?q=%24${instruction.linkable.tag}`}
            key={index}
            rel="noreferrer"
            target="_blank"
          >
            ${instruction.linkable.tag}
          </a>
        ) : null,
      )}
    </>
  );
};

export const FamModalContent: FC<{
  profile: FamProfile | undefined;
  onClickClose?: () => void;
  ref?: LegacyRef<HTMLDivElement> | undefined;
  style?: CSSProperties;
  onHovering?: (hovering: boolean) => void;
}> = ({ profile, onClickClose, onHovering, ref, style }) => {
  if (profile === undefined) {
    return null;
  }

  return (
    <div
      className={`rounded-lg bg-blue-tangaroa text-white px-7 py-7 z-10 flex flex-col drop-shadow-xl w-[20rem] mx-auto gap-y-4`}
      onClick={(e) => {
        e.stopPropagation();
      }}
      ref={ref}
      style={style}
      onMouseEnter={() =>
        onHovering !== undefined ? onHovering(true) : undefined
      }
      onMouseLeave={() =>
        onHovering !== undefined ? onHovering(false) : undefined
      }
    >
      <div className="flex justify-between">
        <img
          className="rounded-full"
          width="80"
          height="80"
          src={
            profile?.profileImageUrl != undefined
              ? profile.profileImageUrl
              : "/avatar.svg"
          }
          alt={profile?.name}
          onError={imageErrorHandler}
        />
        <img
          className={`self-start ${
            onClickClose === undefined ? "hidden" : "block"
          }`}
          src="/close-icon.svg"
          width="30"
          alt="close icon"
          onClick={onClickClose}
        />
      </div>
      <Twemoji>
        <div
          className={`text-white text-base font-medium break-words ${styles.profileText}`}
        >
          {profile.name}
        </div>
      </Twemoji>
      <p
        className={`text-blue-linkwater text-left mb-3 font-light text-xs break-words max-w-xs ${styles.profileText}`}
      >
        {profile.bio === undefined ? null : profile.links === undefined ? (
          <Twemoji>{profile.bio}</Twemoji>
        ) : (
          <Twemoji>
            <BioWithLinkables bio={profile.bio} linkables={profile.links} />
          </Twemoji>
        )}
      </p>
      <div className="flex justify-between">
        <div>
          <p className="text-xs text-blue-spindle text-left font-light uppercase mb-0">
            Followers
          </p>
          <p className="text-white text-left font-light text-2xl">
            {profile === undefined ? (
              <Skeleton inline={true} width="4rem" />
            ) : (
              Format.followerCountConvert(profile.followersCount)
            )}
          </p>
        </div>
        <div>
          <p className="text-xs text-blue-spindle text-left font-light uppercase mb-0">
            fam followers
          </p>
          <p className="text-white text-left font-light text-2xl">
            {profile === undefined ? (
              <Skeleton inline width="4rem" />
            ) : (
              Format.followerCountConvert(profile.famFollowerCount)
            )}
          </p>
        </div>
      </div>
      <a
        className="bg-blue-highlightbg p-3 rounded-full text-sm m-auto"
        target="_blank"
        href={profile?.profileUrl || undefined}
        rel="noopener noreferrer"
        role="link"
      >
        view on{" "}
        <img className="inline" src="/twitter-icon.svg" alt="twitter icon" />
      </a>
    </div>
  );
};

export const FamModal: FC<{
  onClickBackground: () => void;
  show: boolean;
}> = ({ children, onClickBackground, show }) => {
  const { md } = useActiveBreakpoint();

  return (
    <div
      className={`fixed top-0 bottom-0 left-0 w-full flex items-center z-10 ${
        show && !md ? "visible" : "invisible"
      }`}
      style={{
        backgroundColor: "rgba(49, 58, 85, 0.6)",
      }}
      onClick={onClickBackground}
    >
      {children}
    </div>
  );
};
