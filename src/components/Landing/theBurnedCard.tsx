import * as React from "react";
import Card from "../Card/card";
import { TranslationsContext } from "../../translations-context";

type FeeBurnedBlcokProps = {
  lineHeight?: string;
};
const FeeBurnedBlcok: React.FC<FeeBurnedBlcokProps> = () => {
  const t = React.useContext(TranslationsContext);
  const [scrollTop, setScrollTop] = React.useState(0);
  React.useEffect(() => {
    const getBurned_4_eth = document.querySelector(".burned_4 .eth-date");
    const getBurned_4_burned = document.querySelector(
      ".burned_4 .eth-burn-fee"
    );
    getBurned_4_eth.classList.add("opacity-0");
    getBurned_4_burned.classList.add("opacity-0");

    function onScroll() {
      const target = document.querySelector("#next-merge");
      const currentPosition = window.pageYOffset;
      if (window.scrollY >= target.getBoundingClientRect().top) {
        getBurned_4_eth.classList.remove("opacity-0");
        getBurned_4_burned.classList.remove("opacity-0");
        if (currentPosition > scrollTop) {
          getBurned_4_eth.classList.add("animateIn");
          getBurned_4_burned.classList.add("animateIn");
        } else {
          getBurned_4_eth.classList.remove("animateIn");
          getBurned_4_burned.classList.remove("animateIn");
        }
      }
      setScrollTop(currentPosition <= 0 ? 0 : currentPosition);
    }

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollTop]);
  return (
    <>
      <div
        id="eth-card"
        className="fixed-fee-burned flex flex-wrap justify-center w-full md:w-full xl:w-10/12 md:mx-auto px-4 md:px-0 lg:px-0 sticky"
      >
        <Card
          type={1}
          name={`Status ${t.landing_feeburned_card1_name}`}
          title={t.landing_feeburned_card1_title}
          className="w-full md:w-w-21 xl:flex-1 mb-4 lg:mb-0 burned_1"
        />
        <Card
          type={2}
          name={t.landing_feeburned_card2_name}
          title={t.landing_feeburned_card2_title}
          number={t.landing_feeburned_card2_title1}
          className="w-full md:w-w-21 lg:w-auto xl:flex-initial mb-4 lg:mb-0 burned_2"
        />
        <Card
          type={3}
          name={t.landing_feeburned_card3_name}
          title={t.landing_feeburned_card3_title}
          className="w-full md:w-w-21 xl:flex-1 mb-4 lg:mb-0 burned_3"
        />
        <Card
          type={3}
          name={t.landing_feeburned_card4_name}
          title={t.landing_feeburned_card4_title}
          className="w-full md:w-w-21 xl:flex-1 mb-4 lg:mb-0 burned_4"
        />
      </div>
    </>
  );
};

export default FeeBurnedBlcok;
