import { NextPage } from "next";
import Navigation from "../Navigation/index";

type LayoutProps = {
  children: React.ReactNode;
  className?: string;
};

const Layout: NextPage<LayoutProps> = ({ children, className }) => {
  const customClass =
    className !== undefined && className.length >= 0
      ? `wrapper bg-blue-midnightexpress ${className}`
      : "wrapper bg-blue-midnightexpress";

  return (
    <>
      <div className={customClass}>
        <div className="container m-auto">
          <Navigation />
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
