import * as React from "react";
import twemoji from "twemoji";

type ContentBlockProps = {
  icon?: string;
  title: string;
  text: string;
  styles?: string;
};
const ContentBlock: React.FC<ContentBlockProps> = ({
  icon,
  title,
  text,
  styles,
}) => {
  const getClassName =
    styles != undefined || styles != null
      ? `flex-1 text-left ${styles}`
      : `flex-1 text-left px-3`;
  return (
    <>
      <div className={getClassName}>
        <div
          className="mb-3 icon-emoji"
          dangerouslySetInnerHTML={{
            __html: twemoji.parse(icon),
          }}
        />
        <h1
          className="text-white font-light text-base leading-loose1 mb-3"
          dangerouslySetInnerHTML={{
            __html: twemoji.parse(title),
          }}
        />
        <p
          className="text-blue-shipcove font-light text-sm break-words mb-4"
          dangerouslySetInnerHTML={{
            __html: twemoji.parse(text),
          }}
        />
      </div>
    </>
  );
};

export default ContentBlock;
