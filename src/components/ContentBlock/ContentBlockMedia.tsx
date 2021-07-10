import * as React from "react";
import AvatarImg from "../../assets/avatar.webp";

type ContentBlockMediaProps = {
  img?: string;
  title: string;
  text: string;
};
const ContentBlockMedia: React.FC<ContentBlockMediaProps> = ({
  img,
  title,
  text,
}) => {
  return (
    <>
      {img !== null && img != undefined && (
        <img
          className="text-left mr-auto mb-6"
          src={img !== null && img != undefined ? img : AvatarImg}
          alt={title}
        />
      )}
      <h1
        className="text-white font-light text-base md:text-2xl leading-normal text-left mb-6 leading-title"
        dangerouslySetInnerHTML={{
          __html: title,
        }}
      />
      <p
        className="text-blue-shipcove font-light text-sm text-left mb-10"
        dangerouslySetInnerHTML={{
          __html: text,
        }}
      />
    </>
  );
};

export default ContentBlockMedia;
