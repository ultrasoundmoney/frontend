import type { FC } from "react";
import { useEffect, useRef, useState, useContext } from "react";
import BatImg from "../../../assets/bat.png";
import TranslationsContext from "../../../contexts/TranslationsContext";
import SVGrenderText from "../BTCETH/generateText";
import DrawingLine from "../DrawingLine";
import Graphics from "./Graphics";
import CurrencyTabs from "./CurrencyTabs";
import { handleGraphs, setScrollPos, WINDOW_BREAK_POINT } from "./helpers";
import classes from "./BlockBtcEthUsd.module.scss";
import type graphTypes from "./helpers";
import styles from "../Landing.module.scss";

const TheUltraSound: FC = () => {
  const t = useContext(TranslationsContext);
  const pointRef = useRef(null);
  const graphRef = useRef<HTMLDivElement | null>(null);
  const graphsBlockRef = useRef<HTMLDivElement | null>(null);
  const graphTextRef = useRef<HTMLDivElement | null>(null);
  const [cryptoType, setCryptoType] = useState<string>("none");

  const setTextBlicksHeights = () => {
    //center the graph
    if (graphsBlockRef.current) {
      const topGraph =
        window.innerHeight / 2 - graphsBlockRef.current.clientHeight / 2;
      graphsBlockRef.current.style.top = `${topGraph}px`;
    }

    const graphBlockHeight =
      graphsBlockRef.current?.getBoundingClientRect().height;
    if (graphTextRef.current) {
      const blocks = graphTextRef.current.children;
      if (window.innerWidth <= WINDOW_BREAK_POINT) {
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
    const textBlocksArray = Array.from(graphTextRef.current.children);
    const onScroll = () => {
      if (graphTextRef.current) {
        handleGraphs(graphsBlockRef.current, textBlocksArray, setCryptoType);
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
        className="relative py-8 px-4 md:px-8 lg:px-0"
      >
        <div className="relative block pt-16">
          <img
            data-aos="fade-up"
            data-aos-anchor-placement="top-center"
            data-aos-delay="50"
            data-aos-duration="1000"
            data-aos-easing="ease-in-out"
            title={t.eusm_section_title}
            alt={t.eusm_section_title}
            src={BatImg.src}
            className="mx-auto mb-8 text-center"
          />
          <div
            className={`${styles.ultraSoundText} ${styles.currentGradient} mb-24 text-2xl md:text-6xl`}
          >
            {t.eusm_section_title}
          </div>
        </div>
        <div
          id="graph_svg"
          ref={graphRef}
          className="align-start ml-auto mr-auto flex w-full flex-wrap justify-between md:w-5/6"
        >
          <div
            ref={graphTextRef}
            className={`${classes.graphTextContainter} order-1 w-5/12 self-center`}
          >
            <SVGrenderText />
          </div>
          <div
            className={`${classes.graphsBlock} order-1 mb-6 w-5/12 md:mb-0`}
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
