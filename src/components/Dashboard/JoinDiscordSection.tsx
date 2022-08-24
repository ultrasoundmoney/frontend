import Link from "next/link";
import type { FC } from "react";
import { useActiveBreakpoint } from "../../utils/use-active-breakpoint";
import { WhiteEmoji } from "../Emoji";
import JoinDiscordWidget from "../JoinDiscordWidget";
import { SectionTitle } from "../Texts";

const JoinDiscordSection: FC = () => {
  const { md } = useActiveBreakpoint();
  return (
    <div className="mt-32" id="join-discord">
      <div className="flex justify-center items-center gap-x-4 mb-16">
        <Link href={`#join-discord`}>
          <a className="flex items-center gap-x-4 text-white">
            <h2
              className={`
              font-inter font-extralight
              text-white text-center text-2xl md:text-3xl xl:text-4xl
            `}
            >
              ultra sound{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-indigo-700">
                Discord
              </span>
            </h2>
            <WhiteEmoji
              alt="emoji of a chain link symbolizing a section anchor for easy linking"
              name="link"
              width={md ? 24 : 16}
            />
          </a>
        </Link>
      </div>
      <JoinDiscordWidget />
    </div>
  );
};
export default JoinDiscordSection;
