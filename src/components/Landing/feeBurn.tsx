import * as React from "react";
import Card from "../Card/card";
import { TranslationsContext } from "../../translations-context";

type FeeBurnedBlcokProps = {
  lineHeight?: string;
};
const FeeBurnedBlcok: React.FC<FeeBurnedBlcokProps> = ({ lineHeight }) => {
  const t = React.useContext(TranslationsContext);
  const [scrollTop, setScrollTop] = React.useState(0);
  const getLineHeight =
    lineHeight != undefined || lineHeight != null
      ? `eclips-bottom eclips-bottom__left-0 ${lineHeight}`
      : `eclips-bottom eclips-bottom__left-0`;
  React.useEffect(() => {
    const getBurned_4_eth = document.querySelector(".burned_4 .eth-date");
    const getBurned_4_burned = document.querySelector(
      ".burned_4 .eth-burn-fee"
    );
    getBurned_4_eth?.classList.add("opacity-0");
    getBurned_4_burned?.classList.add("opacity-0");

    function onScroll() {
      const target = document.querySelector("#next-merge");
      const currentPosition = window.pageYOffset;
      if (target && window.scrollY >= target.getBoundingClientRect().top) {
        getBurned_4_eth?.classList.remove("opacity-0");
        getBurned_4_burned?.classList.remove("opacity-0");
        if (currentPosition > scrollTop) {
          getBurned_4_eth?.classList.add("animateIn");
          getBurned_4_burned?.classList.add("animateIn");
        } else {
          getBurned_4_eth?.classList.remove("animateIn");
          getBurned_4_burned?.classList.remove("animateIn");
        }
      }
      setScrollTop(currentPosition <= 0 ? 0 : currentPosition);
    }

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollTop]);
  return (
    <>
      <section
        data-aos="fade-up"
        data-aos-anchor-placement="top-bottom"
        data-aos-offset="100"
        data-aos-delay="50"
        data-aos-duration="1000"
        data-aos-easing="ease-in-out"
        id="fee-burned"
        className="fixed-fee-burned"
      >
        <div className="flex flex-wrap justify-center w-full lg:w-9/12 md:mx-auto px-4 md:px-8 lg:px-0">
          <Card
            type={1}
            name={t.landing_feeburned_card1_name}
            title={t.landing_feeburned_card1_title}
            className="w-full md:w-auto md:flex-1 mb-4 lg:mb-0"
          />
          <Card
            type={2}
            name={t.landing_feeburned_card2_name}
            title={t.landing_feeburned_card2_title}
            number={t.landing_feeburned_card2_title1}
            className="w-full md:w-auto md:flex-initial mb-4 lg:mb-0"
          />
          <Card
            type={3}
            name={t.landing_feeburned_card3_name}
            title={t.landing_feeburned_card3_title}
            className="w-full md:w-auto md:flex-1 mb-4 lg:mb-0"
          />
          <Card
            type={3}
            name={t.landing_feeburned_card4_name}
            title={t.landing_feeburned_card4_title}
            className="w-full md:w-auto mb-4 lg:mb-0 burned_4"
          />
        </div>
        <div className="flex flex-wrap justify-center w-full lg:w-7/12 md:mx-auto mb-8 px-4 md:px-8 lg:px-0">
          <div className={getLineHeight}>
            <div className="eclips-bottom-line" />
          </div>
        </div>
      </section>
    </>
  );
};

export default FeeBurnedBlcok;
