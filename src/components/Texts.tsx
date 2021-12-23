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
  <span className="font-roboto text-blue-spindle font-extralight text-base md:text-lg">
    {children}
  </span>
);

export const SectionTitle: FC<{ title: string; subtitle: string }> = ({
  title,
  subtitle,
}) => {
  return (
    <>
      <h2 className="text-white font-light text-center text-2xl md:text-3xl xl:text-41xl mb-6">
        {title}
      </h2>
      <p className="text-blue-shipcove text-center font-light text-base lg:text-lg">
        {subtitle}
      </p>
    </>
  );
};
