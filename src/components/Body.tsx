import { Box, Flex, Img, Wrap, WrapItem } from "@chakra-ui/react";
import { useSize } from "@chakra-ui/react-use-size";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Session } from "./Session";
import { ReactComponent as Locktopus } from "../locktopus.svg";
import { useRef } from "react";

export const Body = () => {
  const sessions = useSelector((store: RootState) => store.locks.sessions);
  const a = useRef<HTMLDivElement>(null);
  const bodySize = useSize(a);
  const minSide =
    Math.min(bodySize?.height || 100, bodySize?.width || 100) * 0.8;
  console.log(bodySize);

  return (
    <Wrap>
      <Flex
        ref={a}
        position={"fixed"}
        zIndex={-1}
        alignItems={"center"}
        justifyContent="center"
        w="100vw"
        h="100vh"
      >
        <Box width={`${minSide}px`} height={`${minSide}px`}>
          <Locktopus fill="teal" width={"100%"} height="100%" />
        </Box>
      </Flex>
      {sessions.map((session) => (
        <WrapItem p={5} key={session.id}>
          <Session id={session.id} />
        </WrapItem>
      ))}
    </Wrap>
  );
};
