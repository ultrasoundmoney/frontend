import React, { useEffect, useRef } from "react";

type BlockTextProps = {
  title: string;
  text: string;
};

const BlockText: React.FC<BlockTextProps> = ({ title, text }) => {
  const text_block = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const onScroll = () => {
      if (text_block.current) {
        if (window.innerWidth > 1000) {
          const currentTop = text_block.current.getBoundingClientRect().top;
          const offsetBottom = 300;
          const opacityBlock = (
            -(currentTop - window.innerHeight + offsetBottom) / 200
          ).toFixed(2);
          text_block.current.style.opacity = `${opacityBlock}`;
        } else {
          text_block.current.style.opacity = "1";
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="flex flex-col justify-center lg:mb-20 pt-20 lg:pt-0"
      style={{ transition: "0.2s" }}
      ref={text_block}
    >
      <h1
        className="text-white font-light text-base md:text-2xl leading-normal text-center md:text-left mb-6"
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

export default BlockText;
