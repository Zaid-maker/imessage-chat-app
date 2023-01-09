import { Button, Center, Image, Input, Stack, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { ChangeEvent, FC, useState } from "react";

interface AuthProps {
  session: Session | null;
  reloadSession: () => void;
}

const Auth: FC<AuthProps> = ({ session, reloadSession }) => {
  const [username, setUsername] = useState("");

  return (
    <Center height="100vh">
      <Stack spacing={8} align="center">
        {session ? (
          <>
            <Text fontSize="3xl">Create a Username</Text>
            <Input
              placeholder="Enter a Username"
              value={username}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setUsername(event.target.value)
              }
            />
            <Button width="100%">Save</Button>
          </>
        ) : (
          <>
            <Image alt="logo" height={100} src="/images/imessage-logo.png" />
            <Text fontSize="4xl">Single&apos;s Chat 😜</Text>
            <Text width="70%" align="center">
              Sign in with Google to send unlimited free messages to your
              friends.
            </Text>
            <Button
              onClick={() => signIn("google")}
              leftIcon={
                <Image
                  src="/images/googlelogo.png"
                  height="20px"
                  alt="googlelogo"
                />
              }
            >
              Continue with Google
            </Button>
          </>
        )}
      </Stack>
    </Center>
  );
};

export default Auth;
