import * as React from "react";
import { NextPage } from "next";
import Head from "next/head";
import * as Data from "../../locales/en/data.json";

type IndexPageProps = {};
const IndexPage: NextPage<IndexPageProps> = () => {
  return (
    <>
      <div className="block w-full">
        <Head>
          <title>{Data.title}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="h-48 flex flex-wrap content-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">{Data.title}</span>
            <span className="block text-indigo-600">{Data.subtitle}</span>
            <p>{Data.xzy}</p>
          </h2>
        </div>
      </div>
    </>
  );
};
export default IndexPage;
