import { Box } from "@chakra-ui/react";
import type { NextPage, NextPageContext } from "next";
import { getSession, signOut, useSession } from "next-auth/react";
import Auth from "../components/Auth/Auth";

const Home: NextPage = () => {
  const { data: session } = useSession();

  /**
   * It creates a new event, dispatches it, and then returns nothing
   */
  const reloadSession = () => {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  };

  return (
    <Box>
      {session?.user ? (
        <button onClick={() => signOut}>Sign Out</button>
      ) : (
        <>
          <Auth session={session} reloadSession={reloadSession} />
        </>
      )}
    </Box>
  );
};

export async function getServerSideProps(ctx: NextPageContext) {
  const session = await getSession(ctx);

  return {
    props: {
      session,
    },
  };
}

export default Home;
