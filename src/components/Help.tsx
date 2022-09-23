import {
  Box,
  Button,
  Code,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useClipboard,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { GEARLOCK_SERVER_IMAGE_NAME } from "../constants";

export const Help = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const runCommand = `docker run -it --rm -p 9009:9009 ${GEARLOCK_SERVER_IMAGE_NAME}`;
  const connString = `ws://127.0.0.1:9009/v1?namespace=default`;

  return (
    <>
      <Button onClick={onOpen}>Help</Button>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Welcome to Gearlock Playground</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Run local instance of Gearlock Server using ths command:
            </Text>
            <CodeBlock>
              <Flex
                flexDirection={"row"}
                justifyContent="space-between"
                alignItems={"center"}
              >
                <Text>{runCommand}</Text>
                <CopyButton text={runCommand} />
              </Flex>
            </CodeBlock>
            <Text>Then, use its address for connection:</Text>
            <CodeBlock>
              <Flex
                flexDirection={"row"}
                justifyContent="space-between"
                alignItems={"center"}
              >
                <Text>{connString}</Text>
                <CopyButton text={connString} />
              </Flex>
            </CodeBlock>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    </>
  );
};

const CodeBlock = (props: { children: any }) => {
  return (
    <Code padding="5" rounded="8px" my="8" w="full">
      {props.children}
    </Code>
  );
};

const CopyButton = (props: { text: string }) => {
  const { hasCopied, onCopy } = useClipboard(props.text);

  return (
    <Button variant={"unstyled"} onClick={onCopy} ml={2}>
      {hasCopied ? "✅" : "📋"}
    </Button>
  );
};
// docker run -it --rm -p 9009:9009 xshkut/gearlock
