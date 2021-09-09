interface Data {
  [key: string]: string;
}

interface TwitterProfile {
  name: string;
  profileImageUrl: string;
  profileUrl: string;
  bio: string;
  followersCount: number;
  famFollowerCount: number;
}

interface TwitterProfileData {
  profile: TwitterProfile[];
  count: number;
}
declare module "*.svg" {
  const value: string;
  export default value;
}

declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.jpg" {
  const value: string;
  export default value;
}

declare module "*.jpeg" {
  const value: string;
  export default value;
}
declare module "*.webp" {
  const value: string;
  export default value;
}
