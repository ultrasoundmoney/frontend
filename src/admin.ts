import { useEffect, useState } from "react";

export const useAdminToken = () => {
  const [adminToken, setAdminToken] = useState<string>();
  const isWindowPresent = typeof window !== "undefined";
  const searchQuery = isWindowPresent && window.location.search;

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const adminToken = urlSearchParams.get("admin-token");

    if (typeof adminToken !== "string" || adminToken.length === 0) {
      return undefined;
    }

    setAdminToken(adminToken);
  }, [isWindowPresent, searchQuery]);

  return adminToken;
};
