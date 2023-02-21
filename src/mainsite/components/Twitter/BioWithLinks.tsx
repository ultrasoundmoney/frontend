import type { FC } from "react";
import twemoji from "twemoji";
import type {
  LinkableCashtag,
  LinkableHashtag,
  LinkableMention,
  Linkables,
  LinkableUrl,
} from "../../api/profiles";

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
  if (lastEndIndex !== bioCodePoints.length) {
    bioElements.push({
      type: "text",
      text: bioCodePoints.slice(lastEndIndex ?? 0),
    });
  }

  return bioElements;
};

// NOTE: using twemoji in the more safe dom parsing mode together with rapidly created and destroyed content resulted in crashes where somehow nodes from destroyed content would end up in newly created content, presumably because twemoji was keeping refs and directly updating the DOM. This would cause react to run into problems when trying in turn to update the DOM that had now changed out from under it. Using twemoji's string parsing mode seems to alleviate the issue.
const insertTwemoji = (str: string) =>
  twemoji.parse(str, { className: "inline-block align-middle w-5 mb-1 ml-1" });

const BioWithLinks: FC<{ bio: string; linkables: Linkables }> = ({
  bio,
  linkables,
}) => {
  return (
    <p>
      {buildBioElements(bio, linkables).map((instruction, index) =>
        instruction.type === "text" ? (
          <span
            dangerouslySetInnerHTML={{
              __html: insertTwemoji(instruction.text.join("")),
            }}
            key={index}
          ></span>
        ) : instruction.type === "url" ? (
          <a
            className="text-slateus-200 hover:text-slateus-200 hover:underline"
            href={instruction.linkable.expanded_url}
            key={index}
            rel="noreferrer"
            target="_blank"
          >
            {instruction.linkable.display_url}
          </a>
        ) : instruction.type === "mention" ? (
          <a
            className="text-slateus-200 hover:text-slateus-200 hover:underline"
            href={`https://twitter.com/${instruction.linkable.username}`}
            key={index}
            rel="noreferrer"
            target="_blank"
          >
            @{instruction.linkable.username}
          </a>
        ) : instruction.type === "hashtag" ? (
          <a
            className="text-slateus-200 hover:text-slateus-200 hover:underline"
            href={`https://twitter.com/hashtag/${instruction.linkable.tag}`}
            key={index}
            rel="noreferrer"
            target="_blank"
          >
            #{instruction.linkable.tag}
          </a>
        ) : instruction.type === "cashtag" ? (
          <a
            className="text-slateus-200 hover:text-slateus-200 hover:underline"
            href={`https://twitter.com/search?q=%24${instruction.linkable.tag}`}
            key={index}
            rel="noreferrer"
            target="_blank"
          >
            ${instruction.linkable.tag}
          </a>
        ) : null,
      )}
    </p>
  );
};

export default BioWithLinks;
