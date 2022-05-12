const OFFSET_TO_SCROLL = 48;
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
  graphBlockElem: HTMLElement,
  graphTextBlockElem: HTMLElement,
  index: number
) => {
  const firstParent = graphBlockElem.parentNode!;
  const topParent = firstParent.parentNode!;
  const upBlockHeight = firstParent.children[0].getBoundingClientRect().height;
  const childrenArray = Array.from(topParent.children);
  let heightToPoint =
    window.innerWidth <= WINDOW_BREAK_POINT
      ? upBlockHeight
      : upBlockHeight - OFFSET_TO_SCROLL;
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
