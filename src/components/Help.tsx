import {
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
import { LOCKTOPUS_SERVER_IMAGE_NAME } from "../constants";
import { CopyIcon, CheckIcon } from "@chakra-ui/icons";

export const Help = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const runCommand = `docker run -it --rm -p 9009:9009 ${LOCKTOPUS_SERVER_IMAGE_NAME}`;
  const connString = `ws://127.0.0.1:9009/v1?namespace=default`;

  return (
    <>
      <Button onClick={onOpen}>Help</Button>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Welcome to LOCKTOPUS Playground</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Run local instance of LOCKTOPUS Server using ths command:
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
            <Text>After that, add locks with resources and try them out</Text>
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
      {hasCopied ? <CheckIcon /> : <CopyIcon />}
    </Button>
  );
};
