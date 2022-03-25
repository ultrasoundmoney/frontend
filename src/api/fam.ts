import useSWR from "swr";
import * as Config from "../config";
import fetcher from "./default-fetcher";

export type LinkableUrl = {
  display_url: string;
  end: number;
  expanded_url: string;
  start: number;
};

export type LinkableMention = {
  start: number;
  end: number;
  username: string;
};

export type LinkableCashtag = { start: number; end: number; tag: string };

export type LinkableHashtag = { start: number; end: number; tag: string };

export type Linkables = {
  cashtags?: LinkableCashtag[];
  hashtags?: LinkableHashtag[];
  mentions?: LinkableMention[];
  urls?: LinkableUrl[];
};

export type FamProfile = {
  bio: string | undefined;
  famFollowerCount: number;
  followersCount: number;
  links: Linkables | undefined;
  name: string;
  profileImageUrl: string;
  profileUrl: string;
};

type ProfilesResponse = {
  count: number;
  profiles: FamProfile[];
};

export const famBasePath =
  Config.apiEnv === "staging"
    ? "https://api-stag.ultrasound.money/fam"
    : Config.apiEnv === "dev"
    ? "http://localhost:8080/fam"
    : "https://api.ultrasound.money/fam";

export const useProfiles = () => {
  const { data } = useSWR<ProfilesResponse>(`${famBasePath}/profiles`, fetcher);

  return data;
};
