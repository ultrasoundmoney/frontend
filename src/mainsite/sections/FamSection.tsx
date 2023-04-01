import dynamic from "next/dynamic";
import type { FC } from "react";
import BasicErrorBoundary from "../../components/BasicErrorBoundary";
const TwitterFam = dynamic(() => import("../components/TwitterFam"), {
  ssr: false,
});
const FollowingYou = dynamic(() => import("../components/FollowingYou"), {
  ssr: false,
});

const FamSection: FC = () => (
  <BasicErrorBoundary>
    <div className="flex flex-col xs:px-4 md:px-16">
      <div id="fam" className="relative mb-16 mt-16 flex px-4 pt-32 md:px-0">
        <div className="relative flex w-full flex-col items-center">
          <TwitterFam />
        </div>
      </div>
      <div className="flex px-4 pt-20 md:px-0">
        <div className="relative w-full md:m-auto lg:w-2/3">
          <FollowingYou />
        </div>
      </div>
    </div>
  </BasicErrorBoundary>
);

export default FamSection;
