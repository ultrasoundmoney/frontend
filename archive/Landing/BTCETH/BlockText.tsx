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
      className="flex flex-col justify-center pt-20 lg:mb-20 lg:pt-0"
      style={{ transition: "0.2s" }}
      ref={text_block}
    >
      <h1
        className="mb-6 text-center text-base font-light leading-normal text-white md:text-left md:text-2xl"
        dangerouslySetInnerHTML={{
          __html: title,
        }}
      />
      <p
        className="mb-10 text-center text-sm font-light text-slateus-400 md:text-left"
        dangerouslySetInnerHTML={{
          __html: text,
        }}
      />
    </div>
  );
};

export default BlockText;
