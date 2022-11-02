import type { FC, ReactNode } from "react";
import BodyTextV2 from "./TextsNext/BodyTextV2";

export const LoadingText: FC<{ children: ReactNode }> = ({ children }) => (
  <BodyTextV2 className="animate-pulse text-white">{children}</BodyTextV2>
);

export const PositiveText: FC<{ children: ReactNode }> = ({ children }) => (
  <BodyTextV2 className="text-green-400">{children}</BodyTextV2>
);

export const NegativeText: FC<{ children: ReactNode }> = ({ children }) => (
  <BodyTextV2 className="whitespace-nowrap text-red-400">{children}</BodyTextV2>
);

// Dummy item to fix baseline alignment between sections on md
export const AlignmentText: FC = () => (
  <BodyTextV2 className="select-none">&nbsp;</BodyTextV2>
);
