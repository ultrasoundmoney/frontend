import dynamic from "next/dynamic";
import type { FC } from "react";
import { Suspense } from "react";
import BasicErrorBoundary from "../BasicErrorBoundary";
const TwitterFam = dynamic(() => import("../TwitterFam"), { suspense: true });
const FollowingYou = dynamic(() => import("../FollowingYou"));

const FamSection: FC = () => (
  <BasicErrorBoundary>
    <Suspense>
      <div className="flex flex-col xs:px-4 md:px-16">
        <div id="fam" className="relative flex px-4 md:px-0 pt-40 mb-16">
          <div className="w-full relative flex flex-col items-center">
            <TwitterFam />
          </div>
        </div>
        <div className="flex px-4 md:px-0 pt-20">
          <div className="w-full lg:w-2/3 md:m-auto relative">
            <FollowingYou />
          </div>
        </div>
      </div>
    </Suspense>
  </BasicErrorBoundary>
);

export default FamSection;
