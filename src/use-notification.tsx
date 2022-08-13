import { useCallback, useEffect, useMemo, useState } from "react";

export type NotificationState =
  | {
      type: "Unsupported";
    }
  | {
      type: "Supported";
      notificationPermission: "default" | "granted" | "denied";
      requestPermission: () => Promise<void>;
      showNotification: (title: string, body?: string) => void;
    };

const useNotification = (): NotificationState => {
  const [isNotificationSupported, setIsNotificationSupported] =
    useState<boolean>();
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>();

  useEffect(() => {
    const isNotificationSupported =
      typeof window !== "undefined" && "Notification" in window;
    setIsNotificationSupported(isNotificationSupported);
    if (isNotificationSupported) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isNotificationSupported) {
      return undefined;
    }

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
  }, [isNotificationSupported]);

  const showNotification = useCallback(
    (title: string, body?: string) => {
      if (notificationPermission !== "granted") {
        return;
      }

      new Notification(title, { body });
    },
    [notificationPermission],
  );

  const notificationState = useMemo((): NotificationState => {
    if (!isNotificationSupported || notificationPermission === undefined) {
      return { type: "Unsupported" } as const;
    }

    return {
      type: "Supported",
      notificationPermission,
      requestPermission,
      showNotification,
    } as const;
  }, [
    isNotificationSupported,
    notificationPermission,
    requestPermission,
    showNotification,
  ]);

  return notificationState;
};

export default useNotification;
