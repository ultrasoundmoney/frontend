import Head from "next/head";

export default function Home() {
  return (
    <div className="block w-full">
      <Head>
        <title>Ultra Sound Money: ETH</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-48 flex flex-wrap content-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          <span className="block">You are ready for EIP 1559</span>
          <span className="block text-indigo-600">Wait for July 14 2021</span>
        </h2>
      </div>
    </div>
  );
}
