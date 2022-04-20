const GRAPH_TOP_VALUE = 250;
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
