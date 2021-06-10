import * as React from "react";
import AvatarImg from "../../assets/avatar.webp";
// import useSWR from "swr";

type TwitterProfileProps = {
  name: string;
  profileImageUrl: string;
  profileUrl: string;
};
const StaticData: TwitterProfileProps[] = [
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1395489135746449411/ZUfJ38Jl_normal.jpg",
    profileUrl: "https://twitter.com/garrytan",
    name: "garrytan.eth 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1365680135844814849/iS5cvfSj_normal.jpg",
    profileUrl: "https://twitter.com/RyanSAdams",
    name: "RYAN SΞAN ADAMS - rsa.eth 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1381845637688303616/lwoLt_yg_normal.jpg",
    profileUrl: "https://twitter.com/sassal0x",
    name: "Anthony Sassano Ξ 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1381803073413210117/AY7Nr1ba_normal.png",
    profileUrl: "https://twitter.com/iamDCinvestor",
    name: "DCinvΞstor",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1397304866788179968/WFEKxMln_normal.jpg",
    profileUrl: "https://twitter.com/TrustlessState",
    name: "DavidHoffman.eth Ξ🦇🔊💰",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1378809640561991681/Irr6dQN__normal.jpg",
    profileUrl: "https://twitter.com/ryanallis",
    name: "Ryan Allis 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1345510628539080704/uOGhadMz_normal.jpg",
    profileUrl: "https://twitter.com/ricburton",
    name: "Ric Burton 🇬🇧 ‣ 🇺🇸 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1387482462586998785/uHh-ardJ_normal.jpg",
    profileUrl: "https://twitter.com/DocumentEther",
    name: "Documenting Ethereum 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/632301429424816128/OwT0LdXU_normal.jpg",
    profileUrl: "https://twitter.com/drakefjustin",
    name: "Justin Ðrake 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1271764675969998848/TpZNK-aY_normal.jpg",
    profileUrl: "https://twitter.com/pitdesi",
    name: "Sheel Mohnot",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1381025427385425926/K22JyI-d_normal.jpg",
    profileUrl: "https://twitter.com/0xMaki",
    name: "0xMaki 源 義経 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1363775802454736899/RUjufbtQ_normal.jpg",
    profileUrl: "https://twitter.com/antiprosynth",
    name: "antiprosynthesis.eth ⟠",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1399484007885246470/4N12fxZY_normal.jpg",
    profileUrl: "https://twitter.com/nanexcool",
    name: "mariano.eth 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1082093593840349184/P2B7Qiyn_normal.jpg",
    profileUrl: "https://twitter.com/TimBeiko",
    name: "Tim Beiko | timbeiko.eth 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1367943352591654912/5qoFTt2S_normal.jpg",
    profileUrl: "https://twitter.com/EthereumJesus",
    name: "Ethereum Jesus ⟠ 🙌🏻",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1402341143489155080/_e8JOD7s_normal.jpg",
    profileUrl: "https://twitter.com/samuelgil",
    name: "samuelgil.eth 🐇🕳",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1400208309098008576/hlfiP6UY_normal.jpg",
    profileUrl: "https://twitter.com/ThePaulOla",
    name: "Paul Ola | BTCrypto Coach 💰📊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1398335795614806018/qIFC3R0k_normal.jpg",
    profileUrl: "https://twitter.com/peter",
    name: "Peter",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1400862820867186694/vlRnCzjG_normal.jpg",
    profileUrl: "https://twitter.com/matdryhurst",
    name: "Mat Dryhurst",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1381803327848071174/10BkshXK_normal.jpg",
    profileUrl: "https://twitter.com/cyounessi1",
    name: "cyrus.ismoney.eth 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1399502843179159554/tCmH4lTK_normal.jpg",
    profileUrl: "https://twitter.com/defidude",
    name: "DeFi Dude ⟠ (dude.eth)",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1401863099204964354/9Lc9CEm0_normal.jpg",
    profileUrl: "https://twitter.com/Crypto_n_derivs",
    name: "🦄Cryptocurrency & derivatives🦇🔊EIP1559🏴Rollups",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1380727672259502082/MuXOzv8K_normal.jpg",
    profileUrl: "https://twitter.com/petejkim",
    name: "Pete Kim 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1354395159480446982/VTGqj5RG_normal.jpg",
    profileUrl: "https://twitter.com/EthanPierse",
    name: "Ξthan Pierse 🚀 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1390170604515459077/s4ebGzSD_normal.jpg",
    profileUrl: "https://twitter.com/jeffreyrufino",
    name: "Jeff Rufino 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1377609468083630082/tlCH7Sve_normal.jpg",
    profileUrl: "https://twitter.com/investindigital",
    name: "Ash 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1392559007659962373/jynZvAXN_normal.jpg",
    profileUrl: "https://twitter.com/masonic_tweets",
    name: "Mason, gmi & Co.",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1306234611694014465/2A5Sqjxh_normal.jpg",
    profileUrl: "https://twitter.com/CharleyMa",
    name: "Charley Ma",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1259169635842187264/FEDERl_k_normal.jpg",
    profileUrl: "https://twitter.com/preston_vanloon",
    name: "prestonvanloon.eth",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1276668016009211904/WPUJxVZH_normal.png",
    profileUrl: "https://twitter.com/OhGodAGirl",
    name: "Kristy-Leigh Minehan 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1383797622356414469/VAjjcozg_normal.jpg",
    profileUrl: "https://twitter.com/defislate",
    name: "DeFi ‘MIA🏝’ Slate🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1398512458160082945/EQJQvSMe_normal.jpg",
    profileUrl: "https://twitter.com/tomosman",
    name: "Tom Osman 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1378222891465023489/bXE169bq_normal.jpg",
    profileUrl: "https://twitter.com/alee",
    name: "Andrew Lee🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/724953399578353664/3jofE1F9_normal.jpg",
    profileUrl: "https://twitter.com/valb00",
    name: "Val Bercovici, Anti-Racist #BlackLivesMatter 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/647158458731462656/wQ6IhZ_g_normal.jpg",
    profileUrl: "https://twitter.com/ChrisdyannUribe",
    name: "ChrisdyannUribe",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1376291694367346692/42SEls98_normal.png",
    profileUrl: "https://twitter.com/reneil1337",
    name: "reneil 🏴🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1400799447639003137/r4Y_xhBZ_normal.jpg",
    profileUrl: "https://twitter.com/xbrucethegoose",
    name: "🌈BruceTheGoose.Eth NFTs 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1272309710603968512/ReFDgOMW_normal.jpg",
    profileUrl: "https://twitter.com/drwasho",
    name: "Washington Sanchez 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1395660380928503809/ilv0ARgv_normal.jpg",
    profileUrl: "https://twitter.com/vtrain44",
    name: "Ethereum is 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1364347039086075906/aCSB3S4h_normal.jpg",
    profileUrl: "https://twitter.com/JamesSpediacci",
    name: "James Spediacci ⟠🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1389212038107471872/Xkl99XFW_normal.jpg",
    profileUrl: "https://twitter.com/parisrouz",
    name: "paris rouzati 🥬",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1399102458199044096/p0oXgraT_normal.jpg",
    profileUrl: "https://twitter.com/travpreneur",
    name: "pratik.eth 🦇 🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1272827188455170048/usJBAWHP_normal.jpg",
    profileUrl: "https://twitter.com/AbiTyasTunggal",
    name: "Abi Tyas Tunggal 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/2330930976/a3p0kvbcpdy3jmf9gv6u_normal.gif",
    profileUrl: "https://twitter.com/androolloyd",
    name: "androolloyd.eth🦇🔊 $ETH 🚀4.4M",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1239269511561457665/qWkxcDFd_normal.jpg",
    profileUrl: "https://twitter.com/AnettRolikova",
    name: "⟠ Anett ⟠ anett.eth 🪐",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1361548495463743489/-lhaWjyY_normal.jpg",
    profileUrl: "https://twitter.com/melsreallife",
    name: "Melissa Tal 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1395752506240679936/nXCD8n-s_normal.jpg",
    profileUrl: "https://twitter.com/rpowazynski",
    name: "Richard Powazynski",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1171096734446977024/UVLJ811Z_normal.jpg",
    profileUrl: "https://twitter.com/jonhearty",
    name: "👁👁👁🦇🔈",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1400389572576436225/TIy7lLB5_normal.jpg",
    profileUrl: "https://twitter.com/adinalini",
    name: "Adinalini.eth 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1371629496374153217/HADEfriy_normal.jpg",
    profileUrl: "https://twitter.com/ashrithreddyy",
    name: "Ash_0x ⟠ 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1371558578218237955/-ck7HdHX_normal.jpg",
    profileUrl: "https://twitter.com/naturevrm",
    name: "Nature 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1401252688587857920/WYy-gbb-_normal.jpg",
    profileUrl: "https://twitter.com/ape3464",
    name: "Ape.3464/ 🍌",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1401832362250366981/L8efL4dQ_normal.jpg",
    profileUrl: "https://twitter.com/GOON8686",
    name: "Goonie 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1216561146292867073/gjrV0ZUJ_normal.jpg",
    profileUrl: "https://twitter.com/aleczopf",
    name: "Alec Zopf 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1400761497941254145/-0M9f0SQ_normal.jpg",
    profileUrl: "https://twitter.com/lukisaepul",
    name: "akuluki_0x🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1388043706322796544/2sCnP_Kg_normal.jpg",
    profileUrl: "https://twitter.com/jameesy",
    name: "jameesy",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1367204837859942401/mKUJ2Hq1_normal.jpg",
    profileUrl: "https://twitter.com/_kittehdesign",
    name: "_kitteh",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1369732459630391305/lB3eIQwx_normal.jpg",
    profileUrl: "https://twitter.com/BradyMck_",
    name: "Brady McKenna 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/2453921768/1a6ieqtv6xl7paexyvxk_normal.png",
    profileUrl: "https://twitter.com/bakkdoor",
    name: "Christopher Bertels 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1389352658956337154/k6wz-_b6_normal.jpg",
    profileUrl: "https://twitter.com/InsideTheSim",
    name: "InsidΞThΞSimulation.eth ⟠ 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1379889516366983168/FUwWi3L__normal.jpg",
    profileUrl: "https://twitter.com/Arhoo84",
    name: "Ben Arhin 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1394586065084854272/8RuVKE5R_normal.png",
    profileUrl: "https://twitter.com/LowIQPoor",
    name: "LowIQ (aka Ξth Pleb) 🍆🦇🔊🍆",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1401183540591489025/syU_44wA_normal.jpg",
    profileUrl: "https://twitter.com/bschaf12",
    name: "Brian Schafer",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1399564938042122249/keHsR-d9_normal.jpg",
    profileUrl: "https://twitter.com/Blockefeller1",
    name: "JD Blockefeller 🦇🔊 | ethnerd.eth",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1371339294443405315/juHfM5AC_normal.jpg",
    profileUrl: "https://twitter.com/andyteecf",
    name: "andΞ 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/3747759283/76e7e57fc22820e383d19c581ce13c15_normal.jpeg",
    profileUrl: "https://twitter.com/jasonzopf",
    name: "Jason Zopf 🦇🔊",
  },
  {
    profileImageUrl: null,
    profileUrl: "https://twitter.com/GankSigns",
    name: "Based Windu 📊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1392901179924000773/YQsmxKPy_normal.jpg",
    profileUrl: "https://twitter.com/0x10l10l",
    name: "JΞsus ⬡f Nazar⬡v | ΞTH🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1386853876653903874/7teOGLdy_normal.jpg",
    profileUrl: "https://twitter.com/anant0x",
    name: "🅰nant.eth",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1377907659672723464/-xEjPVy-_normal.jpg",
    profileUrl: "https://twitter.com/carmacace",
    name: "carmacace",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1400207604324859905/67FzshCz_normal.jpg",
    profileUrl: "https://twitter.com/BenGiove",
    name: "Ben Giove Ξ🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1345374806594756609/bNJ376Ey_normal.jpg",
    profileUrl: "https://twitter.com/learntodapp",
    name: "PΞdro BΞrgamΞn Ξ 🦇🔊",
  },
  {
    profileImageUrl: null,
    profileUrl: "https://twitter.com/ultrasoundponzi",
    name: "zΞroxF",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1049489849424769025/og85CHr3_normal.jpg",
    profileUrl: "https://twitter.com/SlimShadyTheM80",
    name: "Carlos Danger",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1375920754143944707/_P3nJagG_normal.jpg",
    profileUrl: "https://twitter.com/Mj_Olan",
    name: "Matthew Olan 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1379116265478836225/nxUl8A8I_normal.jpg",
    profileUrl: "https://twitter.com/AccountantInc",
    name: "The Accountant’s Perspective, Inc",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/378800000149280481/7b70004c985c91da40db47a66777e9f0_normal.jpeg",
    profileUrl: "https://twitter.com/Lpapi_speaks",
    name: "Leo 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1387789074375774211/cirIyuj8_normal.jpg",
    profileUrl: "https://twitter.com/0m11sm3rl0ud",
    name: "0M1LLY SUMMΞRL0UD 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/888182982820765696/szICcIHk_normal.jpg",
    profileUrl: "https://twitter.com/thepranavj",
    name: "Pranav Jayaraman 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1347647329650814977/PD6RGga9_normal.jpg",
    profileUrl: "https://twitter.com/AlphaMonad",
    name: "AlphaMonad 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1400545068512129030/Soc05vQE_normal.jpg",
    profileUrl: "https://twitter.com/abstrucked",
    name: "AbstruckΞd 🦇🔊 #OpenSourceMaximalist",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1373295277600280578/k-TVz1lw_normal.jpg",
    profileUrl: "https://twitter.com/boxedbyadad",
    name: "Crypto Dad. ETH🧲",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1220678310255972352/Ottl9Arz_normal.jpg",
    profileUrl: "https://twitter.com/AmberNewland5",
    name: "Tien Nguyen 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1390266781084889091/pvwWeUwD_normal.jpg",
    profileUrl: "https://twitter.com/8bitfantasE",
    name: "8-Bit Fantasy ✞︎ 8bitfantasy.eth ✞︎ ✨🦇🔊✨",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1188972572647362560/-DtJbP91_normal.jpg",
    profileUrl: "https://twitter.com/WedoOiw",
    name: "Cuoc Oiw 🦇🔊",
  },
  {
    profileImageUrl: null,
    profileUrl: "https://twitter.com/busenesetx",
    name: "Busé",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1335151370589011968/0Mvq6cwJ_normal.jpg",
    profileUrl: "https://twitter.com/brainlesscap",
    name: "Brainless Capital 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1382776222388719636/BX4onjgn_normal.jpg",
    profileUrl: "https://twitter.com/CChampau",
    name: "Clement Champau 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1300736617720684545/ykva45f7_normal.jpg",
    profileUrl: "https://twitter.com/MJuzefowicz",
    name: "Michael Juzefowicz 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1367551972245700609/D-jtQj5c_normal.jpg",
    profileUrl: "https://twitter.com/EeeTHnoob",
    name: "三thsearcher🦇🔊🍣",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/655356485489328128/UKFwXwT4_normal.jpg",
    profileUrl: "https://twitter.com/apatriksvensson",
    name: "Patrik Svensson",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1366638379484336129/T6phtrNB_normal.jpg",
    profileUrl: "https://twitter.com/musings_crypto",
    name: "Crypto Musings 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1351020322150084609/CbguDwLa_normal.jpg",
    profileUrl: "https://twitter.com/cerium141",
    name: "Spenser🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1381079163595935749/SV5sF3d7_normal.jpg",
    profileUrl: "https://twitter.com/KKatoushya",
    name: "ΞDΞN 🦇🔊",
  },
  {
    profileImageUrl:
      "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png",
    profileUrl: "https://twitter.com/ichnicht040",
    name: "dasfdsafaeds 🦇🔊",
  },
  {
    profileImageUrl: null,
    profileUrl: "https://twitter.com/hopinmypool",
    name: "poolboy.eth 🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1397480267183529984/SXGefOVY_normal.jpg",
    profileUrl: "https://twitter.com/BrainFr33z3",
    name: "BrainFr33z3",
  },
  {
    profileImageUrl:
      "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png",
    profileUrl: "https://twitter.com/whatsamader",
    name: "whatsamaddΞr",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1393401673461092361/my-6EQ4G_normal.jpg",
    profileUrl: "https://twitter.com/83727472784s",
    name: "🦇🔊🦇🔊🦇🔊",
  },
  {
    profileImageUrl:
      "https://pbs.twimg.com/profile_images/1373338164413263876/XbY7UkqT_normal.jpg",
    profileUrl: "https://twitter.com/BradyGreene20",
    name: "Crypto Follower 🦇🔊",
  },
];
// const fetcher = (url: string) =>
//   fetch(url, {
//     method: "GET",
//     headers: {
//       "Access-Control-Allow-Origin": "*",
//       "Content-Type": "application/json",
//     },
//   }).then((r) => r.json());
const TwitterProfile: React.FC<{}> = () => {
  // const [twitterData, setTwitterData] = React.useState<TwitterProfileProps[]>(
  //   StaticData
  // );
  // const { data, error } = useSWR(
  //   "http://serve-fam-1761382800.us-east-2.elb.amazonaws.com/fam/profiles",
  //   fetcher,
  //   {
  //     refreshInterval: 120000,
  //   }
  // );
  // React.useEffect(() => {
  //   error || !data ? setTwitterData(StaticData) : setTwitterData(data);
  // }, [data, error, setTwitterData]);
  return (
    <>
      <div className="flex flex-wrap">
        {StaticData &&
          StaticData.map((item: TwitterProfileProps, index: number) => (
            <div key={index} className="m-2 w-10 h-10">
              <a
                target="_blank"
                href={item.profileUrl}
                rel="noopener noreferrer"
                role="link"
                title={item.name}
              >
                <img
                  className="rounded-full w-full"
                  src={
                    item.profileImageUrl !== null &&
                    item.profileImageUrl != undefined
                      ? item.profileImageUrl
                      : AvatarImg
                  }
                  title={item.name}
                  alt={item.name}
                />
              </a>
            </div>
          ))}
      </div>
    </>
  );
};

export default TwitterProfile;
