import type { FC } from "react";
import JoinDiscordWidget from "../JoinDiscordWidget";
import { SectionTitle } from "../TextsNext/SectionTitle";

const JoinDiscordSection: FC = () => (
  <div className="pt-32" id="join-discord">
    <SectionTitle
      className="mb-16"
      link="join-discord"
      highlightGradient="bg-gradient-to-br from-indigo-400 to-indigo-700"
      highlightPhrase="Discord"
    >
      ultra sound
    </SectionTitle>
    <JoinDiscordWidget />
  </div>
);
export default JoinDiscordSection;
