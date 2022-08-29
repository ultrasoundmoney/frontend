import type { FC } from "react";
import { SectionTitle } from "./TextsNext/SectionTitle";

const SectionDivider: FC<{
  link?: string;
  subtitle?: string;
  title: string;
}> = ({ link, title, subtitle }) => (
  <>
    <div className="h-16"></div>
    <SectionTitle link={link} subtitle={subtitle}>
      {title}
    </SectionTitle>
    <div className="h-16"></div>
  </>
);

export default SectionDivider;
