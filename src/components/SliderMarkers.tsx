import * as DateFns from "date-fns";
import _last from "lodash/last";
import type { FC } from "react";
import { TimeFrameText } from "./Texts";
import Twemoji from "./Twemoji";
import * as Format from "../format";

export type SliderMarker = { label: string; value: number };

// Minimum percentage difference between markers to avoid overlap
const MIN_PERCENTAGE_DIFFERENCE = 5;

export const SliderMarkers: FC<{
  markerList: SliderMarker[];
  min: number;
  max: number;
}> = ({ markerList, min, max }) => {
  const range = max - min;
  const shownList = markerList.reduce((list: SliderMarker[], marker) => {
    const someConflict = list.some(
      (shownMarker) => Math.abs(shownMarker.value - marker.value) < ((max - min) * MIN_PERCENTAGE_DIFFERENCE / 100),
    );

    if (someConflict) {
      return list;
    }

    return [...list, marker];
  }, []);

  return (
    <>
      {shownList.map((marker, index) => {
        const percent = ((marker.value - min) / range) * 100;
        return (
          <div
            key={marker.label}
            className={`
              absolute top-[14px] flex
              -translate-x-1/2 flex-col items-center
            `}
            // Positions the marker along the track whilst compensating for the thumb width as the browser natively does. 7 being half the thumb width.
            style={{
              left: `calc(${percent}% - ${((percent / 100) * 2 - 1) * 7}px)`,
            }}
          >
            <div
              className={`
                -mt-0.5 w-0.5 rounded-b-full bg-slateus-200
                ${index % 2 === 0 ? "h-2" : "h-6"}
              `}
            ></div>
            <TimeFrameText className="mt-1 select-none text-slateus-200">
              <Twemoji
                className="flex gap-x-1"
                imageClassName="mt-0.5 h-3"
                wrapper
              >
                {marker.label}
              </Twemoji>
            </TimeFrameText>
          </div>
        );
      })}
    </>
  );
};
export default SliderMarkers;
