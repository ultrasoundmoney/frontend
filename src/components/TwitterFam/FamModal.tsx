import { CSSProperties, FC, LegacyRef, ReactEventHandler } from "react";
import Skeleton from "react-loading-skeleton";
import twemoji from "twemoji";
import { FamProfile } from "../../api/fam";
import * as Format from "../../format";
import { useActiveBreakpoint } from "../../utils/use-active-breakpoint";
import styles from "./TwitterFam.module.scss";

const imageErrorHandler: ReactEventHandler<HTMLImageElement> = (e) => {
  const el = e.currentTarget;
  el.onerror = null;
  el.src = "/avatar.svg";
};

export const FamModalContent: FC<{
  profile: FamProfile | undefined;
  onClickClose?: () => void;
  ref?: LegacyRef<HTMLDivElement> | undefined;
  style?: CSSProperties;
  onHovering?: (hovering: boolean) => void;
}> = ({ profile, onClickClose, onHovering, ref, style }) => {
  return (
    <div
      className={`rounded-lg bg-blue-tangaroa text-white px-7 py-7 z-10 flex flex-col drop-shadow-xl w-[20rem] mx-auto gap-y-4`}
      onClick={(e) => {
        e.stopPropagation();
      }}
      ref={ref}
      style={style}
      onMouseEnter={() =>
        onHovering !== undefined ? onHovering(true) : undefined
      }
      onMouseLeave={() =>
        onHovering !== undefined ? onHovering(false) : undefined
      }
    >
      <div className="flex justify-between">
        <img
          className="rounded-full"
          width="80"
          height="80"
          src={
            profile?.profileImageUrl != undefined
              ? profile.profileImageUrl
              : "/avatar.svg"
          }
          alt={profile?.name}
          onError={imageErrorHandler}
        />
        <img
          className={`self-start ${
            onClickClose === undefined ? "hidden" : "block"
          }`}
          src="/close-icon.svg"
          width="30"
          alt="close icon"
          onClick={onClickClose}
        />
      </div>
      <div
        className={`text-white text-base font-medium break-words ${styles.profileText}`}
        dangerouslySetInnerHTML={{
          __html: profile !== undefined ? twemoji.parse(profile.name) : "",
        }}
      ></div>
      {typeof profile?.bio === "string" && (
        <p
          className={`text-blue-linkwater text-left mb-3 font-light text-xs break-words max-w-xs ${styles.profileText}`}
          dangerouslySetInnerHTML={{
            __html: twemoji.parse(profile.bio),
          }}
        />
      )}
      <div className="flex justify-between">
        <div>
          <p className="text-xs text-blue-spindle text-left font-light uppercase mb-0">
            Followers
          </p>
          <p className="text-white text-left font-light text-2xl">
            {profile === undefined ? (
              <Skeleton inline={true} width="4rem" />
            ) : (
              Format.followerCountConvert(profile.followersCount)
            )}
          </p>
        </div>
        <div>
          <p className="text-xs text-blue-spindle text-left font-light uppercase mb-0">
            fam followers
          </p>
          <p className="text-white text-left font-light text-2xl">
            {profile === undefined ? (
              <Skeleton inline width="4rem" />
            ) : (
              Format.followerCountConvert(profile.famFollowerCount)
            )}
          </p>
        </div>
      </div>
      <a
        className="bg-blue-highlightbg p-3 rounded-full text-sm m-auto"
        target="_blank"
        href={profile?.profileUrl || undefined}
        rel="noopener noreferrer"
        role="link"
      >
        view on{" "}
        <img className="inline" src="/twitter-icon.svg" alt="twitter icon" />
      </a>
    </div>
  );
};

export const FamModal: FC<{
  onClickBackground: () => void;
  show: boolean;
}> = ({ children, onClickBackground, show }) => {
  const { md } = useActiveBreakpoint();

  return (
    <div
      className={`fixed top-0 bottom-0 left-0 w-full flex items-center z-10 ${
        show && !md ? "visible" : "invisible"
      }`}
      style={{
        backgroundColor: "rgba(49, 58, 85, 0.6)",
      }}
      onClick={onClickBackground}
    >
      {children}
    </div>
  );
};
