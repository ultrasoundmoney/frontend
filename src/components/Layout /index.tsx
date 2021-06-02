import { NextPage } from "next";
import Navigation from "../Navigation/index";

type LayoutProps = {
  children: React.ReactNode;
  className?: string;
  Data?: Data;
};

const Layout: NextPage<LayoutProps> = ({ children, className, Data }) => {
  const customClass =
    className !== undefined && className.length >= 0
      ? `wrapper bg-blue-midnightexpress ${className}`
      : "wrapper bg-blue-midnightexpress";

  return (
    <>
      <div className={customClass}>
        <div className="container m-auto">
          <Navigation Data={Data} />
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
