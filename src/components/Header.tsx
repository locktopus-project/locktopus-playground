import { Button, Flex, Spacer } from "@chakra-ui/react";
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import { AddressBar } from "./AddressBar";
import { Help } from "./Help";
import { AddIcon } from "@chakra-ui/icons";
import { useDispatch } from "react-redux";
import { create } from "../store";
import { ConnectionStatus } from "./ConnectionStatus";

export const Header = () => {
  const dispatch = useDispatch();

  return (
    <Flex
      p={4}
      alignItems={"center"}
      justifyContent={"start"}
      gap={4}
      w="full"
      wrap={"wrap"}
    >
      <AddressBar />
      <ConnectionStatus />
      <Button
        leftIcon={<AddIcon />}
        variant="outline"
        onClick={() => {
          dispatch(create());
        }}
      >
        Lock
      </Button>

      <Spacer />
      <Help />
      <ColorModeSwitcher />
    </Flex>
  );
};
