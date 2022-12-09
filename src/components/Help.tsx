import {
  Button,
  Code,
  Flex,
  Heading,
  List,
  ListIcon,
  ListItem,
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
import {
  CopyIcon,
  CheckIcon,
  ArrowRightIcon,
  LockIcon,
  UnlockIcon,
  SmallCloseIcon,
  AddIcon,
} from "@chakra-ui/icons";

export const Help = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const runCommand = `docker run -it --rm -p 9009:9009 ${LOCKTOPUS_SERVER_IMAGE_NAME}`;
  const connString = `ws://127.0.0.1:9009/v1?namespace=default&abandon-timeout-ms=5000`;

  return (
    <>
      <Button onClick={onOpen}>Help</Button>

      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Welcome to Locktopus Playground</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Heading pb={4} size="lg">
              How to setup
            </Heading>
            <Text>
              Run local instance of Locktopus Server using ths command:
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
            <Text>Ensure the server is reachable (status ONLINE)</Text>
            <Heading pb={4} size="lg">
              How to use
            </Heading>
            <Text pb={2}>
              Create multiple Sessions to test how locked resources interfere
              with each other. For each connection, follow these steps:
            </Text>
            <List>
              <ListItem>
                <ListIcon as={ArrowRightIcon} color="green.500" />
                Connect: establish connection to the server
              </ListItem>
              <ListItem>
                <ListIcon as={AddIcon} />
                Add Lock Resources. By default, you have only one resource with
                a Path having no segments (pointing to root). Actually, that
                means you will lock the entire namespace. Add segments to
                specify concrete path you want to lock. Also, switch lock type
                to READ or WRITE.
              </ListItem>
              <ListItem>
                <ListIcon as={LockIcon} />
                Lock: Try locking the specified set of resources. Wait until the
                lock is acruired.
              </ListItem>
              <ListItem>
                <ListIcon as={UnlockIcon} />
                Release: Allow others to acquire the lock
              </ListItem>
              <ListItem>
                <ListIcon as={SmallCloseIcon} color="yellow.500" />
                Disconnect when you are done
              </ListItem>
            </List>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    </>
  );
};

const CodeBlock = (props: { children: any }) => {
  return (
    <Code padding={4} rounded="8px" my="4" w="full">
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
