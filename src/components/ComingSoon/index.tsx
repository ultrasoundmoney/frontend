import * as React from "react";
import TwitterCommunity from "../TwitterCommunity";
import FollowingYou from "../FollowingYou";
import SupplyView from "../SupplyView";
import { TranslationsContext } from "../../translations-context";
// import BurnLeaderboard from "../BurnLeaderboard";
import TotalFeeBurn from "../TotalFeeBurn";
import LatestBlocks from "../LatestBlocks";
import FaqBlock from "../Landing/faq";

const ComingSoon: React.FC = () => {
  const t = React.useContext(TranslationsContext);
  return (
    <div className="wrapper bg-blue-midnightexpress coming-soon">
      <div className="container m-auto">
        <div className="w-full pt-20 pb-16">
          <div
            className={`ultra-sound-text w-full text-6xl md:text-7xl md:w-1/2 m-auto`}
          >
            ultra sound
          </div>
          <div
            className={`ultra-sound-text w-full text-6xl md:text-7xl md:w-1/2 m-auto mb-8`}
          >
            awakening
          </div>
          <p className="font-inter text-white text-center">
            track ETH become ultra sound
          </p>
        </div>
        {/* <div className="flex flex-col px-4 md:px-2 md:pt-40 mb-16"> */}
        {/*   <h1 className="text-white font-light text-center text-2xl md:text-3xl xl:text-41xl mb-8"> */}
        {/*     the biggest Ξ burners */}
        {/*   </h1> */}
        {/*   <p className="text-white text-center font-light text-base lg:text-lg mb-8"> */}
        {/*     see who&aposs contracting the supply */}
        {/*   </p> */}
        {/*   <BurnLeaderboard /> */}
        {/* </div> */}
        <div className="flex flex-col px-4 md:px-2 md:pt-20 mb-4">
          <TotalFeeBurn />
        </div>
        <div className="flex flex-col px-4 md:px-2 mb-8">
          <LatestBlocks />
        </div>
        <div className="flex flex-col px-4 md:px-2 md:pt-40 mb-16">
          <h1 className="text-white font-light text-center text-2xl md:text-3xl xl:text-41xl mb-8">
            {t.teaser_supply_title}
          </h1>
          <p className="text-white text-center font-light text-base lg:text-lg mb-8">
            {t.teaser_supply_subtitle}
          </p>
          <div className="w-full lg:w-5/6 md:m-auto relative bg-blue-tangaroa px-2 md:px-4 xl:px-12 py-4 md:py-8 xl:py-12 rounded-xl">
            <SupplyView />
          </div>
        </div>
        <div className="flex px-4 md:px-0 pt-8 md:pt-40 mb-16">
          <div className="w-full md:w-5/6 lg:w-2/3 md:m-auto relative">
            <TwitterCommunity />
          </div>
        </div>
        <div className="flex px-4 md:px-0 pt-20 pb-40">
          <div className="w-full md:w-5/6 lg:w-2/3 md:m-auto relative">
            <FollowingYou />
          </div>
        </div>
        <div className="flex px-4 md:px-0 pt-20 pb-60">
          <div className="w-full md:w-5/6 lg:w-2/3 md:m-auto relative">
            <FaqBlock />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
