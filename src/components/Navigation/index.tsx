import * as React from "react";
import Link from "next/link";
import EthLogo from "../../assets/ethereum-logo-2014-5.svg";

const Navigation: React.FC<{ Data?: Data }> = ({ Data }) => {
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  return (
    <>
      <nav className="relative flex flex-wrap items-center justify-between px-2 py-6 bg-transparent mb-3">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <Link href="/">
              <img src={EthLogo} alt={Data.title} />
            </Link>
            <button
              className="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-white rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <span className="block relative w-6 h-px rounded-sm bg-white"></span>
              <span className="block relative w-6 h-px rounded-sm bg-white mt-1"></span>
              <span className="block relative w-6 h-px rounded-sm bg-white mt-1"></span>
            </button>
          </div>
          <div
            className={
              "lg:flex flex-grow items-center" +
              (navbarOpen ? " flex" : " hidden")
            }
            id="example-navbar-danger"
          >
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
              <li className="nav-item">
                <Link href="/">
                  <a
                    className="px-3 py-2 flex items-center text-xs leading-snug text-blue-shipcove hover:opacity-75"
                    href="/"
                  >
                    The Data
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/">
                  <a
                    className="px-3 py-2 flex items-center text-xs leading-snug text-blue-shipcove hover:opacity-75"
                    href="/"
                  >
                    Resources
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                <a
                  className="px-3 py-2 flex items-center text-xs leading-snug text-blue-shipcove hover:opacity-75"
                  href="#faqs"
                >
                  FAQs
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="px-3 py-2 flex items-center text-xs text-blue-shipcove hover:opacity-75 border-blue-shipcove border-solid border-2 rounded-3xl"
                  href="#join-the-community"
                >
                  Join The Community
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
