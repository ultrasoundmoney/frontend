import type { FC } from "react";
import { Suspense } from "react";
import { useContext } from "react";
import { FeatureFlagsContext } from "../../feature-flags";
import BasicErrorBoundary from "../BasicErrorBoundary";
import FollowingYou from "../FollowingYou";
import FaqBlock from "../Landing/faq";
import TwitterFam from "../TwitterFam";
import JoinDiscordSection from "./JoinDiscordSection";

const FamSection: FC = () => {
  const featureFlags = useContext(FeatureFlagsContext);
  return (
    <BasicErrorBoundary>
      <Suspense>
        <div className="flex flex-col xs:px-4 md:px-16">
          <div id="fam" className="relative flex px-4 md:px-0 pt-40 mb-16">
            <div className="w-full relative flex flex-col items-center">
              {featureFlags.showBackgroundOrbs && (
                <video
                  className="absolute w-2/3 right-0 -mr-16 -mt-48 opacity-100 -z-10 hidden md:block"
                  playsInline
                  autoPlay
                  muted
                  loop
                  poster="/orbs2.jpg"
                >
                  <source src="/orbs2.webm" type="video/webm; codecs='vp9'" />
                  <source src="/orbs2.mp4" type="video/mp4" />
                </video>
              )}
              <TwitterFam />
            </div>
          </div>
          <div className="flex px-4 md:px-0 pt-20">
            <div className="w-full lg:w-2/3 md:m-auto relative">
              <FollowingYou />
            </div>
          </div>
          <JoinDiscordSection />
          <div className="flex px-4 md:px-0 mt-32">
            <div className="w-full lg:w-2/3 md:m-auto relative">
              <FaqBlock />
            </div>
          </div>
        </div>
      </Suspense>
    </BasicErrorBoundary>
  );
};

export default FamSection;
