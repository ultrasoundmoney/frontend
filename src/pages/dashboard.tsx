import { NextPage } from "next";
import Head from "next/head";
import Dashboard from "../components/Dashboard";

const DashboardPage: NextPage = () => (
  <>
    <Head>
      <title>dashboard - ultrasound.money</title>
    </Head>
    <Dashboard />
  </>
);

export default DashboardPage;
