import { useCallback, useEffect, useMemo, useState } from "react";

export type NotificationState =
  | {
      type: "Unsupported";
    }
  | {
      type: "Supported";
      permission: NotificationPermission;
      requestPermission: () => Promise<void>;
      showNotification: (title: string, body?: string) => void;
    };

const getIsMobile = (): boolean => {
  if (typeof navigator === "undefined") {
    return false;
  }

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
};

const useNotification = (): NotificationState => {
  const [isNotificationSupported, setIsNotificationSupported] =
    useState<boolean>();
  const [permission, setPermission] = useState<NotificationPermission>();

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("Notification" in window) ||
      getIsMobile()
    ) {
      setIsNotificationSupported(false);
      return undefined;
    }

    setIsNotificationSupported(true);
    setPermission(Notification.permission);
  }, []);

  // Notification permission may change without this component rerendering, to catch that we periodically chcek.
  useEffect(() => {
    if (!isNotificationSupported) {
      return undefined;
    }

    const id = setInterval(() => {
      if (permission !== Notification.permission) {
        setPermission(Notification.permission);
      }
    }, 2000);
    return () => clearInterval(id);
  });

  const requestPermission = useCallback(async () => {
    if (!isNotificationSupported) {
      return undefined;
    }

    const permission = await Notification.requestPermission();
    setPermission(permission);
  }, [isNotificationSupported]);

  const showNotification = useCallback(
    (title: string, body?: string) => {
      if (permission !== "granted") {
        return;
      }

      new Notification(title, { body });
    },
    [permission],
  );

  const notificationState = useMemo((): NotificationState => {
    if (!isNotificationSupported || permission === undefined) {
      return { type: "Unsupported" } as const;
    }

    return {
      type: "Supported",
      permission: permission,
      requestPermission,
      showNotification,
    } as const;
  }, [
    isNotificationSupported,
    permission,
    requestPermission,
    showNotification,
  ]);

  return notificationState;
};

export default useNotification;
