import { FC, ReactEventHandler, useState } from "react";
import { usePopper } from "react-popper";
import { FamProfile } from "../../api/fam";
import Image from "../Image";
import { FamModalContent } from "./FamModal";

const imageErrorHandler: ReactEventHandler<HTMLImageElement> = (e) => {
  const el = e.currentTarget;
  el.onerror = null;
  el.src = "/avatar.svg";
};

const FamAvatar: FC<{
  onClick: (profile: FamProfile) => void;
  profile: FamProfile;
}> = ({ onClick, profile }) => {
  const [refEl, setRefEl] = useState<HTMLDivElement | null>(null);
  const [popperEl, setPopperEl] = useState<HTMLDivElement | null>(null);
  const { styles, attributes } = usePopper(refEl, popperEl, {
    placement: "top-start",
    modifiers: [{ name: "flip" }],
  });
  const [hovering, setHovering] = useState(false);
  const [tooltipHovering, setTooltipHovering] = useState(false);

  return (
    <>
      <div
        className="m-2 w-10 h-10"
        onClick={() => onClick(profile)}
        ref={setRefEl}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <Image
          alt={profile.name}
          className="rounded-full"
          height="40"
          onError={imageErrorHandler}
          src={
            profile.profileImageUrl != undefined
              ? profile.profileImageUrl
              : "/avatar.svg"
          }
          unoptimized
          width="40"
        />
      </div>
      <div
        ref={setPopperEl}
        className={`hidden md:block z-10`}
        style={{
          ...styles.popper,
          visibility: hovering || tooltipHovering ? "visible" : "hidden",
        }}
        {...attributes.popper}
      >
        <FamModalContent
          profile={profile}
          onHovering={(hovering) => setTooltipHovering(hovering)}
        ></FamModalContent>
      </div>
    </>
  );
};

export default FamAvatar;
