import * as React from "react";
import twemoji from "twemoji";

type ContentBlockProps = {
  icon?: string;
  title: string;
  text: string;
  styles?: string;
  textAlign?:
    | "left"
    | "right"
    | "center"
    | "justify"
    | "start"
    | "end"
    | "match-parent";
};
const ContentBlock: React.FC<ContentBlockProps> = ({
  icon,
  title,
  text,
  styles,
  textAlign,
}) => {
  const getClassName =
    styles != undefined || styles != null
      ? `flex-none md:flex-1 text-${
          textAlign || "center"
        } md:text-left ${styles}`
      : `flex-none md:flex-1 text-${textAlign || "center"} md:text-left px-3`;
  return (
    <>
      <div className={getClassName}>
        {icon && (
          <div
            className={`icon-emoji text-${textAlign || "center"}`}
            dangerouslySetInnerHTML={{
              __html: String(twemoji.parse(icon)),
            }}
          />
        )}
        <h1
          className={`text-white font-light text-base text-${
            textAlign || "center"
          } mb-4 mt-4`}
        >
          <span
            className=""
            dangerouslySetInnerHTML={{
              __html: String(twemoji.parse(title)),
            }}
          />
        </h1>
        <p
          className={`text-blue-shipcove font-light text-${
            textAlign || "center"
          } text-sm break-words mt-4 whitespace-pre-line leading-relaxed`}
          dangerouslySetInnerHTML={{
            __html: String(twemoji.parse(text)),
          }}
        />
      </div>
    </>
  );
};

export default ContentBlock;
