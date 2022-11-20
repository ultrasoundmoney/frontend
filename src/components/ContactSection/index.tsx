import type { FC, ReactNode } from "react";
import DefaultTextLink from "../DefaultTextLink";
import SectionDivider from "../SectionDivider";
import emailSvg from "./email-slateus.svg";
import twitterSvg from "../../assets/twitter-slateus.svg";
import githubSvg from "./github-slateus.svg";
import type { StaticImageData } from "next/legacy/image";
import Image from "next/legacy/image";

type ContactProps = {
  alt: string;
  children: ReactNode;
  href: string;
  imageSrc: StaticImageData;
};

const Contact: FC<ContactProps> = ({ alt, imageSrc, href, children }) => (
  <div className="flex items-center gap-2">
    <div className="flex w-5">
      <Image alt={alt} src={imageSrc} />
    </div>
    <DefaultTextLink className="flex items-center gap-x-2" href={href}>
      {children}
    </DefaultTextLink>
  </div>
);

const ContactSection: FC = () => (
  <section className="flex w-full flex-col items-center pb-40">
    <SectionDivider title="still have questions?" />
    <div className="flex flex-col justify-start gap-y-4">
      <Contact
        alt="twitter logo"
        imageSrc={twitterSvg as StaticImageData}
        href={"https://twitter.com/ultrasoundmoney"}
      >
        DM us @ultrasoundmoney
      </Contact>
      <Contact
        alt="icon of an envelope, symbolizing email"
        imageSrc={emailSvg as StaticImageData}
        href={"mailto:contact@ultrasound.money"}
      >
        contact@ultrasound.money
      </Contact>
      <Contact
        alt="icon of GitHub, where the code for the site is hosted"
        imageSrc={githubSvg as StaticImageData}
        href={"https://github.com/ultrasoundmoney/frontend"}
      >
        GitHub repo
      </Contact>
    </div>
  </section>
);

export default ContactSection;
