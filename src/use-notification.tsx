import { useState } from "react";

type UseNotification =
  | {
      type: "Unsupported";
    }
  | {
      type: "Supported";
      notificationPermission: "default" | "granted" | "denied";
      requestPermission: () => void;
      showNotification: (text: string) => void;
    };

const useNotification = (): UseNotification => {
  const [notificationPermission, setNotificationPermission] = useState(
    typeof window !== "undefined" && "Notification" in window
      ? Notification.permission
      : "denied"
  );

  const isNotificationSupported =
    typeof window !== "undefined" && "Notification" in window;

  if (!isNotificationSupported) {
    return {
      type: "Unsupported",
    };
  }

  const requestPermission = () => {
    Notification.requestPermission().then((permission) => {
      setNotificationPermission(permission);
    });
  };

  const showNotification = (text: string) => {
    if (notificationPermission === "granted") {
      new Notification(text, {});
    }
  };

  return {
    type: "Supported",
    notificationPermission,
    requestPermission,
    showNotification,
  };
};

export default useNotification;
