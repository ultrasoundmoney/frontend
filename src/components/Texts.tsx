import { CSSProperties, FC, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import { FeatureFlagsContext } from "../feature-flags";

export const LabelText: FC<{ className?: string }> = ({
  children,
  className,
}) => (
  <TextInter className={`text-blue-spindle uppercase ${className ?? ""}`}>
    {children}
  </TextInter>
);

export const UnitText: FC<{ className?: string }> = ({
  className,
  children,
}) => (
  <TextRoboto
    className={`text-blue-spindle font-extralight ${className ?? ""}`}
  >
    {children}
  </TextRoboto>
);

export const SectionTitle: FC<{ title: string; subtitle: string }> = ({
  title,
  subtitle,
}) => {
  return (
    <>
      <h2
        className={`
          font-inter font-light
          text-white text-center text-2xl md:text-3xl xl:text-41xl
          mb-6
        `}
      >
        {title}
      </h2>
      <p
        className={`
          font-inter font-light
          text-blue-shipcove text-center text-base lg:text-lg
        `}
      >
        {subtitle}
      </p>
    </>
  );
};

export const TextInter: FC<{
  className?: string;
  inline?: boolean;
  style?: CSSProperties;
  skeletonWidth?: string;
}> = ({
  children,
  className,
  inline = true,
  style,
  skeletonWidth = "3rem",
}) => {
  const { previewSkeletons } = useContext(FeatureFlagsContext);
  const mergedClassName = `
    font-inter font-light
    text-white
    text-base md:text-lg
    ${className ?? ""}
  `;

  return inline ? (
    <span className={mergedClassName} style={style}>
      {(children || previewSkeletons) ?? (
        <Skeleton inline width={skeletonWidth} />
      )}
    </span>
  ) : (
    <p className={mergedClassName} style={style}>
      {(children || previewSkeletons) ?? (
        <Skeleton inline width={skeletonWidth} />
      )}
    </p>
  );
};

export const TextRoboto: FC<{
  className?: string;
  inline?: boolean;
  style?: CSSProperties;
}> = ({ children, className, inline = true, style }) => {
  const mergedClassName = `
    font-roboto font-light
    text-white
    ${className ?? ""}
  `;

  return inline ? (
    <span className={mergedClassName} style={style}>
      {children}
    </span>
  ) : (
    <p className={mergedClassName} style={style}>
      {children}
    </p>
  );
};
