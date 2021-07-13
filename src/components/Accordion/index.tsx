import * as React from "react";

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
          className={`accordion-title text-lg py-5 break-words ${
            isOpen ? "open" : ""
          }`}
          onClick={() => setOpen(!isOpen)}
          dangerouslySetInnerHTML={{
            __html: title,
          }}
        />
        <div
          className={`accordion-item text-white break-words ${
            !isOpen ? "collapsed animateOut" : "animateIn"
          }`}
        >
          <div
            className="accordion-content"
            dangerouslySetInnerHTML={{
              __html: text,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Accordion;
