type graphTypes = "none" | "btc" | "eth" | "usd";
export default graphTypes;
export const WINDOW_BREAK_POINT = 1024;
const graphType = ["none", "btc", "usd", "eth"];

export const handleGraphs = (
  graphsBlock: HTMLDivElement | null,
  arrayBlocksText: Element[],
  setCryptoType: (val: string) => void,
) => {
  if (graphsBlock) {
    for (let i = arrayBlocksText.length; i--; ) {
      //take value top of title
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const block = arrayBlocksText[i]!;
      const bottomBlock = block.getBoundingClientRect().bottom;

      const trigger =
        window.innerWidth > WINDOW_BREAK_POINT
          ? bottomBlock - block.clientHeight / 2
          : bottomBlock - block.clientHeight;
      const bottomGraphsBlock = graphsBlock.getBoundingClientRect().bottom;
      if (trigger < bottomGraphsBlock) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        setCryptoType(graphType[i]!);
        break;
      }
    }
  }
};

export const setScrollPos = (
  scrollTo: graphTypes,
  graphTextBlockElem: HTMLElement,
) => {
  const indexScrollElement = graphType.findIndex((el) => el === scrollTo);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  graphTextBlockElem.children[indexScrollElement]!.scrollIntoView({
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
  setHoverElem: (val: string | null) => void,
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
      setHoverElem("btc");
    } else if (hoverElem === "eth") {
      setHoverElem("eth");
    } else {
      setHoverElem("usd");
    }
  }
};

export const onSvgMouseOut = (
  ethPathRefEl: SVGPathElement,
  usdPathRefEl: SVGPathElement,
  btcPathRefEl: SVGPathElement,
  setHoverElem: (val: string | null) => void,
) => {
  btcPathRefEl.style.strokeDashoffset = "900";
  ethPathRefEl.style.strokeDashoffset = "900";
  usdPathRefEl.style.strokeDashoffset = "900";
  setHoverElem(null);
};
