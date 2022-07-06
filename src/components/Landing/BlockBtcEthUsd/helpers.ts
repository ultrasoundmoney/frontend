export type graphTypes = "none" | "btc" | "eth" | "usd";
export const WINDOW_BREAK_POINT = 740;
const graphType = ["none", "btc", "eth", "usd"];

export const handleGraphs = (
  topBreakPointValue: number,
  arrayBlocksText: Element[],
  offset: number,
  setCryptoType: (val: string) => void
) => {
  for (let i = 0; i <= arrayBlocksText.length - 1; i++) {
    const topValue = arrayBlocksText[i].getBoundingClientRect().top + offset;
    if (topValue >= topBreakPointValue) {
      setCryptoType(graphType[i]);
      break;
    }
  }
};

export const setScrollPos = (
  scrollTo: graphTypes,
  graphTextBlockElem: HTMLElement
) => {
  const indexScrollElement = graphType.findIndex((el) => el === scrollTo);
  graphTextBlockElem.children[indexScrollElement].scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "center",
  });
};

export const ORANGE_COLOR = "#FF891D";
export const BLUE_COLOR = "#5474F4";
export const GREEN_COLOR = "#A3D972";
export const SMALL_OPACITY = "0.1";
export const onHoverFunctionality = (
  e: React.MouseEvent<SVGPathElement | SVGUseElement>,
  ethPathRefEl: SVGPathElement,
  usdPathRefEl: SVGPathElement,
  btcPathRefEl: SVGPathElement,
  setHoverElem: (val: string | null) => void
) => {
  if (e.type === "mouseout") {
    btcPathRefEl.style.strokeDashoffset = "900";
    ethPathRefEl.style.strokeDashoffset = "900";
    usdPathRefEl.style.strokeDashoffset = "900";
    setHoverElem(null);
  } else {
    const elem = e.target as HTMLInputElement;
    const hoverElem: string | undefined = elem.dataset.graph;
    if (hoverElem === "btc") {
      btcPathRefEl.style.strokeDashoffset = "410";
      setHoverElem("btc");
    } else if (hoverElem === "eth") {
      ethPathRefEl.style.strokeDashoffset = "455";
      setHoverElem("eth");
    } else {
      usdPathRefEl.style.strokeDashoffset = "455";
      setHoverElem("usd");
    }
  }
};

export const onSvgMouseOut = (
  ethPathRefEl: SVGPathElement,
  usdPathRefEl: SVGPathElement,
  btcPathRefEl: SVGPathElement,
  setHoverElem: (val: string | null) => void
) => {
  btcPathRefEl.style.strokeDashoffset = "900";
  ethPathRefEl.style.strokeDashoffset = "900";
  usdPathRefEl.style.strokeDashoffset = "900";
  setHoverElem(null);
};
