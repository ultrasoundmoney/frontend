import type { FC } from "react";
import DefaultTextLink from "../DefaultTextLink";
import SectionDivider from "../SectionDivider";
import { TextInterLink } from "../Texts";

const ContactSection: FC = () => (
  <section className="flex w-full flex-col items-center pb-40">
    <SectionDivider title="still have questions?" />
    <div className="flex flex-col justify-start gap-y-4">
      <div className="flex items-center gap-2">
        <img
          className="w-4"
          src="/twitter-icon.svg"
          alt="icon of the twitter bird"
        />
        <DefaultTextLink
          className="flex items-center gap-x-2"
          href="https://twitter.com/ultrasoundmoney/"
        >
          <TextInterLink>DM us @ultrasoundmoney</TextInterLink>
        </DefaultTextLink>
      </div>
      <div className="flex items-center gap-2">
        <img
          className="h-4"
          src="/email-icon.svg"
          alt="icon of an envelope, email"
        />
        <DefaultTextLink
          className="flex items-center gap-x-2"
          href="mailto:contact@ultrasound.money"
        >
          <TextInterLink>contact@ultrasound.money</TextInterLink>
        </DefaultTextLink>
      </div>
    </div>
  </section>
);
export default ContactSection;
