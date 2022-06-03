import React, { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { StepperContext, StepperPoint } from "../../context/StepperContext";
import classes from "./Navigation.module.scss";
import { navigationItems } from "../../utils/static";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollYProgress, setScrollYProgress] = useState(0);
  const defaultBar = useRef<null | HTMLDivElement>(null);
  const stepperPoints = useContext(StepperContext);

  const handleScroll = () => setScrollYProgress(window.scrollY);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const controlPoints: StepperPoint[] = stepperPoints?.stepperElements
    ? Object.keys(stepperPoints.stepperElements).map((element) => {
        return stepperPoints?.stepperElements[element];
      })
    : [];
  useEffect((): void => {
    if (Array.isArray(controlPoints) && controlPoints.length > 0) {
      if (window.scrollY > controlPoints[0].offsetY - window.innerHeight / 2) {
        defaultBar.current?.classList.add("hidden_bar");
      } else {
        defaultBar.current?.classList.remove("hidden_bar");
      }
    }
  }, [scrollYProgress]);

  const openCloseNavHandler = () => setIsOpen((prevVal) => !prevVal);

  return (
    <nav className="fixed w-full flex flex-wrap items-center justify-between px-2 py-6 bg-transparent mb-3 z-10">
      <div
        ref={defaultBar}
        className="default_bar container px-1 md:px-4 mx-auto flex items-center justify-end"
      >
        <div className="w-full md:w-6/12 hidden md:block" id="menu">
          <ul className="flex flex-col items-center md:flex-row justify-end list-none mt-4 md:mt-0 relative text-sm">
            <li className="nav-item pl-6 justify-center">
              <a
                className="px-3 py-2 flex items-center leading-snug text-blue-shipcove hover:opacity-75 hover:text-white hover:cursor-pointer"
                href="#faq"
              >
                FAQ
              </a>
            </li>
            <li className="nav-item justify-center" style={{ paddingLeft: 75 }}>
              <a
                className="px-5 py-2 flex items-center font-medium text-white hover:text-blue-shipcove border-white border-solid border-2 rounded-3xl hover:border-blue-shipcove"
                href="#join-the-fam"
              >
                Join the fam
              </a>
            </li>
          </ul>
        </div>
        <div className="-mr-2 flex md:hidden fixed right-5 -top-1">
          <Image
            onClick={openCloseNavHandler}
            src="/images/burger_menu_icon.svg"
            width={24}
            height={24}
          />
        </div>
      </div>
      <div
        className={
          "sidebar w-full" + (isOpen ? " block sidebar-open" : " sidebar-close")
        }
        id="mobile-menu"
      >
        <div className="px-2 pt-20 pb-3 space-y-1 sm:px-3 relative">
          <div className="absolute right-5 top-2">
            <Image
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
