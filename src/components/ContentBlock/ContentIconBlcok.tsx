import Image from "next/image";
import * as React from "react";
import AvatarImg from "../../assets/avatar.webp";

type ContentBlockProps = {
  img?: string;
  title: string;
  text: string;
  children?: React.ReactNode;
  styles?: string;
};
const ContentBlock: React.FC<ContentBlockProps> = ({
  img,
  title,
  text,
  children,
  styles,
}) => {
  function imageErrorHandler(e: React.SyntheticEvent<HTMLImageElement, Event>) {
    const el = e.target as HTMLImageElement;
    el.onerror = null;
    el.src = AvatarImg as unknown as string;
  }
  const getClassName =
    styles != undefined || styles != null
      ? `flex flex-col justify-center w-full md:w-6/12 md:m-auto ${styles}`
      : `flex flex-col justify-center w-full md:w-6/12 md:m-auto`;
  return (
    <>
      <section className={getClassName}>
        {img !== null && img != undefined && (
          <picture>
            <Image
              className="text-center mx-auto mb-8"
              width="30"
              height="48"
              src={img !== null && img != undefined ? img : AvatarImg}
              alt={title}
              onError={imageErrorHandler}
            />
          </picture>
        )}
        <h1
          className="text-white font-light text-base md:text-3xl leading-normal text-center mb-6 leading-title"
          dangerouslySetInnerHTML={{
            __html: title,
          }}
        />
        <p
          className="text-blue-shipcove font-light text-sm text-center mb-10"
          dangerouslySetInnerHTML={{
            __html: text,
          }}
        />
        {children}
      </section>
    </>
  );
};

export default ContentBlock;
