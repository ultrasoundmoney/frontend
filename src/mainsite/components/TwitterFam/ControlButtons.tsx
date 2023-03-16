import type { FullScreenHandle } from "react-full-screen";

interface ControlButtonsProps {
  zoomIn: () => void;
  zoomOut: () => void;
  resetTransform: () => void;
  fullScreenHandle: FullScreenHandle;
}

const ControlButtons = ({
  zoomIn,
  zoomOut,
  resetTransform,
  fullScreenHandle,
}: ControlButtonsProps) => {
  return (
    <div
      className="grid gap-3 grid-cols-3 sm:grid-cols-4"
    >
      <button
        className={`
          flex
          select-none items-center
          border rounded-lg
          border-slateus-400
          bg-slateus-600
          px-2 py-2
        `}
        onClick={() => zoomIn()}
      >
        <span
          className="w-3 h-3 leading-[9px]"
        >
          +
        </span>
      </button>
      <button
        className={`
          flex
          select-none items-center
          border rounded-lg
          border-slateus-400
          bg-slateus-600
          px-2 py-1
        `}
        onClick={() => zoomOut()}
      >
        <span
          className="w-3 h-3 leading-[9px]"
        >
          -
        </span>
      </button>
      <button
        className={`
          flex
          select-none items-center
          border rounded-lg
          border-slateus-400
          bg-slateus-600
          px-2 py-1
        `}
        onClick={() => resetTransform()}
      >
          <img
            src={`/rotate-right.svg`}
            alt="rotate-right"
            width={12}
            height={12}
          />
      </button>
      <button
        className={`
          hidden
          sm:flex
          select-none items-center
          border rounded-lg
          border-slateus-400
          bg-slateus-600
          px-2 py-1
        `}
        onClick={fullScreenHandle.active
          ? fullScreenHandle.exit
          : fullScreenHandle.enter
        }
      >
        <img
          src={fullScreenHandle.active ? `/compress.svg` : `/expand.svg`}
          alt="expand"
          width={12}
          height={12}
        />
      </button>
    </div>
  );
};

export default ControlButtons;
