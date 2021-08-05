import * as React from "react";
import twemoji from "twemoji";

type AccordionProps = {
  title: string;
  text: string;
};
const Accordion: React.FC<AccordionProps> = ({ title, text }) => {
  const [isOpen, setOpen] = React.useState(false);
  return (
    <>
      <div className="accordion-wrapper">
        <div
          className={`accordion-title text-lg py-6 break-words ${
            isOpen ? "open" : ""
          }`}
          onClick={() => setOpen(!isOpen)}
          dangerouslySetInnerHTML={{
            __html: twemoji.parse(title),
          }}
        />
        <div
          className={`accordion-item break-words ${
            !isOpen ? "collapsed animateOut" : "animateIn"
          }`}
        >
          <div
            className="accordion-content leading-relaxed py-4"
            dangerouslySetInnerHTML={{
              __html: twemoji.parse(text),
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Accordion;
