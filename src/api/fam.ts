import useSWR from "swr";
import * as Config from "../config";

type Profile = {
  bio: string;
  famFollowerCount: number;
  followersCount: number;
  name: string;
  profileImageUrl: string;
  profileUrl: string;
};

type ProfilesResponse = {
  count: number;
  profiles: Profile[];
};

export const famBasePath =
  Config.apiEnv === "staging"
    ? "https://api-stag.ultrasound.money/fam"
    : Config.apiEnv === "dev"
    ? "http://localhost:8080/fam"
    : "https://api.ultrasound.money/fam";

export const useProfiles = () => {
  const { data } = useSWR<ProfilesResponse>(`${famBasePath}/profiles`);

  return data;
};
