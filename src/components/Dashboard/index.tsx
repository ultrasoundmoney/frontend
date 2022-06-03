import * as React from "react";
import SupplyView from "../SupplyView";

const DashboardPage: React.FC = () => {
  return (
    <>
      <div className="dash-wrapper wrapper bg-blue-midnightexpress min-h-screen text-white">
        <div className="pt-8 container m-auto">
          <SupplyView />
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
