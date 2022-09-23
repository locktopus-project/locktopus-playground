import { Box, Flex } from "@chakra-ui/react";
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import { AddressBar, ConnectionStatus } from "./AddressBar";
import { Help } from "./Help";

export const Header = () => {
  return (
    <Flex
      p={4}
      alignItems={"center"}
      justifyContent={"space-between"}
      gap={4}
      w="full"
      wrap={"wrap"}
    >
      <Flex alignItems={"center"}>
        <AddressBar />
        <ConnectionStatus />
      </Flex>
      <Flex alignItems={"center"}>
        <Help />
        <ColorModeSwitcher />
      </Flex>
    </Flex>
  );
};
