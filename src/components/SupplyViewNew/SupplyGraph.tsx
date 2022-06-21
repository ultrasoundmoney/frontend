import React from "react";

const SupplyGraph = () => {
  return (
    <svg
      style={{ overflow: "visible" }}
      height="20vw"
      viewBox="0 0 577 295"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_1549_1925"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="137"
        y="32"
        width="388"
        height="231"
      >
        <rect x="137.309" y="32" width="387" height="230.789" fill="#C4C4C4" />
      </mask>
      <g mask="url(#mask0_1549_1925)">
        <g filter="url(#filter0_f_1549_1925)">
          <path
            d="M164.309 242.299C176.608 198.489 213.486 118.669 244.989 109.227C282.182 98.08 305.184 162.488 451.727 161.621"
            stroke="url(#paint0_linear_1549_1925)"
            strokeWidth="2"
          />
        </g>
        <path
          d="M164.309 242.299C176.608 198.489 213.486 118.669 244.989 109.227C282.182 98.08 305.184 162.488 451.727 161.621"
          stroke="url(#paint1_linear_1549_1925)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <ellipse
          cx="452.309"
          cy="161.881"
          rx="9"
          ry="8.99176"
          fill="#5376C8"
          fillOpacity="0.16"
        />
        <ellipse
          opacity="0.2"
          cx="452.218"
          cy="161.79"
          rx="4.90909"
          ry="4.9046"
          fill="#5C69DD"
        />
        <path
          d="M454.718 162.335C454.718 163.413 453.843 164.287 452.763 164.287C451.683 164.287 450.809 163.413 450.809 162.335C450.809 161.257 451.683 160.383 452.763 160.383C453.843 160.383 454.718 161.257 454.718 162.335Z"
          fill="#5D68DD"
          stroke="white"
        />
      </g>
      <g opacity="0.14" filter="url(#filter1_f_1549_1925)">
        <ellipse cx="372.577" cy="152.495" rx="140" ry="140" fill="#0037FA" />
      </g>
      <defs>
        <filter
          id="filter0_f_1549_1925"
          x="152.346"
          y="95.9302"
          width="310.387"
          height="157.64"
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
            result="effect1_foregroundBlur_1549_1925"
          />
        </filter>
        <filter
          id="filter1_f_1549_1925"
          x="0.154297"
          y="-158.009"
          width="744.846"
          height="621.009"
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
            stdDeviation="100"
            result="effect1_foregroundBlur_1549_1925"
          />
        </filter>
        <linearGradient
          id="paint0_linear_1549_1925"
          x1="449.826"
          y1="122.678"
          x2="121.338"
          y2="193.715"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6A54F4" />
          <stop offset="0.420081" stopColor="#5487F4" stopOpacity="0.926406" />
          <stop offset="0.752508" stopColor="#54C4F4" stopOpacity="0.69" />
          <stop offset="1" stopColor="#00FFFB" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1549_1925"
          x1="449.826"
          y1="122.678"
          x2="121.338"
          y2="193.715"
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

export default SupplyGraph;
