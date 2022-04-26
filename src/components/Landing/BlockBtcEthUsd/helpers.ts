const GRAPH_TOP_VALUE = 250;
const OFFSET_TO_SCROLL = 48;
const graphType = ["none", "btc", "eth", "usd"];

export const handleGraphs = (
  graphsBlockElem: HTMLElement,
  graphTextElem: HTMLElement,
  setCryptoType: (val: string) => void
) => {
  const graphTextElemData = graphTextElem.getBoundingClientRect();
  const textBlockToBottom = graphTextElemData.bottom;
  const textBlockToHeight = graphTextElemData.height;
  const bottomHeight = textBlockToHeight + GRAPH_TOP_VALUE;
  const heightCoeffValue = (textBlockToBottom - bottomHeight) / 2;
  if (
    textBlockToBottom > heightCoeffValue &&
    graphsBlockElem.style.position !== "sticky"
  ) {
    graphsBlockElem.style.position = "sticky";
    graphsBlockElem.style.top = GRAPH_TOP_VALUE + "px";
  }
  const textBlocksArray = Array.from(graphTextElem.children);
  for (let i = 0; i <= textBlocksArray.length - 1; i++) {
    const topValue = textBlocksArray[i].getBoundingClientRect().top;
    if (topValue >= GRAPH_TOP_VALUE) {
      setCryptoType(graphType[i]);
      break;
    }
  }
};

export const setScrollPos = (
  graphBlockElem: HTMLElement,
  graphTextBlockElem: HTMLElement,
  index: number
) => {
  const firstParent = graphBlockElem.parentNode!;
  const topParent = firstParent.parentNode!;
  const upBlockHeight = firstParent.children[0].getBoundingClientRect().height;
  const childrenArray = Array.from(topParent.children);
  let heightToPoint = upBlockHeight - OFFSET_TO_SCROLL;
  for (let i = 2; i < childrenArray.length - 1; i++) {
    if (childrenArray[i].id === "enter-ultra-sound") {
      break;
    }
    const { height } = childrenArray[i].getBoundingClientRect();
    heightToPoint += height;
  }
  if (index !== 0) {
    const textBloksArray = Array.from(graphTextBlockElem.children);
    for (let i = 0; i < index; i++) {
      const { height } = textBloksArray[i].getBoundingClientRect();
      heightToPoint += height;
    }
  }
  window.scrollTo({ top: heightToPoint });
};

export const BTC_DOT_COORDS_STATIC = ["205", "-40"];
export const BTC_DOT_COORDS_ANIM = ["-148", "-150"];
export const ETH_DOT_COORDS_STATIC = ["210", "67"];
export const ETH_DOT_COORDS_ANIM = ["-150", "-150"];
export const USD_DOT_COORDS_STATIC = ["200", "-8"];
export const USD_DOT_COORDS_ANIM = ["-150", "-150"];
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
    const elem: any = e.target;
    const hoverElem: string = elem.dataset.graph;
    if (hoverElem === "btc") {
      btcPathRefEl.style.strokeDashoffset = "0";
      setHoverElem("btc");
    } else if (hoverElem === "eth") {
      ethPathRefEl.style.strokeDashoffset = "0";
      setHoverElem("eth");
    } else {
      usdPathRefEl.style.strokeDashoffset = "0";
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
