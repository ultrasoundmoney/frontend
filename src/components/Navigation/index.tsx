import * as React from "react";
import Link from "next/link";
import twemoji from "twemoji";
import TranslationsContext from "../../contexts/TranslationsContext";
import styles from "./Navigation.module.scss";

const Navigation: React.FC = () => {
  const t = React.useContext(TranslationsContext);
  const ethPrice = `$2,391.94 <span class="text-green-500 px-2">(+2.13%)</span>• ⛽️ 8 Gwei`;
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  return (
    <>
      <nav className="relative mb-3 flex flex-wrap items-center justify-between bg-transparent px-2 py-6">
        <div className="container mx-auto flex flex-wrap items-center justify-between px-1 md:px-4">
          <div className="relative flex w-full justify-start md:w-5/12 lg:static lg:justify-start">
            <div className="flex-initial pr-2 lg:pr-8">
              <Link href="/">
                <img
                  className="max-w-max"
                  src={`/ethereum-logo-2014-5.svg`}
                  alt={t.title}
                />
              </Link>
            </div>
            <div
              className="eth-price-gass-emoji flex flex-initial self-center bg-slateus-700 px-2 py-2 text-xs text-white md:px-3 lg:text-sm"
              dangerouslySetInnerHTML={{
                __html: String(twemoji.parse(ethPrice)),
              }}
            />
          </div>
          <div
            className={
              "w-full items-center md:flex md:w-7/12 md:flex-grow" +
              (navbarOpen ? " md:flex" : " hidden")
            }
            id="menu"
          >
            <ul className="mt-4 flex list-none  flex-col md:mt-0 md:flex-row lg:ml-auto">
              <li className="nav-item justify-center lg:px-4 xl:px-8">
                <Link href="/" legacyBehavior>
                  <a className="flex items-center px-3 py-2 leading-snug text-slateus-400 hover:text-white hover:opacity-75">
                    dashboard
                  </a>
                </Link>
              </li>
              <li className="nav-item justify-center lg:px-4 xl:px-8">
                <Link href="/" legacyBehavior>
                  <a className="flex items-center px-3 py-2 leading-snug text-slateus-400 hover:text-white hover:opacity-75">
                    q&a
                  </a>
                </Link>
              </li>
              <li className="nav-item justify-center lg:px-4 xl:px-8">
                <a
                  className="flex items-center px-3 py-2 leading-snug text-slateus-400 hover:text-white hover:opacity-75"
                  href="#faqs"
                >
                  resources
                </a>
              </li>
              <li className="nav-item justify-center lg:px-4 xl:px-8">
                <a
                  className="flex items-center rounded-3xl border-2 border-solid border-white px-3 py-2 font-medium text-white hover:border-slateus-400 hover:text-blue-shipcove"
                  href="#join-the-community"
                >
                  join the fam
                </a>
              </li>
            </ul>
          </div>
          <button
            className={`${styles.hamburgerMenu} block cursor-pointer rounded border border-solid border-white bg-transparent text-xl leading-none text-white outline-none focus:outline-none md:hidden`}
            type="button"
            onClick={() => setNavbarOpen(!navbarOpen)}
          >
            <span className="relative block h-px w-6 rounded-sm bg-white"></span>
            <span className="relative mt-1 block h-px w-6 rounded-sm bg-white"></span>
            <span className="relative mt-1 block h-px w-6 rounded-sm bg-white"></span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
