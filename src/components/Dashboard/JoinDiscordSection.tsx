import type { Dispatch, FC, SetStateAction } from "react";
import withBasicErrorBoundary from "../../higher-order-components/WithBasicErrorBoundary";
import type { AuthFromSection } from "../../hooks/use-auth-from-section";
import type { TwitterAuthStatus } from "../../hooks/use-twitter-auth";
import JoinDiscordWidget from "../JoinDiscordWidget";
import { SectionTitle } from "../TextsNext/SectionTitle";

const JoinDiscordSection: FC<{
  setTwitterAuthStatus: Dispatch<SetStateAction<TwitterAuthStatus>>;
  twitterAuthStatus: TwitterAuthStatus;
}> = ({ setTwitterAuthStatus, twitterAuthStatus }) => {
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
      <JoinDiscordWidget
        twitterAuthStatus={twitterAuthStatus}
        setTwitterAuthStatus={setTwitterAuthStatus}
      />
    </section>
  );
};

export default withBasicErrorBoundary(JoinDiscordSection);
