import type { FC } from "react";
import SectionDivider from "../SectionDivider";
import StyledLink from "../StyledLink";
import { TextInterLink } from "../Texts";

const ContactSection: FC = () => (
  <section className="w-full flex flex-col items-center pb-40">
    <SectionDivider title="still have questions?" />
    <div className="flex flex-col gap-y-4 justify-start">
      <div className="flex gap-2 items-center">
        <img
          className="w-4"
          src="/twitter-icon.svg"
          alt="icon of the twitter bird"
        />
        <StyledLink
          className="flex items-center gap-x-2"
          enableHover={false}
          href="https://twitter.com/ultrasoundmoney/"
        >
          <TextInterLink>DM us @ultrasoundmoney</TextInterLink>
        </StyledLink>
      </div>
      <div className="flex gap-2 items-center">
        <img
          className="h-4"
          src="/email-icon.svg"
          alt="icon of an envelope, email"
        />
        <StyledLink
          className="flex items-center gap-x-2"
          enableHover={false}
          href="mailto:contact@ultrasound.money"
        >
          <TextInterLink>contact@ultrasound.money</TextInterLink>
        </StyledLink>
      </div>
    </div>
  </section>
);
export default ContactSection;
