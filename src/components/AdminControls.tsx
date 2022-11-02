import * as DateFns from "date-fns";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { useAdminToken } from "../hooks/use-admin-token";
import * as Contracts from "../api/contracts";

const onSetTwitterHandle = async (
  address: string,
  token: string | undefined,
) => {
  const handle = window.prompt(`input twitter handle`);
  if (handle === null) {
    return;
  }
  await Contracts.setContractTwitterHandle(address, handle, token);
};

const onSetName = async (address: string, token: string | undefined) => {
  const nameInput = window.prompt(`input name`);
  if (nameInput === null) {
    return;
  }
  await Contracts.setContractName(address, nameInput, token);
};

const onSetCategory = async (address: string, token: string | undefined) => {
  const category = window.prompt(`input category`);
  if (category === null) {
    return;
  }
  await Contracts.setContractCategory(address, category, token);
};

const getOpacityFromAge = (now: Date | undefined, dt: Date | undefined) =>
  dt === undefined || now === undefined
    ? 0.8
    : Math.min(0.8, 0.2 + (0.6 / 168) * DateFns.differenceInHours(now, dt));

const AdminControls: FC<{
  address: string;
  freshness: Contracts.MetadataFreshness | undefined;
}> = ({ address, freshness }) => {
  const adminToken = useAdminToken();
  const [now, setNow] = useState<Date>();

  useEffect(() => {
    setNow(new Date());
  }, []);

  return (
    <>
      <div className="flex flex-row gap-4 opacity-80">
        <a
          className="cursor-pointer text-pink-300 hover:text-pink-300 hover:opacity-60"
          onClick={() => {
            onSetTwitterHandle(address, adminToken).catch(console.error);
          }}
          target="_blank"
          rel="noreferrer"
        >
          set handle
        </a>
        <a
          className="cursor-pointer text-pink-300 hover:text-pink-300 hover:opacity-60"
          onClick={() => {
            onSetName(address, adminToken).catch(console.error);
          }}
          target="_blank"
          rel="noreferrer"
        >
          set name
        </a>
        <a
          className="cursor-pointer text-pink-300 hover:text-pink-300 hover:opacity-60"
          onClick={() => {
            onSetCategory(address, adminToken).catch(console.error);
          }}
          target="_blank"
          rel="noreferrer"
        >
          set category
        </a>
        <a
          className="cursor-pointer text-pink-300 hover:text-pink-300 hover:opacity-60"
          onClick={() => {
            Contracts.setContractLastManuallyVerified(
              address,
              adminToken,
            ).catch(console.error);
          }}
          target="_blank"
          rel="noreferrer"
        >
          set verified
        </a>
      </div>
      <div className="mt-2 flex gap-x-4 text-sm text-white">
        <span
          className="rounded-lg bg-slate-700 py-1 px-2"
          style={{
            opacity: getOpacityFromAge(
              now,
              freshness?.openseaContractLastFetch,
            ),
          }}
        >
          {freshness?.openseaContractLastFetch === undefined
            ? "never fetched"
            : `opensea fetch ${DateFns.formatDistanceToNowStrict(
                freshness.openseaContractLastFetch,
              )} ago`}
        </span>
        <span
          className="rounded-lg bg-slate-700 py-1 px-2"
          style={{
            opacity: getOpacityFromAge(now, freshness?.lastManuallyVerified),
          }}
        >
          {freshness?.lastManuallyVerified === undefined
            ? "never verified"
            : `last verified ${DateFns.formatDistanceToNowStrict(
                freshness.lastManuallyVerified,
              )} ago`}
        </span>
      </div>
    </>
  );
};

export default AdminControls;
