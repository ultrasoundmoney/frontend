import React, {
  Children,
  createRef,
  FC,
  ReactHTML,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import twemoji from "twemoji";

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
  const childRefs =
    typeof children === "string" || typeof children === "number"
      ? [createRef<HTMLElement>()]
      : !Array.isArray(children)
      ? [createRef<HTMLElement>()]
      : children.map(() => createRef<HTMLElement>());
  const refList = useRef(childRefs);

  useEffect(() => {
    if (refList.current === null) {
      return;
    }

    refList.current.map((childRef) => {
      if (childRef.current === null) {
        return;
      }

      twemoji.parse(childRef.current, {
        className: imageClassName,
        ext: ".svg",
        folder: "svg",
      });
    });
  }, [children, imageClassName, refList]);

  return children === undefined ? null : wrapper ? (
    React.createElement(tag, { ref: refList.current[0], className }, children)
  ) : (
    <>
      {Children.map(children, (child, index) => {
        if (child === undefined) {
          return null;
        }

        if (child === "string") {
          console.warn(
            "Twemoji can't parse plain strings, and strings are passed with noWrapper set. Wrap them or drop noWrapper",
          );
          return child;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
        return React.cloneElement(child as any, {
          ref: refList.current[index],
        });
      })}
    </>
  );
};

export default Twemoji;
