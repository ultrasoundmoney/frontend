import React, { ReactElement, useRef } from "react";
import { CSSTransition as _CSSTransition } from "react-transition-group";
import { CSSTransitionProps } from "react-transition-group/CSSTransition";

// We have our own CSSTransition wrapper as the library is doing deprecated things.
// See: https://github.com/reactjs/react-transition-group/issues/668

const CSSTransition = (props: CSSTransitionProps) => {
  const nodeRef = useRef(null);

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    <_CSSTransition {...props} nodeRef={nodeRef}>
      <>
        {React.Children.map(props.children, (child) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          return React.cloneElement(child as ReactElement, {
            ref: nodeRef,
          });
        })}
      </>
    </_CSSTransition>
  );
};

export default CSSTransition;
