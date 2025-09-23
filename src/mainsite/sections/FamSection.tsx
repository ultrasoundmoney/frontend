import type { FC } from "react";
import { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import Section from "../../components/Section";
import QuantifyText from "../../components/TextsNext/QuantifyText";
import Twemoji from "../../components/Twemoji";
import WidgetBase from "../../components/WidgetBase";
import BlueButton from "../../components/BlueButton";
import FamExplorerV2 from "../components/FamExplorerV1";

const FamSection: FC = () => {
  // const profiles = useAllProfiles()?.profiles;
  const [isCopiedFeedbackVisible, setIsCopiedFeedbackVisible] = useState(false);
  // Copy batsound feedback
  const onBatSoundCopied = () => {
    setIsCopiedFeedbackVisible(true);
    setTimeout(() => setIsCopiedFeedbackVisible(false), 800);
  };

  return (
    <Section key="fam" title="join the fam" link="fam">
      <div className="flex flex-col gap-x-4 gap-y-4 w-full lg:flex-row">
        <WidgetBase className="w-full" title="fam count">
          <QuantifyText
            size="text-3xl "
            unitPostfix="members"
            unitPostfixMargin="ml-2"
          >
            6,000+
          </QuantifyText>
        </WidgetBase>
        <WidgetBase className="w-full" title="wear the bat signal">
          <div className="flex flex-row justify-between items-center">
            <Twemoji className="flex gap-x-1" imageClassName="w-11" wrapper>
              🦇🔊
            </Twemoji>
            <CopyToClipboard text={"🦇🔊"} onCopy={onBatSoundCopied}>
              <div>
                <BlueButton>
                  {isCopiedFeedbackVisible ? "copied!" : "copy"}
                </BlueButton>
              </div>
            </CopyToClipboard>
          </div>
        </WidgetBase>
      </div>
      <FamExplorerV2 />
    </Section>
  );
};

export default FamSection;
