import { useState, useEffect } from "react";
import Head from "next/head";
import { Inter } from "@next/font/google";
import usersServices from "../services/users.services";

const inter = Inter({ subsets: ["latin"] });

const Home = () => {
  const [user, setUser] = useState({} as any);

  useEffect(() => {
    // Perform localStorage action
    setUser(usersServices.getUser());
  }, []);

  return (
    <>
      <Head>
        <title>Postit</title>
        <meta name="description" content="Your reminder app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>
          Bienvenue {user?.firstname} {user?.lastname}
        </h1>
      </main>
    </>
  );
};

export default Home;
