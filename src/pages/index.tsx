import type { NextPage } from "next";
import Head from "next/head";
import { feesBasePath } from "../api/fees";
import type { GroupedAnalysis1F } from "../api/grouped-analysis-1";
import { decodeGroupedAnalysis1 } from "../api/grouped-analysis-1";
import Dashboard from "../components/Dashboard";

const IndexPage: NextPage<Props> = ({ groupedAnalysis1F }) => (
  <>
    <Head>
      <title>dashboard | ultrasound.money</title>
    </Head>
    <Dashboard />
  </>
);
export default IndexPage;
