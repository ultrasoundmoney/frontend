import { useLocalStorage } from "./use-local-storage";

// When sending people to twitter for authentication, it'd be nice for them to
// end up back at the component they used to authenticate. The problem is, we
// have to, and as we're sending them to Twitter and Twitter sends them back to
// us, we currently have no mechanism to know where they came from. To overcome
// this, we set a tiny piece of local storage state to track if we sent them
// away, then, whenever someone opens up the dashboard, we can check if this
// state is set, and if so, unset and scroll to it.

export type AuthFromSection = "poap" | "discord" | "empty";

const useAuthFromSection = () =>
  useLocalStorage<AuthFromSection>("auth-from-section", "empty");

export default useAuthFromSection;
