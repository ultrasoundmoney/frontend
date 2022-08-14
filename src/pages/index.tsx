import type { NextPage } from "next";
import Head from "next/head";
import Dashboard from "../components/Dashboard";

const IndexPage: NextPage = () => (
  <>
    <Head>
      <title>dashboard | ultrasound.money</title>
    </Head>
    <Dashboard />
  </>
);
export default IndexPage;
