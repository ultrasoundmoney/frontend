import type { FC } from "react";
import { useEffect, useRef, useState, useContext } from "react";
import BatImg from "../../../assets/bat.png";
import { TranslationsContext } from "../../../translations-context";
import SVGrenderText from "../BTCETH/generateText";
import DrawingLine from "../DrawingLine";
import Graphics from "./Graphics";
import CurrencyTabs from "./CurrencyTabs";
import { handleGraphs, setScrollPos } from "./helpers";
import classes from "./BlockBtcEthUsd.module.scss";
import type { graphTypes } from "./helpers";
import { WINDOW_BREAK_POINT } from "./helpers";
import styles from "../Landing.module.scss";

const TheUltraSound: FC = () => {
  const t = useContext(TranslationsContext);
  const pointRef = useRef(null);
  const graphRef = useRef<HTMLDivElement | null>(null);
  const graphsBlockRef = useRef<HTMLDivElement | null>(null);
  const graphTextRef = useRef<HTMLDivElement | null>(null);
  const [cryptoType, setCryptoType] = useState<string>("none");
  const GRAPH_TOP_VALUE = 200;
  const GRAPH_TOP_MOBILE_VALUE = 100;

  const setTextBlicksHeights = () => {
    const graphBlockHeight =
      graphsBlockRef.current?.getBoundingClientRect().height;
    if (graphTextRef.current) {
      const blocks = graphTextRef.current.children;
      if (window.innerWidth <= 1000) {
        for (let i = 0; i <= blocks.length - 1; i++) {
          const el = blocks[i] as HTMLDivElement;
          el.style.minHeight = "auto";
        }
      } else {
        for (let i = 0; i <= blocks.length - 1; i++) {
          const el = blocks[i] as HTMLDivElement;
          el.style.minHeight = `${graphBlockHeight ? graphBlockHeight : 0}px`;
        }
      }
    }
  };

  useEffect(() => {
    if (!graphsBlockRef.current || !graphTextRef.current) return;
    const offset = window.innerWidth * 0.2;
    const topBreakPointValue: number =
      window.innerWidth <= WINDOW_BREAK_POINT
        ? GRAPH_TOP_MOBILE_VALUE +
          graphsBlockRef.current.getBoundingClientRect().height
        : GRAPH_TOP_VALUE;
    const textBlocksArray = Array.from(graphTextRef.current.children);
    const onScroll = () => {
      if (graphTextRef.current) {
        handleGraphs(
          topBreakPointValue,
          textBlocksArray,
          offset,
          setCryptoType,
        );
      }
    };
    window.addEventListener("scroll", onScroll);
    setTextBlicksHeights();
    window.addEventListener("resize", setTextBlicksHeights);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", setTextBlicksHeights);
    };
  }, [graphsBlockRef.current, graphTextRef.current]);

  const setSpecificTab = (currency: graphTypes = "none") => {
    if (graphTextRef.current) {
      setScrollPos(currency, graphTextRef.current);
    }
  };

  return (
    <>
      <DrawingLine pointRef={pointRef} />
      <section
        id="enter-ultra-sound"
        className="py-8 px-4 md:px-8 lg:px-0 relative"
      >
        <div className="block pt-16 relative">
          <img
            data-aos="fade-up"
            data-aos-anchor-placement="top-center"
            data-aos-delay="50"
            data-aos-duration="1000"
            data-aos-easing="ease-in-out"
            title={t.eusm_section_title}
            alt={t.eusm_section_title}
            src={BatImg.src}
            className="mx-auto text-center mb-8"
          />
          <div
            className={`${styles.ultraSoundText} ${styles.currentGradient} text-2xl md:text-6xl mb-24`}
          >
            {t.eusm_section_title}
          </div>
        </div>
        <div
          id="graph_svg"
          ref={graphRef}
          className="w-full md:w-5/6 flex flex-wrap align-start justify-between ml-auto mr-auto"
        >
          <div
            ref={graphTextRef}
            className={`${classes.graphTextContainter} w-5/12 self-center order-1`}
          >
            <SVGrenderText />
          </div>
          <div
            className={`${classes.graphsBlock} w-5/12 order-1 mb-6 md:mb-0`}
            ref={graphsBlockRef}
          >
            <CurrencyTabs
              setSpecificTab={setSpecificTab}
              cryptoType={cryptoType}
            />
            <Graphics setSpecificTab={setSpecificTab} cryptoType={cryptoType} />
          </div>
        </div>
      </section>
    </>
  );
};

export default TheUltraSound;
