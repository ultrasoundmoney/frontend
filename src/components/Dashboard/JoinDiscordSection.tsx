import type { FC } from "react";
import JoinDiscordWidget from "../JoinDiscordWidget";
import { SectionTitle } from "../Texts";

const JoinDiscordSection: FC = () => (
  <div id="join-discord">
    <SectionTitle link="join-discord" title="ultra sound discord" />
    <JoinDiscordWidget />
  </div>
);

export default JoinDiscordSection;
