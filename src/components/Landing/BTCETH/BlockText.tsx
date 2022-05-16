import React, { useEffect, useRef } from "react";

type BlockTextProps = {
  title: string;
  text: string;
  currentScroll: number;
};

const BlockText: React.FC<BlockTextProps> = ({
  title,
  text,
  currentScroll,
}) => {
  const text_block = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (text_block.current) {
      const currentTop = text_block.current.getBoundingClientRect().top;
      const offsetBottom = 300;
      const opacityBlock = (
        -(currentTop - window.innerHeight + offsetBottom) / 200
      ).toFixed(2);
      text_block.current.style.opacity = `${opacityBlock}`;
    }
  }, [currentScroll]);

  return (
    <div
      className="flex flex-col justify-center mb-32"
      style={{ transition: "0.2s" }}
      ref={text_block}
    >
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

export default BlockText;
