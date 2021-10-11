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
      ? `flex-none md:flex-1 text-center md:text-left ${styles}`
      : `flex-none md:flex-1 text-center md:text-left px-3`;
  return (
    <>
      <div className={getClassName}>
        {icon && (
          <div
            className="icon-emoji text-center"
            dangerouslySetInnerHTML={{
              __html: twemoji.parse(icon),
            }}
          />
        )}
        <h1 className="text-white font-light text-base text-center mb-14 mt-4">
          <span
            className=""
            dangerouslySetInnerHTML={{
              __html: twemoji.parse(title),
            }}
          />
        </h1>
        <p
          className="text-blue-shipcove font-light text-sm break-words mt-8 whitespace-pre-line leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: twemoji.parse(text),
          }}
        />
      </div>
    </>
  );
};

export default ContentBlock;
