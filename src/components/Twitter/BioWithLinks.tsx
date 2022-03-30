import { FC } from "react";
import {
  LinkableCashtag,
  LinkableHashtag,
  LinkableMention,
  Linkables,
  LinkableUrl,
} from "../../api/fam";
import Twemoji from "../Twemoji";

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

const BioWithLinks: FC<{ bio: string; linkables: Linkables }> = ({
  bio,
  linkables,
}) => (
  <>
    {buildBioElements(bio, linkables).map((instruction, index) =>
      instruction.type === "text" ? (
        <Twemoji imageClassName="inline-block align-middle h-5 ml-1">
          <p className="inline" key={index}>
            {instruction.text.join("")}
          </p>
        </Twemoji>
      ) : instruction.type === "url" ? (
        <a
          className="text-blue-spindle hover:underline hover:text-blue-spindle"
          href={instruction.linkable.expanded_url}
          key={index}
          rel="noreferrer"
          target="_blank"
        >
          {instruction.linkable.display_url}
        </a>
      ) : instruction.type === "mention" ? (
        <a
          className="text-blue-spindle hover:underline hover:text-blue-spindle"
          href={`https://twitter.com/${instruction.linkable.username}`}
          key={index}
          rel="noreferrer"
          target="_blank"
        >
          @{instruction.linkable.username}
        </a>
      ) : instruction.type === "hashtag" ? (
        <a
          className="text-blue-spindle hover:underline hover:text-blue-spindle"
          href={`https://twitter.com/hashtag/${instruction.linkable.tag}`}
          key={index}
          rel="noreferrer"
          target="_blank"
        >
          #{instruction.linkable.tag}
        </a>
      ) : instruction.type === "cashtag" ? (
        <a
          className="text-blue-spindle hover:underline hover:text-blue-spindle"
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

export default BioWithLinks;
