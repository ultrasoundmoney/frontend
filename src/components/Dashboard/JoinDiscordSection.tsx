import type { FC } from "react";
import type { AuthFromSection } from "../../hooks/use-auth-from-section";
import JoinDiscordWidget from "../JoinDiscordWidget";
import { SectionTitle } from "../TextsNext/SectionTitle";

const JoinDiscordSection: FC = () => {
  const id: AuthFromSection = "discord";

  return (
    <section className="mt-16 px-4 md:px-16" id={id}>
      <SectionTitle
        className="py-16"
        link="discord"
        highlightGradient="bg-gradient-to-br from-indigo-400 to-indigo-700"
        highlightPhrase="Discord"
      >
        ultra sound
      </SectionTitle>
      <JoinDiscordWidget />
    </section>
  );
};

export default JoinDiscordSection;
