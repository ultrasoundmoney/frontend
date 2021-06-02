import * as React from "react";
import { NextPage } from "next";
import Head from "next/head";
import Data from "../../locales/en/data.json";
import ComingSoon from "../components/ComingSoon";

type IndexPageProps = {};
const IndexPage: NextPage<IndexPageProps> = () => {
  return (
    <>
      <Head>
        <title>{Data.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ComingSoon Data={Data} />
    </>
  );
};
export default IndexPage;
