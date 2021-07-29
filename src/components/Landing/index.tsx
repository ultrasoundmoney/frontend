import * as React from "react";
import Navigation from "../Navigation/Nav";
import Intro from "./Intro";
import BeforeGenesis from "./beforeGenesis";
import GenesisBlock from "./gennesis";
import EIPByzantium from "./eipByzantium";
import EIPConstantinopole from "./eipConstantinopole";
import EIP1559 from "./eip1559";
import BlockGoal from "./goal";
import TheMergeBlock from "./theMerge";
import EtherTheUltraSound from "./theUltraSound";
import TwitterCommunity from "../TwitterCommunity";
import FaqBlock from "./faq";
import NftDrop from "../NftDrop/index";
import FollowingYou from "../FollowingYou";
import AOS from "aos";
import "aos/dist/aos.css";
import SupplyView from "../SupplyView";
import TheBurnedCard from "./theBurnedCard";

const LandingPage: React.FC<{}> = () => {
  React.useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);

  const [scrolling, setScrolling] = React.useState(false);
  const [scrollTop, setScrollTop] = React.useState(0);
  // const [ethSupply, setEthSupply] = React.useState(72);
  const [ethSupplyPlus, setEthSupplyPlus] = React.useState(5.3);
  const date = new Date("July 31, 2015").toDateString();
  const dateGenesis = Math.floor(
    parseInt((new Date(date).getTime() / 1000).toFixed(0))
  );
  const [infationaryDate, setInfationaryDate] = React.useState(dateGenesis);
  React.useEffect(() => {
    //First Card Date
    const getStatusAndDate = document.querySelector(".burned_1 .eth-date");
    const getStatus = document.querySelector(".burned_1 .eth-status");
    // 2nd Card Eth Supply Increaments
    const getEthSupplyIncreament = document.querySelector(
      ".burned_2 .eth-supply-incr"
    );
    function onScroll() {
      const targetGenesis = document.querySelector("#genesis");
      const targetByzantium = document.querySelector("#eip-byzantium");
      const targetConstantinople = document.querySelector(
        "#eip-constantinople"
      );
      const target1559 = document.querySelector("#next-merge");
      const targetUltraSound = document.querySelector("#enter-ultra-sound");
      const currentPosition = window.pageYOffset;

      // ETH Genesis Time
      if (targetGenesis.getBoundingClientRect().top < window.innerHeight) {
        if (currentPosition > scrollTop) {
          // downscroll code
          setScrolling(false);
          setEthSupplyPlus(5.3 + Math.floor(scrollTop * 0.001));
          const getFactor = Math.floor(currentPosition / 110);
          const genesisToByzDate = Math.floor(1455509940 + getFactor * 5259486);
          setInfationaryDate(
            genesisToByzDate > 1508104800 ? 1508104800 : genesisToByzDate
          );
          getStatusAndDate.innerHTML = `Status ${new Date(
            infationaryDate * 1000
          ).toDateString()}`;
          getEthSupplyIncreament.innerHTML = `&#8593;+ ${ethSupplyPlus.toFixed(
            2
          )}%`;
        } else {
          // upscroll code
          setScrolling(true);
          setInfationaryDate(1438293600);
          setEthSupplyPlus(5.3 - Math.floor(scrollTop * 0.001));
          getEthSupplyIncreament.innerHTML = `&#8593;+ ${ethSupplyPlus.toFixed(
            2
          )}%`;
          getStatusAndDate.innerHTML = `Status ${new Date(
            infationaryDate * 1000
          ).toDateString()}`;
        }
      }
      //ETH By
      if (targetByzantium.getBoundingClientRect().top < window.innerHeight) {
        // targetByzantium.classList.add("bg-green-700");
        if (currentPosition > scrollTop) {
          // downscroll code
          setScrolling(false);
          setEthSupplyPlus(11.3 + Math.floor(scrollTop * 0.0001));
          getEthSupplyIncreament.innerHTML = `&#8593;+ ${ethSupplyPlus.toFixed(
            2
          )}%`;

          const getFactor = Math.floor(currentPosition / 110);
          const genesisToByzDate = Math.floor(1508104800 + getFactor * 2629743);
          setInfationaryDate(
            genesisToByzDate > 1571176800 ? 1571176800 : genesisToByzDate
          );
          getStatusAndDate.innerHTML = `Status ${new Date(
            infationaryDate * 1000
          ).toDateString()}`;
        } else {
          // upscroll code
          setScrolling(true);
          setEthSupplyPlus(11.3 - Math.floor(scrollTop * 0.0001));
          setInfationaryDate(1508104800);
          getEthSupplyIncreament.innerHTML = `&#8593;+ ${ethSupplyPlus.toFixed(
            2
          )}%`;
          getStatusAndDate.innerHTML = `Status ${new Date(
            infationaryDate * 1000
          ).toDateString()}`;
        }
      }

      // ETH Cons
      if (
        targetConstantinople.getBoundingClientRect().top < window.innerHeight
      ) {
        if (currentPosition > scrollTop) {
          // downscroll code
          setScrolling(false);
          setEthSupplyPlus(9.3 - Math.floor(scrollTop * 0.001));
          const x = 1508104800 - (infationaryDate + 999 * 10000);
          setInfationaryDate(
            x > 0 ? infationaryDate + 999 * 1000 : infationaryDate
          );
          getStatusAndDate.innerHTML = `Status ${new Date(
            infationaryDate * 1000
          ).toDateString()}`;
          getEthSupplyIncreament.innerHTML = `&#8593;+ ${ethSupplyPlus.toFixed(
            2
          )}%`;
        } else {
          //upscroll code
          setScrolling(true);
          const x = 1628028000 - (infationaryDate + 999 * 10000);
          setInfationaryDate(
            x > 0 ? infationaryDate - 999 * 1000 : infationaryDate
          );
          setEthSupplyPlus(9.3 + Math.floor(scrollTop * 0.001));
          getStatusAndDate.innerHTML = `Status ${new Date(
            infationaryDate * 1000
          ).toDateString()}`;
          getEthSupplyIncreament.innerHTML = `&#8593;+ ${ethSupplyPlus.toFixed(
            2
          )}%`;
        }
      }

      // EIP 1559 London Fork
      if (target1559.getBoundingClientRect().top < window.innerHeight) {
        if (currentPosition > scrollTop) {
          // downscroll code
          setScrolling(false);
          setEthSupplyPlus(9.3 + Math.floor(scrollTop * 0.001));
          const getFactor = Math.floor(currentPosition / 220);
          const genesisToByzDate = Math.floor(1508104800 + getFactor * 5259486);
          setInfationaryDate(
            genesisToByzDate > 1628028000 ? 1628028000 : genesisToByzDate
          );
          getStatusAndDate.innerHTML = `Status ${new Date(
            infationaryDate * 1000
          ).toDateString()}`;
          getEthSupplyIncreament.innerHTML = `&#8593;+ ${ethSupplyPlus.toFixed(
            2
          )}%`;
        } else {
          //upscroll code
          setScrolling(true);
          const getFactor = Math.floor(currentPosition / 220);
          const genesisToByzDate = Math.floor(1628028000 - getFactor * 5259486);
          setInfationaryDate(
            genesisToByzDate > 1628028000 ? 1628028000 : genesisToByzDate
          );
          setEthSupplyPlus(9.3 - Math.floor(scrollTop * 0.001));
          getStatusAndDate.innerHTML = `Status ${new Date(
            infationaryDate * 1000
          ).toDateString()}`;
          getEthSupplyIncreament.innerHTML = `&#8593;+ ${ethSupplyPlus.toFixed(
            2
          )}%`;
        }
      }

      if (targetUltraSound.getBoundingClientRect().top < window.innerHeight) {
        if (currentPosition > scrollTop && !scrolling) {
          // downscroll code
          setScrolling(false);
          getStatus.innerHTML = "Money (Deflationary)";
        }
      } else {
        getStatus.innerHTML = "Money (Infationary)";
      }
      setScrollTop(currentPosition <= 0 ? 0 : currentPosition);
    }

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [ethSupplyPlus, infationaryDate, scrollTop, scrolling]);
  return (
    <>
      <div className="wrapper bg-blue-midnightexpress">
        <div className="container m-auto">
          <Navigation />
          <Intro />
          <BeforeGenesis />
          <GenesisBlock />
          <EIPByzantium />
          <EIPConstantinopole />
          <EIP1559 />
          <BlockGoal />
          <div
            data-aos="fade-up"
            data-aos-anchor-placement="top-bottom"
            data-aos-offset="100"
            data-aos-delay="100"
            data-aos-duration="1000"
            data-aos-easing="ease-in-out"
            className="flex flex-col px-4 md:px-0 mb-16"
          >
            <div className="w-full md:w-5/6 lg:w-5/6 md:m-auto relative bg-blue-tangaroa md:px-8 py-4 md:py-16 rounded-xl">
              <SupplyView />
              <div className="flex flex-wrap justify-center w-full lg:w-7/12 md:mx-auto mb-8 px-4 md:px-16 lg:px-0">
                <div className="eclips-bottom eclips-bottom__left-0">
                  <div className="eclips-bottom-line" />
                </div>
              </div>
            </div>
          </div>
          <TheMergeBlock />
          <EtherTheUltraSound />
          <FaqBlock />
          <section
            data-aos="fade-up"
            data-aos-anchor-placement="top-center"
            data-aos-delay="50"
            data-aos-duration="1000"
            data-aos-easing="ease-in-out"
            className="flex px-4 md:px-8 lg:px-0 py-8 md:py-40"
          >
            <div className="w-full md:w-5/6 lg:w-2/3 md:m-auto relative">
              <TwitterCommunity />
            </div>
          </section>
          <section
            data-aos="fade-up"
            data-aos-anchor-placement="top-center"
            data-aos-delay="50"
            data-aos-duration="1000"
            data-aos-easing="ease-in-out"
            className="flex px-4 md:px-8 lg:px-0 py-24"
          >
            <div className="w-full md:w-5/6 lg:w-2/3 md:m-auto relative">
              <FollowingYou />
            </div>
          </section>
          <NftDrop />
          <TheBurnedCard />
        </div>
      </div>
    </>
  );
};

export default LandingPage;
