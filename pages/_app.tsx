// add bootstrap css
import "bootstrap/dist/css/bootstrap.css";

import { useRouter } from "next/router";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Nav } from "../components";
import { RouteGuard } from "../services/routeGuard";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const showHeader =
    router.pathname === "/users/signup" ||
    router.pathname === "/users/signin" ||
    router.pathname === "/contracts/terms"
      ? false
      : true;

  return (
    <div>
      <RouteGuard>
        {showHeader && <Nav />}
        <div className="wrapper">
          <Component {...pageProps} />
        </div>
      </RouteGuard>
    </div>
  );
}
