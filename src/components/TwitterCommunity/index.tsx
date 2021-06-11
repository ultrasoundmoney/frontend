import * as React from "react";
import TwitterProfile from "./TwitterProfile";

type TwitterCommunityPros = {
  Data?: Data;
};
const TwitterCommunity: React.FC<TwitterCommunityPros> = ({ Data }) => {
  return (
    <>
      <h1 className="text-white text-2xl md:text-3xl leading-none text-center font-light mb-8 capitalize hover:underline">
        <a
          target="_blank"
          href="https://twitter.com/i/lists/1376636817089396750/members"
          rel="noopener noreferrer"
          role="link"
          title="Join The twitter Fam : Ultra Sound Money"
        >
          {Data.title_community}
        </a>
      </h1>
      <p
        className="text-white leading-6 md:leading-none text-center font-light text-base lg:text-lg mb-14 span-bat-sound"
        dangerouslySetInnerHTML={{ __html: Data.description_community }}
      />
      <TwitterProfile />
    </>
  );
};

export default TwitterCommunity;
