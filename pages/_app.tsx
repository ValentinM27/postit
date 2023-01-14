// add bootstrap css
import "bootstrap/dist/css/bootstrap.css";

import { useRouter } from "next/router";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Nav } from "../components";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const showHeader =
    router.pathname === "/users/signup" || router.pathname === "/users/signin"
      ? false
      : true;

  return (
    <div>
      {showHeader && <Nav />}
      <Component {...pageProps} />
    </div>
  );
}
