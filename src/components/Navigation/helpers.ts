import { StepperPoint } from "../../context/StepperContext";

export const getIconOffset = (
  pointsHeights: (StepperPoint | undefined)[],
  pageLoad: boolean
) => {
  if (!pageLoad) return 0;
  const trackPosition = window.scrollY + window.innerHeight / 2;
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

// export const getScrollPosition = (
//   pointsHeights: (StepperPoint | undefined)[],
//   pageLoad: boolean,
//   trackWidth: number,
//   iconOffset: number
// ) => {
//   if (!pageLoad) return 0;
//   const pointsNumber = trackWidth / pointsHeights.length - 1;
//   console.log("pointsNumber", pointsNumber);
//   if (pointsHeights) {
//     const globalPercent = 0;

//     return globalPercent;
//   }
//   return 0;
// };
