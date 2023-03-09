import useSWR from "swr";
import { fetchJsonSwr } from "./fetchers";

export type LinkableUrl = {
  display_url: string;
  end: number;
  expanded_url: string;
  start: number;
  url: string;
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

export const useProfiles = () => {
  // const { data } = useSWR<ProfilesResponse>("/api/fam/profiles", fetchJsonSwr);
  const { data } = useSWR<ProfilesResponse>("/api/fam/all-profiles", fetchJsonSwr);

  return data;
};
