/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import type { StepperPoint } from "../../contexts/StepperContext";
import { calcCenterElement } from "../../utils/calcCenterElement";
import classes from "./Navigation.module.scss";

export const getIconOffset = (
  pointsHeights: StepperPoint[],
  pageLoad: boolean,
) => {
  if (!pageLoad) return 0;
  const trackPosition = window.scrollY + window.innerHeight / 2.4;
  if (pointsHeights) {
    const pointsQuantity = pointsHeights.length;
    const lastPoint = pointsHeights[pointsQuantity - 1];
    const distanceBetweenPoints = 100 / (pointsHeights.length - 1);
    let globalPercent = 0;

    if (lastPoint && trackPosition > lastPoint?.offsetY) return 100;
    for (let index = 0; index < pointsHeights.length; index++) {
      const nextPoint = pointsHeights[index + 1]?.offsetY;
      const currentPoint = pointsHeights[index]?.offsetY;
      if (
        currentPoint &&
        nextPoint &&
        trackPosition > currentPoint &&
        trackPosition < nextPoint
      ) {
        const from = trackPosition - currentPoint;
        const to = nextPoint - currentPoint;
        const percent = (from / to) * 100;
        globalPercent =
          distanceBetweenPoints * index +
          (percent * distanceBetweenPoints) / 100;
      }
    }
    return globalPercent;
  }
  return 0;
};

export const setScrollPosition = (
  controllPoints: StepperPoint[],
  trackWidth: number,
  iconOffset: number,
  stepsRefElem: HTMLElement,
): boolean => {
  const distancesNumber = controllPoints.length - 1;
  const distanceWidth = trackWidth / distancesNumber;
  const distanceOrderItem = Math.ceil(iconOffset / distanceWidth);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const parentBlock = stepsRefElem.parentElement!;
  const trackingChildrenBlock = Array.from(parentBlock.children).find(
    (elem: Element) => {
      const t = elem as HTMLElement;
      return t.dataset.navigationtrackingblock;
    },
  );

  if (trackingChildrenBlock) {
    const allTrackingChildren = Array.from(trackingChildrenBlock.children);
    const blocksHeights = allTrackingChildren.map((elem) => {
      const blockHeight = elem.getBoundingClientRect().height;
      return blockHeight;
    });
    let iconOffsetInBlock;
    if (distanceOrderItem > 1) {
      iconOffsetInBlock = iconOffset - distanceWidth * (distanceOrderItem - 1);
    } else {
      iconOffsetInBlock = iconOffset;
    }
    const percentOffsetBlock = iconOffsetInBlock / distanceWidth;
    const certainBlockHeight = blocksHeights[distanceOrderItem];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const blockYOffset = certainBlockHeight! * percentOffsetBlock;
    const drawingLineHight =
      allTrackingChildren[0]?.children[0]?.getBoundingClientRect().height;
    const offsetValue =
      controllPoints[distanceOrderItem - 1]?.offsetY! +
      blockYOffset -
      drawingLineHight!;
    offsetValue > 0 && window.scrollTo({ top: offsetValue });
    const isActiveDot =
      iconOffsetInBlock > (distanceWidth / 4) * 3 &&
      distanceOrderItem === distancesNumber;
    return isActiveDot;
  } else return false;
};

export const OFFSET_FAQ = 150;
export const showHideNavBar = (
  controlPoints: (StepperPoint | undefined)[],
  stepsRefElem: HTMLElement,
  hidingNavigationPosition: number,
) => {
  let offsetYFirstPoint = 2;
  controlPoints.forEach((el, index) => {
    if (index === 0 && typeof el?.offsetY === "number") {
      offsetYFirstPoint = el?.offsetY;
    }
  });
  const maxOffsetYValue = controlPoints.reduce(
    (acc: number, item: StepperPoint | undefined) =>
      item && acc < item.offsetY ? item.offsetY : acc,
    0,
  );
  const collectionElems = stepsRefElem?.parentElement?.children[2]?.children;

  const childrenElems = collectionElems?.length
    ? Array.from(collectionElems)
    : [];

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const lastSectionIndex: number = childrenElems.findIndex(
    (node) => node.id === "before-genesis",
  )!;
  const lastSectionHight =
    childrenElems[lastSectionIndex]?.getBoundingClientRect()?.height;
  const nextDrawingLineHight =
    childrenElems[lastSectionIndex + 1]?.getBoundingClientRect()?.height;

  if (lastSectionHight && maxOffsetYValue && nextDrawingLineHight) {
    const showStickyHeader: boolean =
      window.scrollY > offsetYFirstPoint - window.innerHeight / 2.4 &&
      window.scrollY <
        maxOffsetYValue + lastSectionHight + nextDrawingLineHight &&
      window.scrollY < hidingNavigationPosition;

    showStickyHeader
      ? stepsRefElem.classList.add(classes.active!)
      : stepsRefElem.classList.remove(classes.active!);
  }
};

export const MOBILE_VERTICAL_SCROLL_BREAK_POINT = 500;
export const setNavBarPosition = (
  horizontalNavBar: HTMLElement,
  stepperIconElem: HTMLElement,
  controlPoints: StepperPoint[],
  pageLoad: boolean,
): void => {
  const logoOffset = getIconOffset(controlPoints, pageLoad);
  horizontalNavBar.style.left = `-${logoOffset}%`;
  stepperIconElem.style.left = `${logoOffset}%`;
};
