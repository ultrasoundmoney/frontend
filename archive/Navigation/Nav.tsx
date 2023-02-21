import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useBaseFeePerGas } from "../../api/base-fee-per-gas";
import { useEthPriceStats } from "../../api/eth-price-stats";
import { NavigationContext } from "../../contexts/NavigationContext";
import TranslationsContext from "../../contexts/TranslationsContext";
import { useLocalStorage } from "../../hooks/use-local-storage";
import useNotification from "../../hooks/use-notification";
import { navigationItems } from "../../utils/static";
import AlarmInput from "../TopBar/AlarmInput";
import PriceGasWidget from "../TopBar/PriceGasWidget";
import { WidgetTitle } from "../WidgetSubcomponents";
import classes from "./Navigation.module.scss";

const Nav: React.FC = () => {
  const t = React.useContext(TranslationsContext);
  const [isOpen, setIsOpen] = useState(false);
  const defaultBar = useRef<null | HTMLDivElement>(null);
  const { faqPosition } = React.useContext(NavigationContext);
  const baseFeePerGas = useBaseFeePerGas();
  const ethPriceStats = useEthPriceStats();

  const [gasAlarmActive, setGasAlarmActive] = useLocalStorage(
    "gas-alarm-enabled",
    false,
  );
  const [ethAlarmActive, setEthAlarmActive] = useLocalStorage(
    "eth-alarm-enabled",
    false,
  );
  const [showAlarmDialog, setShowAlarmDialog] = useState(false);
  const notification = useNotification();
  const dialogRef = useRef<HTMLDivElement>(null);
  const alarmButtonRef = useRef<HTMLButtonElement>(null);

  const isAlarmActive = gasAlarmActive || ethAlarmActive;

  const checkIfClickedOutside = useCallback(
    (e: MouseEvent) => {
      if (
        !showAlarmDialog ||
        e.target === null ||
        (dialogRef.current !== null &&
          dialogRef.current.contains(e.target as Node)) ||
        (alarmButtonRef.current !== null &&
          alarmButtonRef.current.contains(e.target as Node))
      ) {
        return;
      }

      setShowAlarmDialog(false);
    },
    [showAlarmDialog],
  );

  const handleClickAlarm = useCallback(() => {
    setShowAlarmDialog(!showAlarmDialog);
  }, [showAlarmDialog]);

  const showAlarmDialogCss = showAlarmDialog ? "visible" : "invisible";

  const isAlarmValuesAvailable =
    typeof baseFeePerGas?.wei === "number" &&
    typeof ethPriceStats?.usd === "number";

  useEffect(() => {
    document.addEventListener("click", checkIfClickedOutside);

    return () => {
      document.removeEventListener("click", checkIfClickedOutside);
    };
  });

  const openCloseNavHandler = () => setIsOpen((prevVal) => !prevVal);

  const moveToFaq = () => window.scrollTo(0, faqPosition);

  return (
    <nav className="fixed z-10 mb-3 flex w-full flex-wrap items-center justify-between bg-transparent px-2 py-6">
      <div
        ref={defaultBar}
        className={`${classes.defaultBar} container mx-auto flex items-center justify-between px-1 md:px-4`}
      >
        <div className="relative flex">
          {baseFeePerGas !== undefined && ethPriceStats !== undefined && (
            <PriceGasWidget />
          )}
          <button
            ref={alarmButtonRef}
            className={`
              ml-4 flex
              select-none items-center rounded
              border border-transparent
              bg-slateus-700
              px-3 py-2
              ${
                notification.type === "Supported" && isAlarmValuesAvailable
                  ? "visible"
                  : "invisible"
              }
              ${
                isAlarmActive
                  ? "rounded-sm border-slateus-400 bg-slateus-600 text-white"
                  : ""
              }
            `}
            onClick={handleClickAlarm}
          >
            <img src="/alarm-icon.svg" alt="bell icon" width="12" height="14" />
          </button>

          <div
            ref={dialogRef}
            className={`absolute top-12 w-full rounded bg-slateus-700 p-8 md:top-12 ${showAlarmDialogCss}`}
          >
            <WidgetTitle>price alerts</WidgetTitle>
            <AlarmInput
              isAlarmActive={gasAlarmActive}
              onToggleIsAlarmActive={setGasAlarmActive}
              unit="Gwei"
              type="gas"
            />
            <AlarmInput
              isAlarmActive={ethAlarmActive}
              onToggleIsAlarmActive={setEthAlarmActive}
              unit="USD "
              type="eth"
            />
            {notification.type === "Supported" &&
              notification.permission === "denied" && (
                <p className="mt-4 text-sm text-red-400">
                  notifications disabled, please grant notification permission.
                </p>
              )}
          </div>
        </div>
        <div className="hidden w-full md:block md:w-6/12" id="menu">
          <ul className="relative mt-4 flex list-none flex-col items-center justify-end text-sm md:mt-0 md:flex-row">
            <li className="nav-item justify-center pl-6">
              <button
                onClick={moveToFaq}
                className="flex items-center px-3 py-2 leading-snug text-slateus-400 outline-none hover:cursor-pointer hover:text-white hover:opacity-75"
              >
                {t.landing_faq_link}
              </button>
            </li>
            <li className="nav-item justify-center" style={{ paddingLeft: 75 }}>
              <Link href="/dashboard" legacyBehavior>
                <a className="flex items-center rounded-3xl border-2 border-solid border-white  px-5 py-2 text-sm font-medium text-white hover:border-slateus-400 hover:text-blue-shipcove">
                  {t.landing_dashboard_link}
                  <img
                    className="ml-6"
                    src={`/arrowRight.svg`}
                    alt="arrow-right"
                  />
                </a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="fixed right-5 -mr-2 flex md:hidden">
          <img
            alt="icon indicating a hamburger or navigation menu"
            onClick={openCloseNavHandler}
            src="/images/burger_menu_icon.svg"
            width={24}
            height={24}
          />
        </div>
      </div>
      <div
        className={
          `${classes.sidebar} w-full` + (isOpen ? ` block ${classes.open}` : "")
        }
        id="mobile-menu"
      >
        <div className="relative space-y-1 px-2 pt-20 pb-3 sm:px-3">
          <div className="absolute right-5 top-2">
            <img
              alt="cross icon indicating a hamburger or navigation menu"
              onClick={openCloseNavHandler}
              src="/images/cross_icon.svg"
              width={24}
              height={24}
            />
          </div>
          <ul className={classes.mobileNavList}>
            {navigationItems.map((navItem) => (
              <li
                key={navItem.id}
                className={classes.mobileNavList__item}
                onClick={openCloseNavHandler}
              >
                <a href={navItem.anchor}>{navItem.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
