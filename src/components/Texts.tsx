import { CSSProperties, FC, ReactNode } from "react";
import Skeleton from "react-loading-skeleton";

export const LabelText: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <TextInter className={`text-blue-spindle uppercase ${className ?? ""}`}>
    {children}
  </TextInter>
);

export const UnitText: FC<{ children: ReactNode; className?: string }> = ({
  className,
  children,
}) => (
  <TextRoboto
    className={`text-blue-spindle font-extralight ${className ?? ""}`}
  >
    {children}
  </TextRoboto>
);

export const SectionTitle: FC<{ title: string; subtitle?: string }> = ({
  title,
  subtitle,
}) => {
  return (
    <>
      <h2
        className={`
          font-inter font-extralight
          text-white text-center text-2xl md:text-3xl xl:text-41xl
        `}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`
            font-inter font-light
            text-blue-shipcove text-center text-base lg:text-lg
            mt-6
          `}
        >
          {subtitle}
        </p>
      )}
    </>
  );
};

export const TextInter: FC<{
  children: ReactNode;
  className?: string;
  inline?: boolean;
  skeletonWidth?: string;
  style?: CSSProperties;
}> = ({
  children,
  className: className = "",
  inline = true,
  style,
  skeletonWidth = "3rem",
}) => {
  const mergedClassName = `
    font-inter font-light
    text-white
    text-base md:text-lg
    ${className}
  `;

  return inline ? (
    <span className={mergedClassName} style={style}>
      {children === undefined ? (
        <Skeleton inline width={skeletonWidth} />
      ) : (
        children
      )}
    </span>
  ) : (
    <p className={mergedClassName} style={style}>
      {children === undefined ? (
        <Skeleton inline width={skeletonWidth} />
      ) : (
        children
      )}
    </p>
  );
};

export const TextInterLink: FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className: className = "" }) => (
  <TextInter className={`text-blue-spindle hover:underline ${className}`}>
    {children}
  </TextInter>
);

export const TextRoboto: FC<{
  children: ReactNode;
  className?: string;
  inline?: boolean;
  style?: CSSProperties;
  tooltip?: string;
}> = ({ children, className, inline = true, style, tooltip }) => {
  const mergedClassName = `
    font-roboto font-light
    text-white
    ${className ?? ""}
  `;

  return inline ? (
    <span className={mergedClassName} style={style} title={tooltip}>
      {children}
    </span>
  ) : (
    <p className={mergedClassName} style={style} title={tooltip}>
      {children}
    </p>
  );
};
