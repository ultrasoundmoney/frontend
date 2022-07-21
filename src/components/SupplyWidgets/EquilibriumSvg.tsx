import _ from "lodash";
import { FC, useEffect, useState } from "react";

export type Point = [number, number];

// How many points we generate, also our maxX.
const POINT_COUNT = 20;
// The variance in Y for each consecutive randomly generated point.
const VARIANCE = 5;

const genCurvePoints = (pointCount: number, variance: number) => {
  const points: Point[] = [[0, pointCount * 0.3]];
  for (let i = 1; i < pointCount; i++) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const [, lastPointY] = _.last(points)!;
    const randomY = lastPointY + (variance * Math.random() - variance / 2);
    const randomYClamped = _.clamp(randomY, 0, pointCount);
    points.push([i, randomYClamped]);
  }
  return points;
};

const translatePoints = (
  width: number,
  height: number,
  points: Point[],
): Point[] =>
  points.map((point) => [
    (point[0] * width) / points.length,
    // To get a (0, 0) _bottom_ left coordinate system we inverse our y-coordinates and shift the viewbox by -height.
    (point[1] * height * -1) / points.length,
  ]);

const getPointsString = (points: Point[]): string =>
  points.map((point) => point.join(",")).join(" ");

const EquilibriumGraph: FC<{
  points: Point[];
  width?: number;
  height?: number;
}> = ({ points, width = 279, height = 160 }) => {
  const [pointsData, setPointsData] = useState(
    genCurvePoints(POINT_COUNT, VARIANCE),
  );

  const translatedPoints = translatePoints(width, height, pointsData);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const lastPoint = _.last(translatedPoints)!;
  const dotX = lastPoint[0];
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const dotY = lastPoint[1];
  const pointsString = getPointsString(
    translatePoints(width, height, pointsData),
  );

  // Generate a new graph whenever we move the sliders.
  useEffect(() => {
    setPointsData(genCurvePoints(POINT_COUNT, VARIANCE));
  }, [points]);

  return (
    <svg
      fill="none"
      height={height}
      viewBox={`0 ${-height} ${width} ${height}`}
      width={width}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f_1549_1804)">
        {/* <path */}
        {/*   d="M12.3086 147.299C24.6085 103.489 61.4859 23.6687 92.9889 14.2272C130.182 3.07996 153.184 67.4882 299.727 66.6206" */}
        {/*   stroke="url(#paint0_linear_1549_1804)" */}
        {/*   strokeWidth="2" */}
        {/* /> */}
        <polyline
          points={pointsString}
          stroke="url(#paint0_linear_1549_1804)"
          strokeWidth="2"
        />
      </g>
      {/* <path */}
      {/*   d="M12.3086 147.299C24.6085 103.489 61.4859 23.6687 92.9889 14.2272C130.182 3.07996 153.184 67.4882 299.727 66.6205" */}
      {/*   stroke="url(#paint1_linear_1549_1804)" */}
      {/*   strokeWidth="2" */}
      {/*   strokeLinecap="round" */}
      {/* /> */}
      <polyline
        points={pointsString}
        stroke="url(#paint1_linear_1549_1804)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx={dotX} cy={dotY} r="9.5" fill="#5376C8" fillOpacity="0.16" />
      <circle cx={dotX} cy={dotY} r="5.5" fill="#5C69DD" opacity="0.2" />
      <circle cx={dotX} cy={dotY} r="2" fill="#5D68DD" stroke="white" />
      <defs>
        <filter
          id="filter0_f_1549_1804"
          x="0.345703"
          y="0.930176"
          width="310.387"
          height="157.639"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="5.5"
            result="effect1_foregroundBlur_1549_1804"
          />
        </filter>
        <linearGradient
          id="paint0_linear_1549_1804"
          x1="297.826"
          y1="27.678"
          x2="-30.6616"
          y2="98.7151"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6A54F4" />
          <stop offset="0.420081" stopColor="#5487F4" stopOpacity="0.926406" />
          <stop offset="0.752508" stopColor="#54C4F4" stopOpacity="0.69" />
          <stop offset="1" stopColor="#00FFFB" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1549_1804"
          x1="297.826"
          y1="27.678"
          x2="-30.6616"
          y2="98.7151"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6A54F4" />
          <stop offset="0.420081" stopColor="#5487F4" stopOpacity="0.926406" />
          <stop offset="0.752508" stopColor="#54C4F4" stopOpacity="0.69" />
          <stop offset="1" stopColor="#00FFFB" />
        </linearGradient>
      </defs>
    </svg>
  );
};
export default EquilibriumGraph;
