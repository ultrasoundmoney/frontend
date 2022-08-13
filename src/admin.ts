import { useEffect, useState } from "react";

export const useAdminToken = () => {
  const [adminToken, setAdminToken] = useState<string>();

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const urlSearchParams = new URLSearchParams(window.location.search);
    const adminToken = urlSearchParams.get("admin-token");

    if (typeof adminToken !== "string" || adminToken.length === 0) {
      return undefined;
    }

    setAdminToken(adminToken);
  }, []);

  return adminToken;
};
