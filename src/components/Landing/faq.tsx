import * as React from "react";
import Accordion from "../Accordion";
import TranslationsContext from "../../contexts/TranslationsContext";
import { SectionTitle } from "../TextsNext/SectionTitle";
import { NavigationContext } from "../../contexts/NavigationContext";
import { calcCenterElement } from "../../utils/calcCenterElement";

const FaqBlock: React.FC = () => {
  const t = React.useContext(TranslationsContext);
  const { changeFaqPosition } = React.useContext(NavigationContext);
  const faqSection = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    const resizeFun = () => {
      if (faqSection.current) {
        const centerBlock: number = calcCenterElement(faqSection.current);
        changeFaqPosition(centerBlock);
      }
    };

    resizeFun();
    window.addEventListener("resize", resizeFun);

    return () => window.removeEventListener("resize", resizeFun);
  }, [changeFaqPosition]);

  return (
    <section
      ref={faqSection}
      data-aos="fade-up"
      data-aos-anchor-placement="top-center"
      data-aos-delay="50"
      data-aos-duration="1000"
      data-aos-easing="ease-in-out"
      id="faq"
    >
      <div className="max-w-3xl md:m-auto md:px-4 lg:px-0 ">
        <div className="block pb-8">
          <SectionTitle>q&a</SectionTitle>
        </div>
        <div className="w-full px-4 md:px-8 lg:px-0">
          <Accordion title={t.faq_question_1} text={t.faq_answer_1} />
          <div
            className="w-full bg-slateus-400"
            style={{ height: "1px", opacity: "0.3" }}
          />
          <Accordion title={t.faq_question_2} text={t.faq_answer_2} />
          <div
            className="w-full bg-slateus-400"
            style={{ height: "1px", opacity: "0.3" }}
          />
          <Accordion title={t.faq_question_3} text={t.faq_answer_3} />
          <div
            className="w-full bg-slateus-400"
            style={{ height: "1px", opacity: "0.3" }}
          />
          <Accordion title={t.faq_question_4} text={t.faq_answer_4} />
          {/* <div */}
          {/*   className="w-full bg-slateus-400" */}
          {/*   style={{ height: "1px", opacity: "0.3" }} */}
          {/* /> */}
          {/* <Accordion title={t.faq_question_5} text={t.faq_answer_5} /> */}
          <div
            className="w-full bg-slateus-400"
            style={{ height: "1px", opacity: "0.3" }}
          />
          <Accordion title={t.faq_question_6} text={t.faq_answer_6} />
          <div
            className="w-full bg-slateus-400"
            style={{ height: "1px", opacity: "0.3" }}
          />
          <Accordion title={t.faq_question_7} text={t.faq_answer_7} />
          <div
            className="w-full bg-slateus-400"
            style={{ height: "1px", opacity: "0.3" }}
          />
          <Accordion title={t.faq_question_8} text={t.faq_answer_8} />
          <div
            className="w-full bg-slateus-400"
            style={{ height: "1px", opacity: "0.3" }}
          />
          <Accordion title={t.faq_question_9} text={t.faq_answer_9} />
        </div>
      </div>
    </section>
  );
};

export default FaqBlock;
