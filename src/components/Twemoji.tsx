import React, {
  Children,
  FC,
  ReactHTML,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import twemoji from "twemoji";

const parseChild = (
  child: HTMLElement,
  imageClassName: HTMLImageElement["className"] | undefined,
) => {
  twemoji.parse(child, {
    className: imageClassName,
    ext: ".svg",
    folder: "svg",
  });
};

const Twemoji: FC<{
  children: ReactNode;
  className?: HTMLDivElement["className"];
  imageClassName?: HTMLImageElement["className"];
  wrapper?: boolean;
  tag?: keyof ReactHTML;
}> = ({
  children,
  className,
  imageClassName,
  wrapper = false,
  tag = "div",
}) => {
  const wrapperRef = useRef<HTMLElement>(null);
  const refList = useRef<HTMLElement[]>([]);

  useEffect(() => {
    refList.current.map((childRef) => {
      parseChild(childRef, imageClassName);
    });
  }, [children, imageClassName, refList]);

  useEffect(() => {
    if (wrapperRef.current === null) {
      return;
    }

    parseChild(wrapperRef.current, imageClassName);
  }, [children, wrapperRef, imageClassName]);

  return children == null ? null : wrapper ? (
    React.createElement(tag, { ref: wrapperRef, className }, children)
  ) : (
    <>
      {Children.map(children, (child, index) => {
        if (child == null) {
          return null;
        }

        if (child === "string") {
          console.warn(
            "Twemoji can't parse plain strings, and strings are passed with wrapper set. Wrap them or add 'wrapper'",
          );
          return child;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
        return React.cloneElement(child as any, {
          ref: (ref: HTMLElement) => {
            refList.current[index] = ref;
          },
        });
      })}
    </>
  );
};

export default Twemoji;
