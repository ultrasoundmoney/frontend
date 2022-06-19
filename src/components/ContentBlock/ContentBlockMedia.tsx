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
    <div className="flex flex-col justify-center mb-8">
      {img !== null && img != undefined && (
        <img
          className="text-left mr-auto mb-6"
          src={
            img !== null && img != undefined
              ? img
              : (AvatarImg as unknown as string)
          }
          alt={title}
        />
      )}
      <h1
        className="text-white font-light text-base md:text-2xl leading-normal text-center md:text-left mb-6 leading-title"
        dangerouslySetInnerHTML={{
          __html: title,
        }}
      />
      <p
        className="text-blue-shipcove font-light text-sm mb-10 text-center md:text-left"
        dangerouslySetInnerHTML={{
          __html: text,
        }}
      />
    </div>
  );
};

export default ContentBlockMedia;
