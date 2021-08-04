import * as React from "react";
import Link from "next/link";
import EthLogo from "../../assets/ethereum-logo-2014-5.svg";
import twemoji from "twemoji";
import { TranslationsContext } from "../../translations-context";

const Navigation: React.FC<{}> = () => {
  const t = React.useContext(TranslationsContext);
  const ethPrice = `$2,391.94 <span class="text-green-500 px-2">(+2.13%)</span>• ⛽️ 8 Gwei`;
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  return (
    <>
      <nav className="relative flex flex-wrap items-center justify-between px-2 py-6 bg-transparent mb-3">
        <div className="container px-1 md:px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full md:w-5/12 relative flex justify-start lg:static lg:justify-start">
            <div className="flex-initial pr-2 lg:pr-8">
              <Link href="/">
                <img className="max-w-max" src={EthLogo} alt={t.title} />
              </Link>
            </div>
            <div
              className="flex-initial flex text-white self-center bg-blue-tangaroa px-2 md:px-3 py-2 text-xs lg:text-sm eth-price-gass-emoji"
              dangerouslySetInnerHTML={{
                __html: twemoji.parse(ethPrice),
              }}
            />
          </div>
          <div
            className={
              "w-full md:w-7/12 md:flex md:flex-grow items-center" +
              (navbarOpen ? " md:flex" : " hidden")
            }
            id="menu"
          >
            <ul className="flex flex-col md:flex-row  list-none lg:ml-auto mt-4 md:mt-0">
              <li className="nav-item lg:px-4 xl:px-8 justify-center">
                <Link href="/">
                  <a
                    className="px-3 py-2 flex items-center leading-snug text-blue-shipcove hover:opacity-75 hover:text-white"
                    href="/"
                  >
                    dashboard
                  </a>
                </Link>
              </li>
              <li className="nav-item lg:px-4 xl:px-8 justify-center">
                <Link href="/">
                  <a
                    className="px-3 py-2 flex items-center leading-snug text-blue-shipcove hover:opacity-75 hover:text-white"
                    href="/"
                  >
                    q&a
                  </a>
                </Link>
              </li>
              <li className="nav-item lg:px-4 xl:px-8 justify-center">
                <a
                  className="px-3 py-2 flex items-center leading-snug text-blue-shipcove hover:opacity-75 hover:text-white"
                  href="#faqs"
                >
                  resources
                </a>
              </li>
              <li className="nav-item lg:px-4 xl:px-8 justify-center">
                <a
                  className="px-3 py-2 flex items-center font-medium text-white hover:text-blue-shipcove border-white border-solid border-2 rounded-3xl hover:border-blue-shipcove"
                  href="#join-the-community"
                >
                  join the fam
                </a>
              </li>
            </ul>
          </div>
          <button
            className="hamburger-menu text-white cursor-pointer text-xl leading-none border border-solid border-white rounded bg-transparent block md:hidden outline-none focus:outline-none"
            type="button"
            onClick={() => setNavbarOpen(!navbarOpen)}
          >
            <span className="block relative w-6 h-px rounded-sm bg-white"></span>
            <span className="block relative w-6 h-px rounded-sm bg-white mt-1"></span>
            <span className="block relative w-6 h-px rounded-sm bg-white mt-1"></span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
