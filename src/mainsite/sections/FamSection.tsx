import type { FC, ReactNode } from "react";
import { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import Section from "../../components/Section";
import QuantifyText from "../../components/TextsNext/QuantifyText";
import Twemoji from "../../components/Twemoji";
import WidgetBase from "../../relay/components/WidgetBase";
import { useProfiles } from "../api/profiles";
import BodyTextV3 from "../../components/TextsNext/BodyTextV3";
import BlueButton from "../../components/BlueButton";
import FamExplorer from "../components/FamExplorer";

const Button: FC<{ children: ReactNode; onClick: () => void }> = ({
  children,
  onClick,
}) => (
  <button
    className={`
      flex select-none gap-x-2 self-center
      rounded-full
      border
      border-slateus-200 bg-slateus-600 py-1.5
      px-3 outline-slateus-200 hover:brightness-110
      active:brightness-90
      md:py-2
    `}
    onClick={onClick}
  >
    <BodyTextV3>{children}</BodyTextV3>
  </button>
);

const FamExplorerPlaceholder: FC<{ onClick: () => void }> = ({ onClick }) => (
  <WidgetBase className="w-full min-h-[696px]" title="fam explorer">
    <div className="flex justify-center my-auto">
      <Button onClick={onClick}>load explorer</Button>
    </div>
  </WidgetBase>
);

const FamSection: FC = () => {
  const profiles = useProfiles()?.profiles;
  const [isCopiedFeedbackVisible, setIsCopiedFeedbackVisible] = useState(false);
  // Copy batsound feedback
  const onBatSoundCopied = () => {
    setIsCopiedFeedbackVisible(true);
    setTimeout(() => setIsCopiedFeedbackVisible(false), 800);
  };
  const [isFamExplorerRequested, setIsFamExplorerRequested] = useState(false);

  return (
    <Section key="fam" title="join the fam" link="fam">
      <div className="flex flex-col gap-x-4 gap-y-4 w-full lg:flex-row">
        <WidgetBase className="w-full" title="fam count">
          <QuantifyText
            size="text-3xl "
            unitPostfix="members"
            unitPostfixMargin="ml-2"
          >
            {profiles?.length?.toLocaleString("en-US")}
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
      {isFamExplorerRequested ? (
        <FamExplorer />
      ) : (
        <FamExplorerPlaceholder
          onClick={() => setIsFamExplorerRequested(true)}
        />
      )}
    </Section>
  );
};

export default FamSection;
