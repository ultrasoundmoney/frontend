import type { FC } from "react";
import type { TwitterAuthStatus } from "../hooks/use-twitter-auth";
import {
  AlignmentText,
  LoadingText,
  NegativeText,
  PositiveText,
} from "./StatusText";

const TwitterStatusText: FC<{ status: TwitterAuthStatus }> = ({ status }) =>
  status.type === "authenticated" ? (
    <PositiveText>authenticated</PositiveText>
  ) : status.type === "checking" ? (
    <LoadingText>checking...</LoadingText>
  ) : status.type === "authenticating" ? (
    <LoadingText>authenticating...</LoadingText>
  ) : status.type === "signing-out" ? (
    <LoadingText>signing out...</LoadingText>
  ) : status.type === "error" ? (
    <NegativeText>error</NegativeText>
  ) : status.type === "access-denied" ? (
    <NegativeText>access denied</NegativeText>
  ) : (
    <AlignmentText />
  );

export default TwitterStatusText;
