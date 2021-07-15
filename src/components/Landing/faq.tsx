import * as React from "react";
import Accordion from "../Accordion";
import { TranslationsContext } from "../../translations-context";

type FaqBlockPros = {};
const FaqBlock: React.FC<FaqBlockPros> = () => {
  const t = React.useContext(TranslationsContext);
  return (
    <>
      <section id="faq">
        <div className="block py-8">
          <h1 className="text-white text-center text-2xl">
            {t.faq_section_title}
          </h1>
        </div>
        <div className="w-full lg:w-7/12 mx-auto px-4 md:px-8 lg:px-0">
          <Accordion title={t.faq_question_1} text={t.faq_answer_1} />
          <Accordion title={t.faq_question_2} text={t.faq_answer_2} />
          <Accordion title={t.faq_question_3} text={t.faq_answer_3} />
          <Accordion title={t.faq_question_4} text={t.faq_answer_4} />
          <Accordion title={t.faq_question_5} text={t.faq_answer_5} />
          <Accordion title={t.faq_question_6} text={t.faq_answer_6} />
        </div>
        <div className="w-full lg:w-7/12 mx-auto px-4 md:px-0 md:flex text-center justify-center mt-16">
          <h1 className="flex-initial text-white text-lg font-light self-center md:px-4">
            {t.faq_missing_question}
          </h1>
          <button
            type="button"
            className="flex-none px-3 py-2 text-base text-blue-shipcove hover:opacity-75 border-blue-shipcove border-solid border-2 rounded-3xl"
          >
            {t.faq_btn_text}
          </button>
        </div>
      </section>
    </>
  );
};

export default FaqBlock;
