import { useState, useEffect } from "react";
import Head from "next/head";
import { Inter } from "@next/font/google";
import usersServices from "../services/users.services";
import { user } from "./model-ts";

const inter = Inter({ subsets: ["latin"] });

const Home = () => {
  const [user, setUser] = useState({} as user);

  useEffect(() => {
    // Perform localStorage action
    setUser(usersServices.getUser());
  }, []);

  return (
    <>
      <Head>
        <title>The Archiver</title>
        <meta name="description" content="Your reminder app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Bienvenue {user?.login}</h1>
      </main>
    </>
  );
};

export default Home;
