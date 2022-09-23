import type { FC, ReactHTML, ReactNode } from "react";
import React, { Children, useEffect, useRef, useState } from "react";
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
  className = "",
  imageClassName,
  wrapper = false,
  tag = "div",
}) => {
  const wrapperRef = useRef<HTMLElement>(null);
  const refList = useRef<HTMLElement[]>([]);
  const [replaceDone, setReplaceDone] = useState(false);

  useEffect(() => {
    refList.current.map((childRef) => {
      parseChild(childRef, imageClassName);
    });
    setReplaceDone(true);
  }, [children, imageClassName, refList]);

  useEffect(() => {
    if (wrapperRef.current === null) {
      return;
    }

    parseChild(wrapperRef.current, imageClassName);
    setReplaceDone(true);
  }, [children, wrapperRef, imageClassName]);

  return children == null ? null : wrapper ? (
    React.createElement(
      tag,
      {
        ref: wrapperRef,
        className: `${className}${replaceDone ? "" : " invisible"}`,
      },
      children,
    )
  ) : (
    <>
      {Children.map(children, (child, index) => {
        if (child == null) {
          return null;
        }

        if (typeof child === "string") {
          console.warn(
            "Twemoji can't parse plain strings, and strings are passed with wrapper set. Wrap them or add 'wrapper'",
          );
          return child;
        }

        if (typeof child === "boolean") {
          console.warn(
            "Twemoji can't parse plain booleans, and strings are passed with wrapper set. Wrap them or add 'wrapper'",
          );
          return child;
        }

        if (typeof child === "number") {
          console.warn(
            "Twemoji can't parse plain numbers, and strings are passed with wrapper set. Wrap them or add 'wrapper'",
          );
          return child;
        }

        if (!React.isValidElement<HTMLElement>(child)) {
          console.error(
            "Twemoji can't parse invalid react element. Wrap them or add 'wrapper'",
          );
          return child;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
        return React.cloneElement(child as any, {
          ref: (ref: HTMLElement) => {
            refList.current[index] = ref;
          },
          className: `${child.props.className ?? ""}${
            replaceDone ? "" : " invisible"
          }`,
        });
      })}
    </>
  );
};

export default Twemoji;
