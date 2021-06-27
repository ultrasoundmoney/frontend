import { AppProps } from "next/app";
import { TranslationProvider } from "../utils/use-translation";
import Data from "../../locales/en/data.json";
import "../../styles/index.scss";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <TranslationProvider value={Data}>
      <Component {...pageProps} />
    </TranslationProvider>
  );
}
