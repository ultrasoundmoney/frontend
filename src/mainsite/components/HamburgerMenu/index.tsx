import type { StaticImageData } from "next/legacy/image";
import Image from "next/legacy/image";
import Link from "next/link";
import type { FC } from "react";
import { useState } from "react";
import hamburgerSvg from "./hamburger.svg";
import crossSvg from "./cross.svg";

const HamburgerMenu: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="z-20 flex items-center"
        onClick={() => setIsOpen(true)}
      >
        <Image
          alt="three horizontal lines resembling a hamburger indicating a navigation menu"
          src={hamburgerSvg as StaticImageData}
          width={24}
          height={24}
        />
      </button>
      <div
        className={`
          fixed top-0 left-0 bottom-0 right-0
          z-20 flex
          justify-center
          bg-slateus-700
          transition-all
          ${isOpen ? "visible opacity-95" : "invisible opacity-0"}
        `}
      >
        <button
          className="absolute top-5 right-4 md:top-10 md:right-10"
          onClick={() => setIsOpen(false)}
        >
          <Image
            alt="three horizontal lines resembling a hamburger indicating a navigation menu"
            src={crossSvg as StaticImageData}
            width={24}
            height={24}
          />
        </button>
        <ul className="mt-32 flex flex-col gap-y-12 text-center">
          <li>
            <Link href="/" legacyBehavior>
              <a className="font-inter text-4xl font-extralight text-white">
                dashboard
              </a>
            </Link>
          </li>
          <li onClick={() => setIsOpen(false)}>
            <Link href="/fam" legacyBehavior>
              <a className="font-inter text-4xl font-extralight text-white">
                fam
              </a>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default HamburgerMenu;
