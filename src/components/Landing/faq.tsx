import * as React from "react";
import Accordion from "../Accordion";
import { TranslationsContext } from "../../translations-context";

type FaqBlockPros = {};
const FaqBlock: React.FC<FaqBlockPros> = () => {
  const t = React.useContext(TranslationsContext);
  return (
    <section
      data-aos="fade-up"
      data-aos-anchor-placement="top-center"
      data-aos-delay="50"
      data-aos-duration="1000"
      data-aos-easing="ease-in-out"
      id="faq"
    >
      <div className="four_vidgets max-w-3xl md:m-auto px-4 md:px-8 lg:px-0 ">
        <div className="block py-8">
          <h1 className="text-white text-center text-2xl md:text-3xl xl:text-41xl">
            {t.faq_section_title}
          </h1>
        </div>
        <div className="w-full px-4 md:px-8 lg:px-0">
          <Accordion title={t.faq_question_1} text={t.faq_answer_1} />
          <div
            className="w-full bg-blue-shipcove"
            style={{ height: "1px", opacity: "0.3" }}
          />
          <Accordion title={t.faq_question_2} text={t.faq_answer_2} />
          <div
            className="w-full bg-blue-shipcove"
            style={{ height: "1px", opacity: "0.3" }}
          />
          <Accordion title={t.faq_question_3} text={t.faq_answer_3} />
          <div
            className="w-full bg-blue-shipcove"
            style={{ height: "1px", opacity: "0.3" }}
          />
          <Accordion title={t.faq_question_4} text={t.faq_answer_4} />
          <div
            className="w-full bg-blue-shipcove"
            style={{ height: "1px", opacity: "0.3" }}
          />
          <Accordion title={t.faq_question_5} text={t.faq_answer_5} />
          <div
            className="w-full bg-blue-shipcove"
            style={{ height: "1px", opacity: "0.3" }}
          />
          <Accordion title={t.faq_question_6} text={t.faq_answer_6} />
          <div
            className="w-full bg-blue-shipcove"
            style={{ height: "1px", opacity: "0.3" }}
          />
          <Accordion title={t.faq_question_7} text={t.faq_answer_7} />
          <div
            className="w-full bg-blue-shipcove"
            style={{ height: "1px", opacity: "0.3" }}
          />
          <Accordion title={t.faq_question_8} text={t.faq_answer_8} />
          <div
            className="w-full bg-blue-shipcove"
            style={{ height: "1px", opacity: "0.3" }}
          />
          <Accordion title={t.faq_question_9} text={t.faq_answer_9} />
        </div>
        <div className="w-full mx-auto px-0 flex justify-center mt-16">
          <span className="flex-initial text-white text-lg font-light self-center px-4">
            {t.faq_missing_question}
          </span>
          <button
            type="button"
            className="flex-none px-3 py-2 text-base text-white hover:opacity-75 border-white border-solid border-2 rounded-3xl"
          >
            <a
              href="https://twitter.com/intent/tweet?text=.@ultrasoundmoney%20%5Byour%20question%20here%5D"
              target="_blank"
              rel="noreferrer"
            >
              {t.faq_btn_text}
            </a>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FaqBlock;
