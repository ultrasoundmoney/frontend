import { AppProps } from "next/app";
import "../../styles/index.scss";

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
