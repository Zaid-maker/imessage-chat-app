import { Session } from "next-auth";
import { FC } from "react";

interface ChatProps {
  session: Session;
}

const Chat: FC<ChatProps> = ({ session }) => {
  return <div>CHAT</div>;
};

export default Chat;
