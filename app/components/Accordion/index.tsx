import * as React from "react";
import { BodyText } from "../Texts";
import Twemoji from "../Twemoji";

type AccordionProps = {
  title: string;
  text: string;
};
const Accordion: React.FC<AccordionProps> = ({ title, text }) => {
  const [isOpen, setOpen] = React.useState(false);
  return (
    <BodyText className={"wrapper"}>
      <div
        className={`title text-lg py-6 break-words ${isOpen ? `open` : ""}`}
        onClick={() => setOpen(!isOpen)}
      >
        <Twemoji imageClassName="inline h-6 ml-1">
          <p
            dangerouslySetInnerHTML={{
              __html: String(title),
            }}
          ></p>
        </Twemoji>
      </div>
      <div
        className={`pb-6 break-words whitespace-pre-line item ${
          isOpen ? `animateIn` : `collapsed animateOut`
        }`}
      >
        <Twemoji imageClassName="inline h-6">
          <p
            className={`content leading-relaxed pb-6`}
            dangerouslySetInnerHTML={{
              __html: String(text),
            }}
          ></p>
        </Twemoji>
      </div>
    </BodyText>
  );
};

export default Accordion;
