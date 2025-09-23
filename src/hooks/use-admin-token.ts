import { useEffect, useState } from "react";

export const useAdminToken = (): string | undefined => {
  const [adminToken, setAdminToken] = useState<string>();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const token = window.localStorage.getItem("admin-token");
    if (typeof token === "string") {
      setAdminToken(token);
    }
  }, []);

  return adminToken;
};