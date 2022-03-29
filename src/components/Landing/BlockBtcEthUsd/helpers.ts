import classes from "./BlockBtcEthUsd.module.scss";

export const setRemoveOpacity = (
  btcPath: SVGPathElement,
  btcUse: SVGUseElement,
  ethPath: SVGPathElement,
  ethUse: SVGUseElement,
  usdPath: SVGPathElement,
  usdUse: SVGUseElement,
  hoverElem?: string,
  isOver?: boolean
) => {
  if (!isOver) {
    btcPath.classList.remove(classes.invisible);
    btcUse.classList.remove(classes.invisible);
    ethPath.classList.remove(classes.invisible);
    ethUse.classList.remove(classes.invisible);
    usdPath.classList.remove(classes.invisible);
    usdUse.classList.remove(classes.invisible);
  } else if (hoverElem === "btc") {
    ethPath.classList.add(classes.invisible);
    ethUse.classList.add(classes.invisible);
    usdPath.classList.add(classes.invisible);
    usdUse.classList.add(classes.invisible);
  } else if (hoverElem === "eth") {
    btcPath.classList.add(classes.invisible);
    btcUse.classList.add(classes.invisible);
    usdPath.classList.add(classes.invisible);
    usdUse.classList.add(classes.invisible);
  } else {
    btcPath.classList.add(classes.invisible);
    btcUse.classList.add(classes.invisible);
    ethPath.classList.add(classes.invisible);
    ethUse.classList.add(classes.invisible);
  }
};
