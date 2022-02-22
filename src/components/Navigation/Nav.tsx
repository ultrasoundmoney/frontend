import React, { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import EthLogo from "../../assets/ethereum-logo-2014-5.svg";
import twemoji from "twemoji";
import { TranslationsContext } from "../../translations-context";
import useSWR from "swr";
import { formatUsdZeroDigit } from "../../format";
import { StepperContext } from "../../context/StepperContext";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollYProgress, setScrollYProgress] = useState(0);
  const defaultBar = useRef<null | HTMLDivElement>(null);
  const stepperPoints = useContext(StepperContext);

  const t = React.useContext(TranslationsContext);
  const { data } = useSWR(
    "https://ethgas.watch/api/gas",
    (url: string) => fetch(url).then((r) => r.json()),
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  const handleScroll = () => {
    setScrollYProgress(window.scrollY);
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const controlPoints: any[] = Object.keys(
    stepperPoints?.stepperElements as {}
  ).map((element) => {
    return stepperPoints?.stepperElements[element];
  });
  useEffect((): void => {
    if (Array.isArray(controlPoints) && controlPoints.length > 0) {
      if (window.scrollY > controlPoints[0].offsetY - window.innerHeight / 2) {
        defaultBar.current?.classList.add("hidden_bar");
      } else {
        defaultBar.current?.classList.remove("hidden_bar");
      }
    }
  }, [scrollYProgress]);

  const gewi = data && data.sources && data.sources[0];
  const ethPrice = !data
    ? `0 <span class="pl-1">⛽️0 Gwei</span>`
    : `$${formatUsdZeroDigit(data?.ethPrice)}  <span class="pl-1">⛽️${
        gewi.standard
      } Gwei</span>`;

  return (
    <nav className="fixed w-full flex flex-wrap items-center justify-between px-2 py-6 bg-transparent mb-3 z-10">
      <div
        ref={defaultBar}
        className="default_bar container px-1 md:px-4 mx-auto flex flex-wrap items-center justify-between"
      >
        <div className="w-full md:w-6/12 relative flex justify-start lg:static lg:justify-start">
          <div className="flex-initial pr-2 lg:pr-8">
            <Link href="/">
              <img className="max-w-max" src={EthLogo} alt={t.title} />
            </Link>
          </div>
          <div
            className="flex-initial flex text-white self-center bg-blue-tangaroa px-2 md:px-3 py-2 text-xs lg:text-sm eth-price-gass-emoji font-roboto"
            dangerouslySetInnerHTML={{
              __html: twemoji.parse(ethPrice),
            }}
          />
        </div>
        <div className="w-full md:w-6/12 hidden md:block" id="menu">
          <ul className="flex flex-col md:flex-row justify-end list-none mt-4 md:mt-0 relative text-sm">
            <li className="nav-item pl-6 justify-center">
              <Link href="#faq">
                <a
                  className="px-3 py-2 flex items-center leading-snug text-blue-shipcove hover:opacity-75 hover:text-white hover:cursor-pointer"
                  href="#faq"
                >
                  FAQ
                </a>
              </Link>
            </li>
            <li className="nav-item justify-center" style={{ paddingLeft: 75 }}>
              <a
                className="px-5 py-2 flex items-center font-medium text-white hover:text-blue-shipcove border-white border-solid border-2 rounded-3xl hover:border-blue-shipcove"
                href="#join-the-fam"
              >
                join the fam
              </a>
            </li>
          </ul>
        </div>
        <div className="-mr-2 flex md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="hamburger-menu text-white cursor-pointer text-xl leading-none rounded bg-transparent block md:hidden outline-none focus:outline-none"
            aria-controls="mobile-menu"
            aria-expanded="false"
          >
            <span className="sr-only" />
            {!isOpen ? (
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            ) : (
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
      <div
        className={
          "sidebar" + (isOpen ? " block sidebar-open" : " sidebar-close")
        }
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <ul className="inline-block list-none mt-4">
            <li className="my-4">
              <Link href="#faq">
                <a
                  className="text-center text-xs leading-snug text-blue-shipcove hover:opacity-75 hover:text-white"
                  href="#faq"
                >
                  FAQ
                </a>
              </Link>
            </li>
            <li className="my-4">
              <a
                className="px-3 py-2 flex justify-center font-medium text-sm  text-white hover:text-blue-shipcove border-white border-solid border-2 rounded-3xl hover:border-blue-shipcove"
                href="#join-the-fam"
              >
                join the fam
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
