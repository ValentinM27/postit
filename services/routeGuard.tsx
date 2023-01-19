import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import UsersServices from "./users.services";

export { RouteGuard };

function RouteGuard({ children }: any) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // on initial load - run auth check
    authCheck(router.asPath);

    // on route change start - hide page content by setting authorized to false
    const hideContent = () => setAuthorized(false);
    router.events.on("routeChangeStart", hideContent);

    // on route change complete - run auth check
    router.events.on("routeChangeComplete", authCheck);

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off("routeChangeStart", hideContent);
      router.events.off("routeChangeComplete", authCheck);
    };
  }, []);

  function authCheck(url: string) {
    const publicPaths = ["/users/signup", "/users/signin", "/contracts/terms"];
    const path = url.split("?")[0];
    if (!UsersServices.isAuthentificated() && !publicPaths.includes(path)) {
      setAuthorized(false);
      router.push({
        pathname: "/users/signup",
      });
    } else {
      setAuthorized(true);
      if (["/"].includes(path)) {
        router.push({
          pathname: "/archives",
        });
        return;
      }
    }
  }

  return authorized && children;
}
