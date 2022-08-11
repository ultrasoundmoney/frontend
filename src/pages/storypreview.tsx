import { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
const Story = dynamic(() => import("../components/Landing"));

const StoryPreview: NextPage = () => {
  return (
    <>
      <Head>
        <title>home - ultrasound.money</title>
      </Head>
      <Story />
    </>
  );
};
export default StoryPreview;
