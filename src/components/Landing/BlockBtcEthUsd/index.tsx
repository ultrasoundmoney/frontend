import { useEffect, useRef, useState, useContext, FC } from "react";
import BatImg from "../../../assets/bat.png";
import { TranslationsContext } from "../../../translations-context";
import SVGrenderText from "../BTCETH/generateText";
import DrawingLine from "../DrawingLine";
import EthSvg from "./EthSvg";
import BtcSvg from "./BtcSvg";
import UsdSvg from "./UsdSvg";
import NoneSvg from "./NoneSvg";
import CurrencyTabs from "./CurrencyTabs";

interface Obj {
  [key: string]: any;
}

const TheUltraSound: FC<{}> = () => {
  const t = useContext(TranslationsContext);
  const pointRef = useRef(null);
  const graphRef = useRef<HTMLDivElement | null>(null);
  const [cryptoType, setCryptoType] = useState<string>("none");
  const tabs = ["none", "btc", "eth", "usd"];
  let timeoutId: null | ReturnType<typeof setTimeout> = null;

  const step = useRef(0);
  const allow = useRef(true);
  const eventScroll = useRef<null | Obj>(null);
  const elPosition = useRef<number>(0);

  const changeCryptoType = (wheelEvent: Obj) => {
    const direction = wheelEvent.deltaY < 0 ? "up" : "down";
    if (!allow.current) return;
    if (direction === "up") {
      if (step.current > 0) {
        step.current = step.current - 1;
      }
    } else {
      if (step.current <= tabs.length) {
        step.current = step.current + 1;
      }
    }
    if ((step.current === 0 || step.current === 5) && graphRef.current) {
      const trigger =
        elPosition.current -
        (window.innerHeight / 2 -
          graphRef.current.getBoundingClientRect().height / 2);
      if (step.current === 0) {
        window.scrollTo(0, trigger - 52);
      } else {
        window.scrollTo(0, trigger + 102);
      }
    }

    if (tabs[step.current - 1]) {
      setCryptoType(tabs[step.current - 1]);
    }
    allow.current = false;
    timeoutId = setTimeout(() => (allow.current = true), 1500);
  };

  const onScroll = (event: Obj, important?: boolean) => {
    eventScroll.current = event;
    if (graphRef?.current) {
      const rect = graphRef.current.getBoundingClientRect();
      const trigger = window.scrollY + window.innerHeight / 2 - rect.height / 2;
      elPosition.current = window.scrollY + rect.top;
      const scrollTriggerStart =
        elPosition.current < trigger + 50 && elPosition.current > trigger - 100;
      if (scrollTriggerStart || important) {
        document.body.style.overflowY = "hidden";
        window.addEventListener("wheel", changeCryptoType);
      } else {
        document.body.style.overflowY = "scroll";
        window.removeEventListener("wheel", changeCryptoType);
      }
    }
  };

  useEffect(() => {
    const isTouchDevice = "ontouchstart" in window;

    if (!isTouchDevice) window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      timeoutId && clearTimeout(timeoutId);
    };
  }, []);

  const setSpecificTab = (currency = "none") => {
    const index = tabs.indexOf(currency);
    if (index && eventScroll.current) {
      step.current = index + 1;
      setCryptoType(tabs[step.current - 1]);
      graphRef?.current?.scrollIntoView({ block: "center" });
    }
  };

  return (
    <>
      <DrawingLine pointRef={pointRef} />
      <section
        id="enter-ultra-sound"
        className="enther-ultr-sound py-8 px-4 md:px-8 lg:px-0 relative"
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
            src={BatImg}
            className="mx-auto text-center mb-8"
          />
          {/* <video
            loop
            autoPlay
            muted
            style={{ width: "360px", margin: "0 auto 20px auto" }}
          >
            <source src="/moving_new.mp4" />
          </video> */}
          <div className="ultra-sound-text current-gradient text-2xl md:text-6xl mb-24">
            {t.eusm_section_title}
          </div>
        </div>
        <div
          id="graph_svg"
          ref={graphRef}
          className="w-full md:w-9/12 flex flex-wrap justify-center ml-auto mr-auto"
        >
          <div className="graph_text_containter w-full md:w-7/12 self-center order-2 md:order-1 md:px-20">
            <SVGrenderText typ={cryptoType} />
          </div>
          <div className="relative w-full md:w-5/12 order-1 md:order-1 mb-6 md:mb-0">
            <CurrencyTabs
              setSpecificTab={setSpecificTab}
              cryptoType={cryptoType}
            />
            {cryptoType === "eth" && <EthSvg />}
            {cryptoType === "btc" && <BtcSvg />}
            {cryptoType === "usd" && <UsdSvg />}
            {cryptoType === "none" && <NoneSvg />}
          </div>
        </div>
      </section>
    </>
  );
};

export default TheUltraSound;
