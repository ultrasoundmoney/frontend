import * as React from "react";

const Timeline: React.FC<{ Data?: Data }> = () => {
  return (
    <>
      <div className="flex flex-wrap justify-center content-end">
        <div className="eclips">
          <div className="eclips_child"></div>
        </div>
        <div className="eclips-line"></div>
        <div className="eclips">
          <div className="eclips_child"></div>
        </div>
        <div className="eclips-line"></div>
        <div className="eclips">
          <div className="eclips_child"></div>
        </div>
        <div className="eclips-line"></div>
        <div className="eclips">
          <div className="eclips_child"></div>
        </div>
        <div className="eclips-line"></div>
        <div className="eclips">
          <div className="eclips_child"></div>
        </div>
      </div>
    </>
  );
};

export default Timeline;
