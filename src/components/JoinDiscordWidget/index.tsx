import { signIn, useSession } from "next-auth/react";
import type { FC } from "react";

const JoinDiscordWidget: FC = () => {
  const { data: session } = useSession();
  console.log(session);

  return (
    <div>
      <span>join that discord!</span>
      <button
        onClick={() => {
          signIn().catch(console.error);
        }}
      >
        Sign in
      </button>
    </div>
  );
};

export default JoinDiscordWidget;
