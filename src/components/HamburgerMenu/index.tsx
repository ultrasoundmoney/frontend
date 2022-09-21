import type { StaticImageData } from "next/image";
import Image from "next/image";
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
        className="flex items-center z-20"
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
          flex justify-center
          z-20
          bg-slateus-700
          transition-all
          ${isOpen ? "opacity-95 visible" : "opacity-0 invisible"}
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
        <ul className="flex flex-col text-center gap-y-12 mt-32">
          <li>
            <Link href="/">
              <a className="font-inter font-extralight text-white text-4xl">
                dashboard
              </a>
            </Link>
          </li>
          <li onClick={() => setIsOpen(false)}>
            <Link href="/fam">
              <a className="font-inter font-extralight text-white text-4xl">
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
