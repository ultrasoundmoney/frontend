import { FC, useContext } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { TranslationsContext } from "../translations-context";

const hodlers = [
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1345510628539080704/uOGhadMz_reasonably_small.jpg",
    profileUrl: "https://twitter.com/ricburton",
    name: "Ric Burton 🇬🇧 ‣ 🇺🇸 🦇🔊",
    bio:
      "Designer helping teams create their dreams. Helped the @ethereum team in 2014 🦇🔊 Support @nexusmutual & @graphprotocol. Currently @feiprotocol & @backonmyfeet",
    followersCount: 47311,
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1410924391177854976/Omv7qRZC_reasonably_small.jpg",
    profileUrl: "https://twitter.com/ArtbyNelly",
    name: "NΞLLY🎨🦇🔊",
    bio:
      "My fine cryptoart works take technology, weave it with beauty, drape philosophy in romance to present a whole image of something new and incredible 👩‍🎨🗝️🎨",
    followersCount: 6012,
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1391868018167357440/OEx8XG_b_reasonably_small.jpg",
    profileUrl: "https://twitter.com/ultrasoundmoney",
    name: "ultra sound money 🦇🔊",
    bio: "wear the bat signal and join the fam https://t.co/BLzh8NcVGp",
    followersCount: 5101,
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1398832991837642752/enPkwkJ4_reasonably_small.jpg",
    profileUrl: "https://twitter.com/JakeHartnell",
    name: "Multichain Maximalist 🦇🔊",
    bio: "Building @stargaze_fi / @publicawesome_, Co-founder & systempunk",
    followersCount: 4369,
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1415635422005239808/FcDRl-gR_reasonably_small.jpg",
    profileUrl: "https://twitter.com/Matthewabg",
    name: "Matthew 🦇🔊",
    bio: "Building @Netkoin",
    followersCount: 3637,
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1415562060742672384/xaa1gmSL_reasonably_small.jpg",
    profileUrl: "https://twitter.com/esepuntoge",
    name: "S·G / Ξsepuntoge.eth 🦇🔊",
    bio:
      "Think Beautiful / Branding Bruce Lead at @wearefloc / Director at @BlockBrands / CryptoArt Driver at @TheSTARTHAUS / ROBOT at @MetaFactory / #BTC #ETH $BIRRA🍻",
    followersCount: 3188,
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1357144405229129729/j2-DD2gk_reasonably_small.jpg",
    profileUrl: "https://twitter.com/FroggyFrogster",
    name: "SwagtimusPrime.eth 🦇🔊",
    bio: "#Ethereum #DeFi 🐬 $ETH is ultrasound money",
    followersCount: 1776,
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1399786400787185674/iaKXVaJj_reasonably_small.jpg",
    profileUrl: "https://twitter.com/AK_ETHER",
    name: "StandardApe.eth🦇🔊🍌",
    bio: "🦍🦍 #Ethereum #NFT",
    followersCount: 942,
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1335474346882527232/r-8FUg3Y_reasonably_small.jpg",
    profileUrl: "https://twitter.com/dschnr",
    name: "David Schnurr",
    bio: "web / dataviz / ai · @OpenAI · Ξ 🦇🔊",
    followersCount: 750,
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1382792280801746945/Mhp7Lg8o_reasonably_small.jpg",
    profileUrl: "https://twitter.com/decibels42",
    name: "decibels42.eth 🦇🔊",
    bio: "Gitcoin delegate, Ethfinancier, Genesis staker",
    followersCount: 372,
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1048306501549477893/dRp0wGpm_reasonably_small.jpg",
    profileUrl: "https://twitter.com/coinconspirator",
    name: "Conspirator ≡🦇🔈",
    bio: "How can we help stop newbies from buying shitcoins ? You cant.",
    followersCount: 101,
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1347647329650814977/PD6RGga9_reasonably_small.jpg",
    profileUrl: "https://twitter.com/AlphaMonad",
    name: "AlphaMonad 🦇🔊",
    bio:
      "Dev || musician || full-time bagholder || psychonaut || imaginary entity",
    followersCount: 62,
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1364613828202401796/hD1pcqay_reasonably_small.jpg",
    profileUrl: "https://twitter.com/DuckDegen",
    name: "DΞGEN DUCK 🦇🔊",
    bio: "",
    followersCount: 51,
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/973945290674921479/0sdk3oOP_reasonably_small.jpg",
    profileUrl: "https://twitter.com/RiksenRobben",
    name: "Robben Riksen",
    bio: "🦇🔊",
    followersCount: 7,
  },
];

type HodlerProps = { description: string; image: string; name: string };
const Hodler: FC<HodlerProps> = ({ description, image, name }) => (
  <div className="bg-blue-tangaroa w-full p-8 m-8 rounded-lg md:max-w-sm">
    <img
      className="rounded-full mb-8 mx-auto"
      src={image}
      alt="picture of an ultrasound badge hodler"
    />
    <p className="text-white text-lg font-bold mb-8">{name}</p>
    <p className="text-white text-sm">{description}</p>
  </div>
);

const PoapPage: NextPage = () => {
  const t = useContext(TranslationsContext);

  return (
    <>
      <Head>
        <title>
          {t.dashboard_title} | {t.title}
        </title>
        <link rel="icon" href="/favicon.png" />
        <meta name="description" content={t.title} />
        <meta name="keywords" content={t.meta_keywords} />
        <meta property="og:title" content={t.title} />
        <meta property="og:description" content={t.meta_description} />
        <meta property="og:image" content={t.og_img} />
        <meta property="og:url" content={t.og_url} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:creator" content="@ultrasoundmoney" />
      </Head>
      <div className="wrapper bg-blue-midnightexpress coming-soon">
        <div className="container m-auto">
          <h1 className="text-white text-4xl text-center pt-32">
            ultrasound badge hodlers
          </h1>
          <div className="flex flex-wrap justify-center">
            {hodlers.map(({ bio, name, profileImageUrl }) => (
              <Hodler description={bio} name={name} image={profileImageUrl} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
export default PoapPage;
