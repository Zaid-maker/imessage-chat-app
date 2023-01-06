import type { NextPage, NextPageContext } from "next";
import { useSession } from "next-auth/react";

const Home: NextPage = () => {
  const { data: session } = useSession();

  return <div>Home</div>;
};

export default Home;
