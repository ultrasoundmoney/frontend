import { useCallback, useEffect, useState } from "react";

export type NotificationState =
  | {
      type: "Unsupported";
    }
  | {
      type: "Supported";
      notificationPermission: "default" | "granted" | "denied";
      requestPermission: () => void;
      showNotification: (title: string, body?: string) => void;
    };

const useNotification = (): NotificationState => {
  const isNotificationSupported =
    typeof window !== "undefined" && "Notification" in window;

  const [notificationPermission, setNotificationPermission] = useState(
    isNotificationSupported ? Notification.permission : "denied",
  );

  const requestPermission = async () => {
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
  };

  const showNotification = useCallback(
    (title: string, body?: string) => {
      if (notificationPermission === "granted") {
        new Notification(title, { body });
      }
    },
    [notificationPermission],
  );

  const [notificationState, setNotificationState] = useState(
    isNotificationSupported
      ? ({
          type: "Supported",
          notificationPermission,
          requestPermission,
          showNotification,
        } as const)
      : ({
          type: "Unsupported",
        } as const),
  );

  useEffect(() => {
    if (!isNotificationSupported) {
      return undefined;
    }

    setNotificationState({
      type: "Supported",
      notificationPermission,
      requestPermission,
      showNotification,
    });
  }, [isNotificationSupported, notificationPermission, showNotification]);

  return notificationState;
};

export default useNotification;
