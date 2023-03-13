import * as React from "react";

const StepperNavigator = () => {
  const navigatorRef = React.useRef<HTMLDivElement | null>(null);
  const [iconOffsetTop, setIconOffsetTop] = React.useState<number>(0);

  React.useEffect(() => {
    const offsetTop = navigatorRef.current?.offsetTop;
    const navigatorHeight = navigatorRef.current?.clientHeight;
    const onScroll = () => {
      if (offsetTop && navigatorHeight) {
        if (
          window.pageYOffset >= offsetTop - window.innerHeight / 2 &&
          window.pageYOffset <
            offsetTop + navigatorHeight - window.innerHeight / 2
        ) {
          // console.log(navigatorRef);
          setIconOffsetTop(
            window.pageYOffset + window.innerHeight / 2 - offsetTop,
          );
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={navigatorRef} className="relative h-96 bg-white">
      <div
        className="absolute"
        style={{
          top: `${iconOffsetTop}px`,
        }}
      >
        navigate
      </div>
    </div>
  );
};

export default StepperNavigator;
