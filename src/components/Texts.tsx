import { FC } from "react";

export const LabelText: FC<{ className?: string }> = ({
  children,
  className,
}) => (
  <span
    className={`font-inter font-light text-blue-spindle text-md uppercase ${
      className ?? ""
    }`}
  >
    {children}
  </span>
);

export const UnitText: FC = ({ children }) => (
  <TextRoboto className="text-blue-spindle font-extralight text-base md:text-lg">
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

export const TextInter: FC<{ className?: string; inline?: boolean }> = ({
  children,
  className,
  inline = true,
}) => {
  const mergedClassName = `
    font-inter font-light
    text-white
    ${className ?? ""}
  `;

  return inline ? (
    <span className={mergedClassName}>{children}</span>
  ) : (
    <p className={mergedClassName}>{children}</p>
  );
};

export const TextRoboto: FC<{ className?: string; inline?: boolean }> = ({
  children,
  className,
  inline = true,
}) => {
  const mergedClassName = `
    font-roboto font-light
    text-white
    ${className ?? ""}
  `;

  return inline ? (
    <span className={mergedClassName}>{children}</span>
  ) : (
    <p className={mergedClassName}>{children}</p>
  );
};
