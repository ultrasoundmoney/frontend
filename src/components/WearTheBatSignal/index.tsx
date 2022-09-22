import type { StaticImageData } from "next/image";
import Image from "next/image";
import type { FC } from "react";
import { useCallback, useRef, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { millisFromSeconds } from "../../duration";
import BodyTextV2 from "../TextsNext/BodyTextV2";
import LabelText from "../TextsNext/LabelText";
import WidgetErrorBoundary from "../WidgetErrorBoundary";
import batSvg from "./bat-own.svg";
import BatSignalTooltip from "./BatSignalTooltip";
import speakerSvg from "./speaker-own.svg";

type Timeout = ReturnType<typeof setTimeout>;

const COPIED_FEEDBACK_TIMEOUT = millisFromSeconds(2);

const WearTheBatSignal: FC = () => {
  const [isCopiedFeedbackVisible, setIsCopiedFeedbackVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const timer = useRef<Timeout>();

  const handleBatSoundCopied = useCallback(() => {
    if (timer.current !== undefined) {
      return;
    }

    setIsCopiedFeedbackVisible(true);

    timer.current = setTimeout(() => {
      setIsCopiedFeedbackVisible(false);
      timer.current = undefined;
    }, COPIED_FEEDBACK_TIMEOUT);
  }, []);

  return (
    <WidgetErrorBoundary title="wear the bat signal">
      <div className="bg-slateus-700 p-8 flex flex-col gap-y-4 rounded-lg">
        <div className="flex justify-between">
          <LabelText>wear the bat signal</LabelText>

          <div
            className={`
              flex items-center
              md:justify-end
              cursor-pointer
            `}
            onClick={() => setShowTooltip(true)}
          >
            <LabelText>explain</LabelText>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-x-4">
            <Image
              alt="emoji of a bat, signifying ultrasound"
              src={batSvg as StaticImageData}
              width={40}
              height={40}
            />
            <Image
              alt="enoji of a speaker, signifying ultrasound"
              src={speakerSvg as StaticImageData}
              width={40}
              height={40}
            />
          </div>
          <CopyToClipboard text={"🦇🔊"} onCopy={handleBatSoundCopied}>
            <span className="relative flex">
              <button
                className={`
                  relative
                  w-[74px] h-fit
                  bg-gradient-to-tr from-cyan-400 to-indigo-600
                  rounded-full
                  px-4 py-2
                  md:py-1.5 md:m-0.5
                  font-light text-white
                  flex justify-center
                  group
                  select-none
                `}
              >
                <BodyTextV2 className="z-10">copy</BodyTextV2>
                <div
                  className={`
                    absolute left-[1px] right-[1px] top-[1px] bottom-[1px]
                    bg-slateus-700 rounded-full
                    group-hover:hidden
                  `}
                ></div>
              </button>
              <span
                className={`
                  absolute left-0 right-0 top-0 bottom-0
                  bg-slateus-700
                  flex justify-center items-center
                  rounded-full
                  transition-all
                  z-10
                  border border-white
                  ${
                    isCopiedFeedbackVisible
                      ? "visible opacity-100"
                      : "invisible opacity-0"
                  }
                `}
              >
                <BodyTextV2>copied!</BodyTextV2>
              </span>
            </span>
          </CopyToClipboard>
        </div>
      </div>
      <div
        className={`
          tooltip ${showTooltip ? "block" : "hidden"} fixed
          top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          min-w-[320px]
          max-w-sm
          cursor-auto
          z-30
        `}
      >
        <BatSignalTooltip onClickClose={() => setShowTooltip(false)} />
      </div>
      <div
        className={`
          fixed top-0 left-0 bottom-0 right-0
          flex justify-center items-center
          z-20
          bg-slateus-700/60
          backdrop-blur-sm
          ${showTooltip ? "" : "hidden"}
        `}
        onClick={() => setShowTooltip(false)}
      ></div>
    </WidgetErrorBoundary>
  );
};

export default WearTheBatSignal;