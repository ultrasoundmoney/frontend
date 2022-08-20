import type { NextPage } from "next";
import dynamic from "next/dynamic";

// HACK: attempt to stop constant hydration errors from happening in prod whilst trying to uncover their source.
const Dashboard = dynamic(() => import("../components/Dashboard"), {
  ssr: false,
});

const IndexPage: NextPage = () => <Dashboard />;
export default IndexPage;
