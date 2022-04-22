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

export const ORANGE_COLOR = "#FF891D";
export const BLUE_COLOR = "#5474F4";
export const GREEN_COLOR = "#A3D972";
export const SMALL_OPACITY = "0.1";

export const onHoverFunctionality = (
  e: React.MouseEvent<SVGPathElement | SVGUseElement>,
  ethPathRefEl: SVGPathElement,
  ethUseRefEl: SVGUseElement,
  usdPathRefEl: SVGPathElement,
  usdUseRefEl: SVGUseElement,
  btcPathRefEl: SVGPathElement,
  btcUseRefEl: SVGUseElement,
  setHoverElem: (val: string | null) => void
) => {
  if (e.type === "mouseout") {
    btcPathRefEl.style.stroke = "url(#btc_g)";
    btcPathRefEl.style.opacity = "1";
    btcUseRefEl.style.display = "block";
    ethPathRefEl.style.stroke = "url(#paint0_linear)";
    ethPathRefEl.style.opacity = "1";
    ethUseRefEl.style.display = "block";
    usdPathRefEl.style.stroke = "url(#usd_gDefault)";
    usdPathRefEl.style.opacity = "1";
    usdUseRefEl.style.display = "block";
    setHoverElem(null);
  } else {
    const elem: any = e.target;
    const hoverElem: string = elem.dataset.graph;
    if (hoverElem === "btc") {
      ethPathRefEl.style.stroke = BLUE_COLOR;
      ethPathRefEl.style.opacity = SMALL_OPACITY;
      ethUseRefEl.style.display = "none";
      usdPathRefEl.style.stroke = GREEN_COLOR;
      usdPathRefEl.style.opacity = SMALL_OPACITY;
      usdUseRefEl.style.display = "none";
      setHoverElem("btc");
    } else if (hoverElem === "eth") {
      btcPathRefEl.style.stroke = ORANGE_COLOR;
      btcPathRefEl.style.opacity = SMALL_OPACITY;
      btcUseRefEl.style.display = "none";
      usdPathRefEl.style.stroke = GREEN_COLOR;
      usdPathRefEl.style.opacity = SMALL_OPACITY;
      usdUseRefEl.style.display = "none";
      setHoverElem("eth");
    } else {
      ethPathRefEl.style.stroke = BLUE_COLOR;
      ethPathRefEl.style.opacity = SMALL_OPACITY;
      ethUseRefEl.style.display = "none";
      btcPathRefEl.style.stroke = ORANGE_COLOR;
      btcPathRefEl.style.opacity = SMALL_OPACITY;
      btcUseRefEl.style.display = "none";
      setHoverElem("usd");
    }
  }
};
