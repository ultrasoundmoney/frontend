import {
  json,
  LoaderArgs,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { group, groupCollapsed } from "console";
import { useEffect, useState } from "react";
import { feesBasePath } from "~/api/fees";
import Dashboard from "~/components/Dashboard";
import styles from "~/styles/index.css";
import {
  GroupedAnalysis1,
  useGroupedAnalysis1,
} from "~/api/grouped-analysis-1";
import {
  decodeEthSupply,
  EthSupplyParts,
  EthSupplyPartsF,
} from "~/api/eth-supply";

export function links() {
  return [
    {
      rel: "stylesheet",
      href: styles,
    },
  ];
}

export const meta: MetaFunction = () => ({
  title: "dashboard | Ultra Sound Money",
});

export const loader: LoaderFunction = async () => {
  const [groupedAnalysis1Res, ethSupplyPartsRes] = await Promise.all([
    fetch(`${feesBasePath}/grouped-analysis-1`),
    fetch(`${feesBasePath}/eth-supply`),
  ]);

  return json({
    groupedAnalysis1: await groupedAnalysis1Res.json(),
    ethSupplyParts: await ethSupplyPartsRes.json(),
  });
};

export default function Index() {
  const { ethSupplyParts, groupedAnalysis1 } = useLoaderData();
  // const groupedAnalysis1Polled = useGroupedAnalysis1();
  return (
    <Dashboard
      ethSupplyParts={decodeEthSupply(ethSupplyParts)}
      // groupedAnalysis1={groupedAnalysis1Polled ?? groupedAnalysis1}
      groupedAnalysis1={groupedAnalysis1}
    />
  );
}
