import React, { useRef, useState } from "react";
import classes from "./BlockBtcEthUsd.module.scss";
import type graphTypes from "./helpers";
import { onHoverFunctionality, onSvgMouseOut } from "./helpers";

type NoneSvgProps = {
  setSpecificTab: (val: graphTypes) => void;
  cryptoType: string;
};

const NoneSvg: React.FC<NoneSvgProps> = ({ setSpecificTab, cryptoType }) => {
  const btcPathRef = useRef<SVGPathElement>(null);
  const btcPathRefMore = useRef<SVGPathElement>(null);
  const btcUseRef = useRef<SVGUseElement>(null);
  const ethPathRef = useRef<SVGPathElement>(null);
  const ethPathRefMore = useRef<SVGPathElement>(null);
  const ethUseRef = useRef<SVGUseElement>(null);
  const usdPathRef = useRef<SVGPathElement>(null);
  const usdPathRefMore = useRef<SVGPathElement>(null);
  const usdUseRef = useRef<SVGUseElement>(null);
  const [hoverElem, setHoverElem] = useState<string | null>(null);

  const onHoverhandler = (
    e: React.MouseEvent<SVGPathElement | SVGUseElement>,
  ): void => {
    if (ethPathRef.current && usdPathRef.current && btcPathRef.current) {
      onHoverFunctionality(
        e,
        ethPathRef.current,
        usdPathRef.current,
        btcPathRef.current,
        setHoverElem,
      );
    }
  };

  // this handler we added here to provide fading out the all graphs,
  // when mouse moves out of graph - it was noticed before,
  // that in some cases it didn't work and some graph stayed beeing highlighted
  const onSvgMouseOutHandler = () => {
    if (ethPathRef.current && usdPathRef.current && btcPathRef.current) {
      onSvgMouseOut(
        ethPathRef.current,
        usdPathRef.current,
        btcPathRef.current,
        setHoverElem,
      );
    }
  };
  const onGraphClickHandler = (
    e: React.MouseEvent<SVGPathElement | SVGUseElement>,
  ) => {
    const elem = e.target as HTMLInputElement;
    const correctSpecificTab = (str: string) => {
      switch (str) {
        case "btc":
          setSpecificTab("btc");
          break;
        case "eth":
          setSpecificTab("eth");
          break;
        case "usd":
          setSpecificTab("usd");
          break;
        default:
          setSpecificTab("none");
          break;
      }
    };
    if (elem?.dataset?.graph && typeof elem.dataset.graph === "string") {
      correctSpecificTab(elem.dataset.graph);
    }
  };

  return (
    <svg
      className="overflow-visible"
      viewBox="0 0 435 394"
      fill="none"
      onMouseOut={onSvgMouseOutHandler}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 5.96046e-08V0.5H1V0L0 5.96046e-08ZM0 3.5V4.5H1L1 3.5H0ZM0 7.5V8.5H1V7.5H0ZM0 11.5V12.5H1L1 11.5H0ZM0 15.5V16.5H1V15.5H0ZM0 19.5V20.5H1L1 19.5H0ZM0 23.5V24.5H1V23.5H0ZM0 27.5V28.5H1V27.5H0ZM0 31.5V32.5H1V31.5L0 31.5ZM0 35.5V36.5H1V35.5H0ZM0 39.5V40.5H1L1 39.5H0ZM0 43.5L1.94515e-06 44.5H1V43.5H0ZM2.07629e-06 47.5L2.12e-06 48.5H1L1 47.5H2.07629e-06ZM2.25114e-06 51.5L2.29485e-06 52.5H1V51.5H2.25114e-06ZM2.42598e-06 55.5L2.46969e-06 56.5H1L1 55.5H2.42598e-06ZM2.60083e-06 59.5L2.64454e-06 60.5H1V59.5H2.60083e-06ZM2.77568e-06 63.5L2.81938e-06 64.5H1L1 63.5H2.77568e-06ZM2.95052e-06 67.5L2.99423e-06 68.5H1V67.5H2.95052e-06ZM3.12537e-06 71.5L3.16907e-06 72.5H1L1 71.5H3.12537e-06ZM3.30021e-06 75.5L3.34392e-06 76.5H1V75.5H3.30021e-06ZM3.47506e-06 79.5L3.51877e-06 80.5H1L1 79.5H3.47506e-06ZM3.6499e-06 83.5L3.69361e-06 84.5H1V83.5H3.6499e-06ZM3.82475e-06 87.5L3.86846e-06 88.5H1V87.5H3.82475e-06ZM3.99959e-06 91.5L4.0433e-06 92.5H1V91.5H3.99959e-06ZM4.17444e-06 95.5L4.21815e-06 96.5H1V95.5H4.17444e-06ZM4.34928e-06 99.5L4.393e-06 100.5H1L1 99.5H4.34928e-06ZM4.52413e-06 103.5L4.56784e-06 104.5H1V103.5H4.52413e-06ZM4.69897e-06 107.5L4.74269e-06 108.5H1L1 107.5H4.69897e-06ZM4.87382e-06 111.5L4.91753e-06 112.5H1V111.5H4.87382e-06ZM5.04866e-06 115.5L5.09238e-06 116.5H1.00001L1.00001 115.5H5.04866e-06ZM5.22351e-06 119.5L5.26723e-06 120.5H1.00001V119.5H5.22351e-06ZM5.39835e-06 123.5L5.44207e-06 124.5H1.00001L1.00001 123.5H5.39835e-06ZM5.5732e-06 127.5L5.61692e-06 128.5H1.00001V127.5H5.5732e-06ZM5.74805e-06 131.5L5.79176e-06 132.5H1.00001L1.00001 131.5H5.74805e-06ZM5.92289e-06 135.5L5.96661e-06 136.5H1.00001V135.5H5.92289e-06ZM6.09774e-06 139.5L6.14145e-06 140.5H1.00001L1.00001 139.5H6.09774e-06ZM6.27259e-06 143.5L6.3163e-06 144.5H1.00001V143.5H6.27259e-06ZM6.44743e-06 147.5L6.49114e-06 148.5H1.00001V147.5H6.44743e-06ZM6.62228e-06 151.5L6.66598e-06 152.5H1.00001V151.5H6.62228e-06ZM6.79712e-06 155.5L6.84083e-06 156.5H1.00001V155.5H6.79712e-06ZM6.97197e-06 159.5L7.01568e-06 160.5H1.00001L1.00001 159.5H6.97197e-06ZM7.14681e-06 163.5L7.19052e-06 164.5H1.00001V163.5H7.14681e-06ZM7.32166e-06 167.5L7.36537e-06 168.5H1.00001L1.00001 167.5H7.32166e-06ZM7.49651e-06 171.5L7.54021e-06 172.5H1.00001V171.5H7.49651e-06ZM7.67135e-06 175.5L7.71506e-06 176.5H1.00001L1.00001 175.5H7.67135e-06ZM7.8462e-06 179.5L7.8899e-06 180.5H1.00001V179.5H7.8462e-06ZM8.02104e-06 183.5L8.06475e-06 184.5H1.00001L1.00001 183.5H8.02104e-06ZM8.19589e-06 187.5L8.2396e-06 188.5H1.00001V187.5H8.19589e-06ZM8.37073e-06 191.5L8.41444e-06 192.5H1.00001L1.00001 191.5H8.37073e-06ZM8.54558e-06 195.5L8.58929e-06 196.5H1.00001V195.5H8.54558e-06ZM8.72042e-06 199.5L8.76413e-06 200.5H1.00001L1.00001 199.5H8.72042e-06ZM8.89527e-06 203.5L8.93898e-06 204.5H1.00001V203.5H8.89527e-06ZM9.07011e-06 207.5L9.11383e-06 208.5H1.00001V207.5H9.07011e-06ZM9.24496e-06 211.5L9.28867e-06 212.5H1.00001V211.5H9.24496e-06ZM9.4198e-06 215.5L9.46352e-06 216.5H1.00001V215.5H9.4198e-06ZM9.59465e-06 219.5L9.63836e-06 220.5H1.00001L1.00001 219.5H9.59465e-06ZM9.76949e-06 223.5L9.81321e-06 224.5H1.00001V223.5H9.76949e-06ZM9.94434e-06 227.5L9.98806e-06 228.5H1.00001L1.00001 227.5H9.94434e-06ZM1.01192e-05 231.5L1.01629e-05 232.5H1.00001V231.5H1.01192e-05ZM1.0294e-05 235.5L1.03377e-05 236.5H1.00001L1.00001 235.5H1.0294e-05ZM1.04689e-05 239.5L1.05126e-05 240.5H1.00001V239.5H1.04689e-05ZM1.06437e-05 243.5L1.06874e-05 244.5H1.00001L1.00001 243.5H1.06437e-05ZM1.08186e-05 247.5L1.08623e-05 248.5H1.00001V247.5H1.08186e-05ZM1.09934e-05 251.5L1.10371e-05 252.5H1.00001L1.00001 251.5H1.09934e-05ZM1.11683e-05 255.5L1.1212e-05 256.5H1.00001V255.5H1.11683e-05ZM1.13431e-05 259.5L1.13868e-05 260.5H1.00001L1.00001 259.5H1.13431e-05ZM1.1518e-05 263.5L1.15617e-05 264.5H1.00001V263.5H1.1518e-05ZM1.16928e-05 267.5L1.17365e-05 268.5H1.00001V267.5H1.16928e-05ZM1.18676e-05 271.5L1.19114e-05 272.5H1.00001V271.5H1.18676e-05ZM1.20425e-05 275.5L1.20862e-05 276.5H1.00001V275.5H1.20425e-05ZM1.22173e-05 279.5L1.2261e-05 280.5H1.00001L1.00001 279.5H1.22173e-05ZM1.23922e-05 283.5L1.24359e-05 284.5H1.00001V283.5H1.23922e-05ZM1.2567e-05 287.5L1.26107e-05 288.5H1.00001L1.00001 287.5H1.2567e-05ZM1.27419e-05 291.5L1.27856e-05 292.5H1.00001V291.5H1.27419e-05ZM1.29167e-05 295.5L1.29604e-05 296.5H1.00001L1.00001 295.5H1.29167e-05ZM1.30916e-05 299.5L1.31353e-05 300.5H1.00001V299.5H1.30916e-05ZM1.32664e-05 303.5L1.33101e-05 304.5H1.00001L1.00001 303.5H1.32664e-05ZM1.34413e-05 307.5L1.3485e-05 308.5H1.00001V307.5H1.34413e-05ZM1.36161e-05 311.5L1.36598e-05 312.5H1.00001L1.00001 311.5H1.36161e-05ZM1.37909e-05 315.5L1.38347e-05 316.5H1.00001V315.5H1.37909e-05ZM1.39658e-05 319.5L1.40095e-05 320.5H1.00001L1.00001 319.5H1.39658e-05ZM1.41406e-05 323.5L1.41843e-05 324.5H1.00001V323.5H1.41406e-05ZM1.43155e-05 327.5L1.43592e-05 328.5H1.00001V327.5H1.43155e-05ZM1.44903e-05 331.5L1.4534e-05 332.5H1.00001V331.5H1.44903e-05ZM1.46652e-05 335.5L1.47089e-05 336.5H1.00001V335.5H1.46652e-05ZM1.484e-05 339.5L1.48837e-05 340.5H1.00001L1.00001 339.5H1.484e-05ZM1.50149e-05 343.5L1.50586e-05 344.5H1.00002V343.5H1.50149e-05ZM1.51897e-05 347.5L1.52334e-05 348.5H1.00002L1.00002 347.5H1.51897e-05ZM1.53646e-05 351.5L1.53864e-05 352L0 353H0.497955V352H1.00002V351.5H1.53646e-05ZM435 352H434.501V353H435V352ZM431.508 352H430.51V353H431.508V352ZM427.517 352H426.52V353H427.517V352ZM423.526 352H422.529V353H423.526V352ZM419.536 352H418.538V353H419.536V352ZM415.545 352H414.547V353H415.545V352ZM411.554 352H410.556V353H411.554V352ZM407.563 352H406.565V353H407.563V352ZM403.572 352H402.575V353H403.572V352ZM399.581 352H398.584V353H399.581V352ZM395.591 352H394.593V353H395.591V352ZM391.6 352H390.602V353H391.6V352ZM387.609 352H386.611V353H387.609V352ZM383.618 352H382.62V353H383.618V352ZM379.627 352H378.63V353H379.627V352ZM375.636 352H374.639V353H375.636V352ZM371.646 352H370.648V353H371.646V352ZM367.655 352H366.657V353H367.655V352ZM363.664 352H362.666V353H363.664V352ZM359.673 352H358.675V353H359.673V352ZM355.682 352H354.685V353H355.682V352ZM351.692 352H350.694V353H351.692V352ZM347.701 352H346.703V353H347.701V352ZM343.71 352H342.712V353H343.71V352ZM339.719 352H338.721V353H339.719V352ZM335.728 352H334.731V353H335.728V352ZM331.737 352H330.74V353H331.737V352ZM327.747 352H326.749V353H327.747V352ZM323.756 352H322.758V353H323.756V352ZM319.765 352H318.767V353H319.765V352ZM315.774 352H314.776V353H315.774V352ZM311.783 352H310.786V353H311.783V352ZM307.792 352H306.795V353H307.792V352ZM303.802 352H302.804V353H303.802V352ZM299.811 352H298.813V353H299.811V352ZM295.82 352H294.822V353H295.82V352ZM291.829 352H290.831V353H291.829V352ZM287.838 352H286.841V353H287.838V352ZM283.848 352H282.85V353H283.848V352ZM279.857 352H278.859V353H279.857V352ZM275.866 352H274.868V353H275.866V352ZM271.875 352H270.877V353H271.875V352ZM267.884 352H266.886V353H267.884V352ZM263.893 352H262.896V353H263.893V352ZM259.903 352H258.905V353H259.903V352ZM255.912 352H254.914V353H255.912V352ZM251.921 352H250.923V353H251.921V352ZM247.93 352H246.932V353H247.93V352ZM243.939 352H242.942V353H243.939V352ZM239.948 352H238.951V353H239.948V352ZM235.958 352H234.96V353H235.958V352ZM231.967 352H230.969V353H231.967V352ZM227.976 352H226.978V353H227.976V352ZM223.985 352H222.987V353H223.985V352ZM219.994 352H218.997V353H219.994V352ZM216.003 352H215.006V353H216.003V352ZM212.013 352H211.015V353H212.013V352ZM208.022 352H207.024V353H208.022V352ZM204.031 352H203.033V353H204.031V352ZM200.04 352H199.042V353H200.04V352ZM196.049 352H195.052V353H196.049V352ZM192.058 352H191.061V353H192.058V352ZM188.068 352H187.07V353H188.068V352ZM184.077 352H183.079V353H184.077V352ZM180.086 352H179.088V353H180.086V352ZM176.095 352H175.097V353H176.095V352ZM172.104 352H171.107V353H172.104V352ZM168.113 352H167.116V353H168.113V352ZM164.123 352H163.125V353H164.123V352ZM160.132 352H159.134V353H160.132V352ZM156.141 352H155.143V353H156.141V352ZM152.15 352H151.152V353H152.15V352ZM148.159 352H147.161V353H148.159V352ZM144.168 352H143.171V353H144.168V352ZM140.178 352H139.18V353H140.178V352ZM136.187 352H135.189V353H136.187V352ZM132.196 352H131.198V353H132.196V352ZM128.205 352H127.207V353H128.205V352ZM124.214 352H123.216V353H124.214V352ZM120.223 352H119.226V353H120.223V352ZM116.232 352H115.235V353H116.232V352ZM112.242 352H111.244V353H112.242V352ZM108.251 352H107.253V353H108.251V352ZM104.26 352H103.262V353H104.26V352ZM100.269 352H99.2714V353H100.269V352ZM96.2782 352H95.2805V353H96.2782V352ZM92.2874 352H91.2897V353H92.2874V352ZM88.2965 352H87.2988V353H88.2965V352ZM84.3057 352H83.308V353H84.3057V352ZM80.3148 352H79.3171V353H80.3148V352ZM76.324 352H75.3263V353H76.324V352ZM72.3332 352H71.3354V353H72.3332V352ZM68.3423 352H67.3446V353H68.3423V352ZM64.3515 352H63.3538V353H64.3515V352ZM60.3606 352H59.3629V353H60.3606V352ZM56.3698 352H55.3721V353H56.3698V352ZM52.3789 352H51.3812V353H52.3789V352ZM48.3881 352H47.3904V353H48.3881V352ZM44.3972 352H43.3995V353H44.3972V352ZM40.4064 352H39.4087V353H40.4064V352ZM36.4156 352H35.4178V353H36.4156V352ZM32.4247 352H31.427V353H32.4247V352ZM28.4339 352H27.4362V353H28.4339V352ZM24.443 352H23.4453V353H24.443V352ZM20.4522 352H19.4545V353H20.4522V352ZM16.4613 352H15.4636V353H16.4613V352ZM12.4705 352H11.4728V353H12.4705V352ZM8.47964 352H7.48193V353H8.47964V352ZM4.4888 352H3.49109V353H4.4888V352Z"
        fill="#8189A4"
      />

      {/* USD graph */}
      <defs>
        <symbol id="usdcpointDefault">
          <circle
            cx="150"
            cy="150"
            r="50"
            style={{
              filter: "blur(50px)",
              fill: "rgba(163, 217, 114, .4)",
            }}
          />
          <circle cx="150" cy="150" r="11" fill="#A3D972" fillOpacity="0.16" />
          <circle cx="150" cy="150" r="6" fill="#A3D972" fillOpacity="0.2" />
          <circle cx="150" cy="150" r="2.5" fill="#A3D972" stroke="white" />
        </symbol>
      </defs>
      <path
        d="M0 350.887C302.916 350.887 349.72 193.647 349.72 144"
        strokeWidth="2"
        stroke="#a3d972"
        style={{ opacity: 0.1 }}
      />
      <path
        d="M0 350.887C302.916 350.887 349.72 193.647 349.72 144"
        stroke="url(#usd_gDefault)"
        data-graph="usd"
        ref={usdPathRef}
        className={`${classes.pathDefault} ${classes.path_usd} ${
          cryptoType === "usd" || hoverElem === "usd"
            ? classes.pathStrokeAnim
            : ""
        }`}
        id="usd_none"
      />
      <path
        d="M0 350.887C302.916 350.887 349.72 193.647 349.72 144"
        stroke="transparent"
        strokeWidth="30"
        data-graph="usd"
        onMouseEnter={cryptoType !== "usd" ? onHoverhandler : undefined}
        onMouseOut={cryptoType !== "usd" ? onHoverhandler : undefined}
        onMouseDown={cryptoType !== "usd" ? onGraphClickHandler : undefined}
        ref={usdPathRefMore}
        className={classes.pointer}
      />
      <defs>
        <linearGradient
          id="usd_gDefault"
          x1="417.161"
          y1="9.09606"
          x2="0.501528"
          y2="243.142"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#06FF5B" />
          <stop offset="0.17008" stopColor="#7AD972" stopOpacity="0.82992" />
          <stop offset="0.775903" stopColor="#A3D972" stopOpacity="0.73" />
          <stop offset="1" stopColor="#C6E374" />
        </linearGradient>
      </defs>
      <use
        href="#usdcpointDefault"
        x="-150"
        y="-150"
        fill="#5474F4"
        data-graph="usd"
        onMouseEnter={cryptoType !== "usd" ? onHoverhandler : undefined}
        onMouseDown={cryptoType !== "usd" ? onGraphClickHandler : undefined}
        ref={usdUseRef}
        className={`${classes.pointer} ${classes.usd_pointer} ${
          cryptoType === "usd"
            ? classes.show
            : hoverElem === "usd"
            ? classes.show
            : classes.novisible
        }`}
      />

      {/* BTC graph */}
      <defs>
        <symbol id="btcpointDefault">
          <circle
            cx="150"
            cy="150"
            r="50"
            style={{
              filter: "blur(50px)",
              fill: "rgba(255, 137, 29, .4)",
            }}
          />
          <circle cx="150" cy="150" r="11" fill="#FF891D" fillOpacity="0.16" />
          <circle cx="150" cy="150" r="6" fill="#FF891D" fillOpacity="0.2" />
          <circle cx="150" cy="150" r="2.5" fill="#FF891D" stroke="white" />
        </symbol>
      </defs>
      <path
        d="M1 350.104C29.3714 212.367 41.8762 186.944 99.2632 149.658C156.649 112.371 327.989 109.855 355.152 110.006"
        strokeWidth="2"
        stroke="#ff891d"
        style={{ opacity: 0.1 }}
      />
      <path
        d="M1 350.104C29.3714 212.367 41.8762 186.944 99.2632 149.658C156.649 112.371 327.989 109.855 355.152 110.006"
        stroke="url(#btc_g)"
        ref={btcPathRef}
        id="btc_none"
        className={`${classes.pathDefault} ${classes.path_btc} ${
          cryptoType === "btc" || hoverElem === "btc"
            ? classes.pathStrokeAnim
            : ""
        }`}
        data-graph="btc"
      />
      <path
        d="M1 350.104C29.3714 212.367 41.8762 186.944 99.2632 149.658C156.649 112.371 327.989 109.855 355.152 110.006"
        stroke="transparent"
        strokeWidth="30"
        data-graph="btc"
        onMouseEnter={cryptoType !== "btc" ? onHoverhandler : undefined}
        onMouseOut={cryptoType !== "btc" ? onHoverhandler : undefined}
        onMouseDown={cryptoType !== "btc" ? onGraphClickHandler : undefined}
        ref={btcPathRefMore}
        className={classes.pointer}
      />
      <defs>
        <linearGradient
          id="btc_g"
          x1="-52.2773"
          y1="208.593"
          x2="440.738"
          y2="2.31339"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.159185" stopColor="#FFCD1D" />
          <stop offset="0.414681" stopColor="#FF891D" />
          <stop offset="0.790577" stopColor="#F57D0F" />
          <stop offset="0.949973" stopColor="#F14109" />
        </linearGradient>
      </defs>
      <use
        href="#btcpointDefault"
        x="-148"
        y="-150"
        fill="#5474F4"
        data-graph="btc"
        ref={btcUseRef}
        onMouseEnter={cryptoType !== "btc" ? onHoverhandler : undefined}
        onMouseDown={cryptoType !== "btc" ? onGraphClickHandler : undefined}
        className={`${classes.pointer} ${classes.btc_pointer} ${
          cryptoType === "btc"
            ? classes.show
            : hoverElem === "btc"
            ? classes.show
            : classes.novisible
        }`}
      />

      {/* ETH graph */}
      <defs>
        <symbol id="ethpointDefault">
          <circle
            cx="150"
            cy="150"
            r="50"
            style={{
              filter: "blur(50px)",
              fill: "rgba(84, 116, 244, .4)",
            }}
          />
          <circle cx="150" cy="150" r="11" fill="#5474F4" fillOpacity="0.16" />
          <circle cx="150" cy="150" r="6" fill="#5474F4" fillOpacity="0.2" />
          <circle cx="150" cy="150" r="2.5" fill="#5474F4" stroke="white" />
        </symbol>
      </defs>
      <path
        d="M1 350.988C16.192 300.494 61.7406 208.495 100.651 197.613C146.59 184.765 236.969 201.16 359.555 217.361"
        strokeWidth="2"
        stroke="#5474f4"
        style={{ opacity: 0.1 }}
      />
      <path
        d="M1 350.988C16.192 300.494 61.7406 208.495 100.651 197.613C146.59 184.765 236.969 201.16 359.555 217.361"
        stroke="url(#paint0_linear)"
        data-graph="eth"
        ref={ethPathRef}
        className={`${classes.pathDefault} ${classes.path_eth} ${
          cryptoType === "eth" || hoverElem === "eth"
            ? classes.pathStrokeAnim
            : ""
        }`}
        id="eth_none"
      />
      <path
        d="M1 350.988C16.192 300.494 61.7406 208.495 100.651 197.613C146.59 184.765 236.969 201.16 359.555 217.361"
        stroke="transparent"
        strokeWidth="30"
        data-graph="eth"
        onMouseEnter={cryptoType !== "eth" ? onHoverhandler : undefined}
        onMouseOut={cryptoType !== "eth" ? onHoverhandler : undefined}
        onMouseDown={cryptoType !== "eth" ? onGraphClickHandler : undefined}
        ref={ethPathRefMore}
        className={classes.pointer}
      />
      <defs>
        <linearGradient
          id="paint0_linear"
          x1="413.537"
          y1="21.4424"
          x2="-57.4433"
          y2="129.508"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6A54F4" />
          <stop offset="0.420081" stopColor="#5487F4" stopOpacity="0.926406" />
          <stop offset="0.752508" stopColor="#54C4F4" stopOpacity="0.69" />
          <stop offset="1" stopColor="#00FFFB" />
        </linearGradient>
      </defs>
      <use
        href="#ethpointDefault"
        x="-150"
        y="-150"
        fill="#5474F4"
        data-graph="eth"
        onMouseEnter={cryptoType !== "eth" ? onHoverhandler : undefined}
        onMouseDown={cryptoType !== "eth" ? onGraphClickHandler : undefined}
        ref={ethUseRef}
        className={`${classes.pointer} ${classes.eth_pointer} ${
          cryptoType === "eth"
            ? classes.show
            : hoverElem === "eth"
            ? classes.show
            : classes.novisible
        }`}
      />
    </svg>
  );
};
export default NoneSvg;
