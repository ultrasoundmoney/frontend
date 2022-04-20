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
