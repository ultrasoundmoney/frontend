import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import type { BaseFeePerGas } from "../../api/base-fee-per-gas";
import type { EthPriceStats } from "../../api/eth-price-stats";
import { NavigationContext } from "../../contexts/NavigationContext";
import TranslationsContext from "../../contexts/TranslationsContext";
import { useLocalStorage } from "../../hooks/use-local-storage";
import useNotification from "../../hooks/use-notification";
import { navigationItems } from "../../utils/static";
import AlarmInput from "../TopBar/AlarmInput";
import PriceGasWidget from "../TopBar/PriceGasWidget";
import { WidgetTitle } from "../WidgetSubcomponents";
import classes from "./Navigation.module.scss";

const Nav: React.FC<{
  baseFeePerGas: BaseFeePerGas;
  ethPriceStats: EthPriceStats;
}> = ({ baseFeePerGas, ethPriceStats }) => {
  const t = React.useContext(TranslationsContext);
  const [isOpen, setIsOpen] = useState(false);
  const defaultBar = useRef<null | HTMLDivElement>(null);
  const { faqPosition } = React.useContext(NavigationContext);

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
    <nav className="fixed w-full flex flex-wrap items-center justify-between px-2 py-6 bg-transparent mb-3 z-10">
      <div
        ref={defaultBar}
        className={`${classes.defaultBar} container px-1 md:px-4 mx-auto flex items-center justify-between`}
      >
        <div className="flex relative">
          {baseFeePerGas !== undefined && ethPriceStats !== undefined && (
            <PriceGasWidget
              initialBaseFeePerGas={0}
              initialEthPrice={0}
              baseFeePerGas={baseFeePerGas}
              ethPriceStats={ethPriceStats}
            />
          )}
          <button
            ref={alarmButtonRef}
            className={`
              flex items-center
              px-3 py-2 ml-4
              bg-blue-tangaroa rounded
              select-none
              border border-transparent
              ${
                notification.type === "Supported" && isAlarmValuesAvailable
                  ? "visible"
                  : "invisible"
              }
              ${
                isAlarmActive
                  ? "text-white border-blue-highlightborder rounded-sm bg-blue-highlightbg"
                  : ""
              }
            `}
            onClick={handleClickAlarm}
          >
            <img src="/alarm-icon.svg" alt="bell icon" width="12" height="14" />
          </button>

          <div
            ref={dialogRef}
            className={`absolute w-full bg-blue-tangaroa rounded p-8 top-12 md:top-12 ${showAlarmDialogCss}`}
          >
            <WidgetTitle>price alerts</WidgetTitle>
            <AlarmInput
              baseFeePerGas={baseFeePerGas}
              ethPriceStats={ethPriceStats}
              isAlarmActive={gasAlarmActive}
              onToggleIsAlarmActive={setGasAlarmActive}
              unit="Gwei"
              type="gas"
            />
            <AlarmInput
              baseFeePerGas={baseFeePerGas}
              ethPriceStats={ethPriceStats}
              isAlarmActive={ethAlarmActive}
              onToggleIsAlarmActive={setEthAlarmActive}
              unit="USD "
              type="eth"
            />
            {notification.type === "Supported" &&
              notification.permission === "denied" && (
                <p className="text-sm text-red-400 mt-4">
                  notifications disabled, please grant notification permission.
                </p>
              )}
          </div>
        </div>
        <div className="w-full md:w-6/12 hidden md:block" id="menu">
          <ul className="flex flex-col items-center md:flex-row justify-end list-none mt-4 md:mt-0 relative text-sm">
            <li className="nav-item pl-6 justify-center">
              <button
                onClick={moveToFaq}
                className="px-3 py-2 outline-none flex items-center leading-snug text-blue-shipcove hover:opacity-75 hover:text-white hover:cursor-pointer"
              >
                {t.landing_faq_link}
              </button>
            </li>
            <li className="nav-item justify-center" style={{ paddingLeft: 75 }}>
              <Link href="/dashboard">
                <a className="px-5 py-2 flex items-center font-medium text-sm  text-white hover:text-blue-shipcove border-white border-solid border-2 rounded-3xl hover:border-blue-shipcove">
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
        <div className="-mr-2 flex md:hidden fixed right-5">
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
        <div className="px-2 pt-20 pb-3 space-y-1 sm:px-3 relative">
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
