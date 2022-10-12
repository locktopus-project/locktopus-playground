import { Wrap, WrapItem } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Session } from "./Session";

export const Body = () => {
  const sessions = useSelector((store: RootState) => store.locks.sessions);

  return (
    <Wrap>
      {sessions.map((session) => (
        <WrapItem p={5} key={session.id}>
          <Session id={session.id} />
        </WrapItem>
      ))}
    </Wrap>
  );
};
