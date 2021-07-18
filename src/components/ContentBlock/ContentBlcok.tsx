import * as React from "react";
import AvatarImg from "../../assets/avatar.webp";

type ContentBlockProps = {
  img?: string;
  title: string;
  text: string;
  children?: React.ReactNode;
  styles?: string;
  id?: string;
};
const ContentBlock: React.FC<ContentBlockProps> = ({
  img,
  title,
  text,
  children,
  styles,
  id,
}) => {
  function imageErrorHandler(e: React.SyntheticEvent<HTMLImageElement, Event>) {
    const el = e.target as HTMLImageElement;
    el.onerror = null;
    el.src = AvatarImg;
  }
  const getClassName =
    styles != undefined || styles != null
      ? `flex flex-col justify-center w-full lg:w-6/12 md:m-auto px-4 md:px-8 lg:px-0 ${styles}`
      : `flex flex-col justify-center w-full lg:w-6/12 md:m-auto px-4 md:px-8 lg:px-0`;
  return (
    <>
      <section
        data-aos="fade-up"
        data-aos-anchor-placement="top-bottom"
        data-aos-offset="100"
        data-aos-delay="50"
        data-aos-duration="1000"
        data-aos-easing="ease-in-out"
        id={id}
      >
        <div className={getClassName}>
          {img !== null && img != undefined && (
            <picture>
              <img
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
        </div>
        {children}
      </section>
    </>
  );
};

export default ContentBlock;
