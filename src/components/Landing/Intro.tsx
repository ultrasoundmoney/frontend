import * as React from "react";

const Intro: React.FC<{ Data?: Data }> = () => {
  return (
    <>
      <div className="flex justify-center flex-wrap content-center h-screen">
        <h1 className="text-white font-extralight text-7xl text-center leading-none">
          Ethereum is becoming an
        </h1>
        <h1 className="text-white font-extralight text-7xl leading-none text-center text-gradient-to-r from-purple-400 via-pink-500 to-red-500 ">
          Ultra Sound Money 🦇🔊
        </h1>
        <div>
          <p className="text-white">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati
            est quos error aspernatur reiciendis? Quod omnis incidunt cum saepe
            error, magni qui impedit ad ducimus eaque exercitationem neque!
            Ullam, blanditiis.
          </p>
        </div>
      </div>
    </>
  );
};

export default Intro;
