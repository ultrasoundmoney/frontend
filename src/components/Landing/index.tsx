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
import { followerCountConvert } from "../Helpers/helper";
import {
  genesis_data,
  byzantium_data,
  constantinople_data,
} from "./historicalData";

const LandingPage: React.FC<{}> = () => {
  const [genesisArr, setGenesisArr] = React.useState(genesis_data[0]);
  React.useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);
  const [scrolling, setScrolling] = React.useState(false);
  const [scrollTop, setScrollTop] = React.useState(0);

  React.useEffect(() => {
    //First Card Date
    const getStatusAndDate = document.querySelector(".burned_1 .eth-date");
    const getStatus = document.querySelector(".burned_1 .eth-status");
    // 2nd Card Eth Supply Increaments
    const getEthSupply = document.querySelector(".burned_2 .eth-supply");
    const getEthSupplyIncreament = document.querySelector(
      ".burned_2 .eth-supply-incr"
    );
    //3rd Card
    const getBlcokReward = document.querySelector(".burned_3 .eth-burn-fee");

    function onScroll() {
      const targetGenesis = document.querySelector("#genesis");
      const targetByzantium = document.querySelector("#eip-byzantium");
      const targetConstantinople = document.querySelector(
        "#eip-constantinople"
      );
      // const target1559 = document.querySelector("#next-merge");
      const targetSupplyView = document.querySelector("#supplyview");
      const targetUltraSound = document.querySelector("#enter-ultra-sound");
      const targetMergeLine = document.querySelector("#the-merge-line");
      const currentPosition = window.pageYOffset;

      // ETH Genesis Time
      if (targetGenesis.getBoundingClientRect().top < window.innerHeight) {
        if (currentPosition > scrollTop) {
          // downscroll code
          setScrolling(false);
          const lineHeight =
            currentPosition - window.innerHeight > 0
              ? Math.floor((currentPosition - window.innerHeight) * 0.5)
              : 0;

          if (lineHeight < 450) {
            document.getElementById(
              "line__genesis"
            ).style.height = `${lineHeight}px`;
            getBlcokReward.innerHTML = "5 ETH/<span>Block</span>";
            const counter = lineHeight * 3;
            setGenesisArr(
              genesis_data[
                counter > genesis_data.length
                  ? genesis_data.length - 1
                  : counter
              ]
            );
            if (genesisArr) {
              getStatusAndDate.innerHTML = `Status ${new Date(
                genesisArr[0]
              ).toDateString()}`;
              getEthSupplyIncreament.innerHTML = `&#8593;+ ${genesisArr[2]}`;
              getEthSupply.innerHTML = `${followerCountConvert(
                Number(genesisArr[1])
              )}`;
            }
          }
          if (lineHeight > 450) {
            document
              .getElementById("line__genesis")
              .classList.add("eclips__hr-circle");
            setGenesisArr(genesis_data[genesis_data.length - 1]);
          }
        } else {
          // upscroll code
          setScrolling(true);
          const lineHeight =
            currentPosition - window.innerHeight > 0
              ? Math.floor((currentPosition - window.innerHeight) * 0.5)
              : 0;
          if (lineHeight < 450) {
            document.getElementById(
              "line__genesis"
            ).style.height = `${lineHeight}px`;
            document
              .getElementById("line__genesis")
              .classList.remove("eclips__hr-circle");
            getBlcokReward.innerHTML = "5 ETH/<span>Block</span>";
            const genesis_data_re = genesis_data.reverse();
            const counter = lineHeight * 3;
            setGenesisArr(
              genesis_data_re[
                counter > genesis_data.length
                  ? genesis_data.length - 1
                  : counter
              ]
            );
            if (genesisArr) {
              getStatusAndDate.innerHTML = `Status ${new Date(
                genesisArr[0]
              ).toDateString()}`;
              getEthSupplyIncreament.innerHTML = `&#8593;+ ${genesisArr[2]}`;
              getEthSupply.innerHTML = `${followerCountConvert(
                Number(genesisArr[1])
              )}`;
            }
          }
        }
      }
      //ETH By
      if (targetByzantium.getBoundingClientRect().top < window.innerHeight) {
        if (currentPosition > scrollTop) {
          // downscroll code
          setScrolling(false);
          const lineHeight =
            currentPosition - window.innerHeight > 0
              ? Math.floor((currentPosition - window.innerHeight) * 0.3)
              : 0;

          if (lineHeight < 450) {
            document.getElementById(
              "line__byzantium"
            ).style.height = `${lineHeight}px`;
            getBlcokReward.innerHTML = "3 ETH/<span>Block</span>";
            const counter = Math.floor(lineHeight * 1.5);
            setGenesisArr(
              byzantium_data[
                counter > byzantium_data.length
                  ? byzantium_data.length - 1
                  : counter
              ]
            );
            if (genesisArr) {
              getStatusAndDate.innerHTML = `Status ${new Date(
                genesisArr[0]
              ).toDateString()}`;
              getEthSupplyIncreament.innerHTML = `&#8593;+ ${genesisArr[2]}`;
              getEthSupply.innerHTML = `${followerCountConvert(
                Number(genesisArr[1])
              )}`;
            }
          }
          if (lineHeight > 450) {
            document
              .getElementById("line__byzantium")
              .classList.add("eclips__hr-circle");
            setGenesisArr(byzantium_data[byzantium_data.length - 1]);
          }
        } else {
          // upscroll code
          setScrolling(true);
          const lineHeight =
            currentPosition - window.innerHeight > 0
              ? Math.floor((currentPosition - window.innerHeight) * 0.3)
              : 0;
          if (lineHeight < 450) {
            document.getElementById(
              "line__byzantium"
            ).style.height = `${lineHeight}px`;
            document
              .getElementById("line__genesis")
              .classList.remove("eclips__hr-circle");
            getBlcokReward.innerHTML = "5 ETH/<span>Block</span>";
            const genesis_data_re = byzantium_data.reverse();
            const counter = Math.floor(lineHeight * 1.5);
            setGenesisArr(
              genesis_data_re[
                counter > byzantium_data.length
                  ? byzantium_data.length - 1
                  : counter
              ]
            );
            if (genesisArr) {
              getStatusAndDate.innerHTML = `Status ${new Date(
                genesisArr[0]
              ).toDateString()}`;
              getEthSupplyIncreament.innerHTML = `&#8593;+ ${genesisArr[2]}`;
              getEthSupply.innerHTML = `${followerCountConvert(
                Number(genesisArr[1])
              )}`;
            }
          }
        }
      }

      // ETH Cons
      if (
        targetConstantinople.getBoundingClientRect().top < window.innerHeight
      ) {
        if (currentPosition > scrollTop) {
          // downscroll code
          setScrolling(false);
          const lineHeight =
            currentPosition - window.innerHeight > 0
              ? Math.floor((currentPosition - window.innerHeight) * 0.18)
              : 0;
          if (lineHeight < 450) {
            document.getElementById(
              "line__constantinople"
            ).style.height = `${lineHeight}px`;
            getBlcokReward.innerHTML = "2 ETH/<span>Block</span>";
            const counter = lineHeight * 2;
            setGenesisArr(
              constantinople_data[
                counter > constantinople_data.length
                  ? constantinople_data.length - 1
                  : counter
              ]
            );
            if (genesisArr) {
              getStatusAndDate.innerHTML = `Status ${new Date(
                genesisArr[0]
              ).toDateString()}`;
              getEthSupplyIncreament.innerHTML = `&#8593;+ ${genesisArr[2]}`;
              getEthSupply.innerHTML = `${followerCountConvert(
                Number(genesisArr[1])
              )}`;
            }
          }
          if (lineHeight > 450) {
            document
              .getElementById("line__constantinople")
              .classList.add("eclips__hr-circle");
            setGenesisArr(constantinople_data[constantinople_data.length - 1]);
          }
        } else {
          // upscroll code
          setScrolling(true);
          const lineHeight =
            currentPosition - window.innerHeight > 0
              ? Math.floor((currentPosition - window.innerHeight) * 0.18)
              : 0;
          if (lineHeight < 450) {
            document.getElementById(
              "line__constantinople"
            ).style.height = `${lineHeight}px`;
            document
              .getElementById("line__constantinople")
              .classList.remove("eclips__hr-circle");
            getBlcokReward.innerHTML = "5 ETH/<span>Block</span>";
            const genesis_data_re = constantinople_data.reverse();
            const counter = lineHeight * 2;
            setGenesisArr(
              genesis_data_re[
                counter > constantinople_data.length
                  ? constantinople_data.length - 1
                  : counter
              ]
            );
            if (genesisArr) {
              getStatusAndDate.innerHTML = `Status ${new Date(
                genesisArr[0]
              ).toDateString()}`;
              getEthSupplyIncreament.innerHTML = `&#8593;+ ${genesisArr[2]}`;
              getEthSupply.innerHTML = `${followerCountConvert(
                Number(genesisArr[1])
              )}`;
            }
          }
        }
      }

      // // EIP 1559 London Fork
      // if (target1559.getBoundingClientRect().top < window.innerHeight) {
      //   if (currentPosition > scrollTop) {
      //     // downscroll code
      //     setScrolling(false);
      //     setEthSupplyPlus(9.3 + Math.floor(scrollTop * 0.001));
      //     const ethSupplyFactor = 72 + Math.floor(scrollTop * 0.01);
      //     setEthSupply(ethSupplyFactor > 121 ? 121 : Math.abs(ethSupplyFactor));
      //     const getFactor = Math.floor(currentPosition / 220);
      //     const genesisToByzDate = Math.floor(1508104800 + getFactor * 5259486);
      //     setInfationaryDate(
      //       genesisToByzDate > 1628028000 ? 1628028000 : genesisToByzDate
      //     );
      //     getStatusAndDate.innerHTML = `Status ${new Date(
      //       infationaryDate * 1000
      //     ).toDateString()}`;
      //     getEthSupplyIncreament.innerHTML = `&#8593;+ ${ethSupplyPlus.toFixed(
      //       2
      //     )}%`;
      //     getEthSupply.innerHTML = `${ethSupply}M`;
      //   } else {
      //     //upscroll code
      //     setScrolling(true);
      //     const ethSupplyFactor = 121 - Math.floor(scrollTop * 0.001);
      //     setEthSupply(ethSupplyFactor > 72 ? Math.abs(ethSupplyFactor) : 72);
      //     const getFactor = Math.floor(currentPosition / 220);
      //     const genesisToByzDate = Math.floor(1628028000 - getFactor * 5259486);
      //     setInfationaryDate(
      //       genesisToByzDate > 1628028000 ? 1628028000 : genesisToByzDate
      //     );
      //     setEthSupplyPlus(9.3 - Math.floor(scrollTop * 0.001));
      //     getStatusAndDate.innerHTML = `Status ${new Date(
      //       infationaryDate * 1000
      //     ).toDateString()}`;
      //     getEthSupplyIncreament.innerHTML = `&#8593;+ ${ethSupplyPlus.toFixed(
      //       2
      //     )}%`;
      //     getEthSupply.innerHTML = `${ethSupply}M`;
      //   }
      // }

      //SupplyView
      if (targetSupplyView.getBoundingClientRect().top < window.innerHeight) {
        if (currentPosition > scrollTop) {
          const lineHeight = Math.floor((currentPosition / 100) * 8);
          if (lineHeight < 450) {
            document.getElementById(
              "line__supplyview"
            ).style.height = `${lineHeight}px`;
          }
          if (lineHeight > 450) {
            document
              .getElementById("line__supplyview")
              .classList.add("eclips__hr-circle");
          }
        } else {
          const lineHeight = Math.floor((currentPosition / 100) * 8);
          if (lineHeight < 450) {
            document.getElementById(
              "line__supplyview"
            ).style.height = `${lineHeight}px`;
            document
              .getElementById("line__supplyview")
              .classList.remove("eclips__hr-circle");
          }
        }
      }
      if (targetMergeLine.getBoundingClientRect().top < window.innerHeight) {
        if (currentPosition > scrollTop) {
          // downscroll code
          setScrolling(false);
          const lineHeight = Math.floor((currentPosition / 100) * 6);
          if (lineHeight < 450) {
            document.getElementById(
              "line__merge"
            ).style.height = `${lineHeight}px`;
          }
          if (lineHeight > 450) {
            document
              .getElementById("line__merge")
              .classList.add("eclips__hr-circle");
            setGenesisArr(constantinople_data[constantinople_data.length - 1]);
          }
        } else {
          // upscroll code
          setScrolling(true);
          const lineHeight = Math.floor((currentPosition / 100) * 6);
          if (lineHeight < 450) {
            document.getElementById(
              "line__merge"
            ).style.height = `${lineHeight}px`;
            document
              .getElementById("line__merge")
              .classList.remove("eclips__hr-circle");
          }
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
  }, [genesisArr, scrollTop, scrolling]);
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
            id="supplyview"
          >
            <div className="w-full md:w-5/6 lg:w-5/6 md:m-auto relative bg-blue-tangaroa md:px-8 py-4 md:py-16 rounded-xl">
              <SupplyView />
            </div>
            <div className="flex flex-wrap justify-center pt-20">
              <div id="line__supplyview" className="eclips-hr" />
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
            id="join-the-community"
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
