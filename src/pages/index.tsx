import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
// HACK: attempt to stop constant hydration errors from happening in prod whilst trying to uncover their source.
const Dashboard = dynamic(() => import("../components/Dashboard"), {
  ssr: false,
});

const IndexPage: NextPage = () => (
  <>
    <Head>
      <title>dashboard | ultrasound.money</title>
    </Head>
    <Dashboard />
  </>
);
export default IndexPage;
