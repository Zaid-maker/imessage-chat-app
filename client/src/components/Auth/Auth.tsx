import { Center, Stack, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { FC } from "react";

interface AuthProps {
  session: Session | null;
  reloadSession: () => void;
}

const Auth: FC<AuthProps> = ({ session, reloadSession }) => {
  return (
    <Center height="100vh">
      <Stack spacing={8} align="center">
        <Text>Sign in with your favorite provider and start chatting!</Text>
      </Stack>
    </Center>
  );
};

export default Auth;
