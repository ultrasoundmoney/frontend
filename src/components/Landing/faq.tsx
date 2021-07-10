import * as React from "react";
import Accordion from "../Accordion";

type FaqBlockPros = {};
const FaqBlock: React.FC<FaqBlockPros> = () => {
  const lorem =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud e Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud e ";
  return (
    <>
      <div className="block py-8">
        <h1 className="text-white text-center text-2xl">Faqs</h1>
      </div>
      <div className="w-full md:w-7/12 mx-auto px-4 md:px-0">
        <Accordion
          title="If supply is deflationary will price go to infinity as supply goes to zero?"
          text={lorem}
        />
        <Accordion title="What is sound money?" text={lorem} />
        <Accordion title="What is sound money?" text={lorem} />
        <Accordion
          title="Whose money is getting destroyed? / Can my ETH get removed from the supply?"
          text={lorem}
        />
        <Accordion title="Can supply hit zero?" text={lorem} />
        <Accordion title="Isn’t deflation bad for economies?" text={lorem} />
        <Accordion title="What does deflation mean for price?" text={lorem} />
      </div>
      <div className="w-full md:w-7/12 mx-auto px-4 md:px-0 md:flex text-center justify-center mt-16">
        <h1 className="flex-initial text-white text-lg font-light self-center md:px-4">
          Can not find what you are looking for?
        </h1>
        <button
          type="button"
          className="flex-none px-3 py-2 text-base text-blue-shipcove hover:opacity-75 border-blue-shipcove border-solid border-2 rounded-3xl"
        >
          Ask Question
        </button>
      </div>
    </>
  );
};

export default FaqBlock;
