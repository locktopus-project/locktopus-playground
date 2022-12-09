import {
  ArrowBackIcon,
  ArrowForwardIcon,
  ArrowRightIcon,
  ChatIcon,
  CloseIcon,
  LockIcon,
  RepeatClockIcon,
  SmallCloseIcon,
  UnlockIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Progress,
  Spacer,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import {
  LocktopusClient,
  CLIENT_STATE,
  Resource as LockResource,
  LOCK_TYPE,
} from "locktopus-client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { remove, RootState } from "../store";
import { ResourceRef } from "../types";
import { Resource } from "./Resource";

export const Session = (props: { id: number }) => {
  const dispatch = useDispatch();
  const serverAddress = useSelector((store: RootState) => store.serverAddress);

  const nextResourceKey = useRef(0);
  const locktopusClientRef = useRef<LocktopusClient>();
  const resources = useRef(new Map<number, ResourceRef>());

  const [resourceKeys, setResourceKeys] = useState<number[]>([
    nextResourceKey.current++,
  ]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connError, setConnError] = useState<string | undefined>();
  const [connState, setConnState] = useState<CLIENT_STATE>(
    CLIENT_STATE.NOT_CONNECTED,
  );
  const [lockLoading, setLockLoading] = useState(false);

  let [history, setHistory] = useState<string[]>([]);
  let [messages, setMessages] = useState<
    { message: string; incoming: boolean; date: Date }[]
  >([]);

  const {
    isOpen: isHistoryOpen,
    onOpen: onHistoryOpen,
    onClose: onHistoryClose,
  } = useDisclosure();

  const {
    isOpen: isMessagesOpen,
    onOpen: onMessagesOpen,
    onClose: onMessagesClose,
  } = useDisclosure();

  const locktopusClient = locktopusClientRef.current;

  useEffect(() => {
    return () => {
      if (locktopusClient?.getState() === CLIENT_STATE.NOT_CONNECTED) return;
      locktopusClient?.close();
    };
  }, [locktopusClient]);

  const onConnect = useCallback(() => {
    if (!serverAddress) {
      setConnError("No server address set");
      return;
    }

    setIsConnecting(true);

    locktopusClientRef.current = new LocktopusClient(WebSocket, serverAddress);

    locktopusClientRef.current
      .connect()
      .then(() => {
        const state = locktopusClientRef.current!.getState();
        setConnState(state);
        setConnError(undefined);
        setIsConnecting(false);
        setHistory((history) => [...history, `Connected to ${serverAddress}`]);
        setMessages([]);

        locktopusClientRef.current?.onMessage((msg) => {
          const incoming = msg.direction === "in";
          setMessages((messages) => [
            ...messages,
            { message: msg.data, incoming, date: new Date() },
          ]);
        });
      })
      .catch((err) => {
        setConnError(`Connection failed: ${err}`);
        setIsConnecting(false);
        setHistory((history) => [
          ...history,
          `Connection failed to ${serverAddress}`,
        ]);
      });
  }, [serverAddress]);

  const onDisconnect = useCallback(() => {
    if (!locktopusClientRef.current) {
      return;
    }

    locktopusClientRef.current.close();

    locktopusClientRef.current = undefined;
    setConnError(undefined);
    setConnState(CLIENT_STATE.NOT_CONNECTED);
    setHistory((history) => [...history, `Disconnected from ${serverAddress}`]);
  }, [serverAddress]);

  const onLock = useCallback(() => {
    const client = locktopusClientRef.current;

    if (!client) {
      return;
    }

    const lockResources: LockResource[] = Array.from(
      resources.current.values(),
    ).map((r) => ({
      path: r.path,
      type: r.write ? LOCK_TYPE.WRITE : LOCK_TYPE.READ,
    }));

    setHistory((history) => [
      ...history,
      `Locking:\n ${JSON.stringify(lockResources, undefined, "\t")}`,
    ]);

    setLockLoading(true);

    client
      .lock(...lockResources)
      .then(() => {
        setLockLoading(false);
        setConnState(client.getState());
        setHistory((history) => [...history, `Lock enqueued`]);

        return client.acquire();
      })
      .then(() => {
        setConnState(client.getState());
        setHistory((history) => [...history, `Lock acquired`]);
      })
      .catch((err) => {
        setConnError(`Lock failed: ${err}`);
        setHistory((history) => [...history, `Lock errored: ${err}`]);
      });
  }, []);

  const onRelease = useCallback(() => {
    const client = locktopusClientRef.current;

    if (!client) {
      return;
    }

    client
      .release()
      .then(() => {
        setConnState(client.getState());
      })
      .catch((err) => {
        setConnError(`Release failed: ${err}`);
        setConnState(client.getState());
        setHistory((history) => [...history, `Lock released: ${err}`]);
      });
  }, []);

  const isConnected = connState !== CLIENT_STATE.NOT_CONNECTED;

  const connectButton = isConnected ? (
    <Button
      variant={"ghost"}
      leftIcon={<SmallCloseIcon />}
      onClick={onDisconnect}
      colorScheme={"red"}
    >
      Disconnect
    </Button>
  ) : (
    <Button
      variant={"ghost"}
      leftIcon={<ArrowRightIcon />}
      onClick={onConnect}
      isLoading={isConnecting}
      loadingText="Connecting"
      colorScheme={"blue"}
    >
      {"Connect"}
    </Button>
  );

  const progress = (
    <Progress
      isIndeterminate={connState === CLIENT_STATE.ENQUEUED || lockLoading}
      value={100}
      colorScheme={
        connState === CLIENT_STATE.NOT_CONNECTED
          ? "blackAlpha"
          : connError
          ? "red"
          : connState === CLIENT_STATE.ACQUIRED
          ? "green"
          : connState === CLIENT_STATE.ENQUEUED
          ? "orange"
          : "blue"
      }
    />
  );

  const lockButton = (
    <Button
      variant={"ghost"}
      leftIcon={<LockIcon />}
      onClick={onLock}
      isDisabled={connState !== CLIENT_STATE.READY}
      colorScheme={"green"}
    >
      Lock
    </Button>
  );

  const releaseButton = (
    <Button
      variant={"ghost"}
      onClick={onRelease}
      leftIcon={<UnlockIcon />}
      isDisabled={
        connState !== CLIENT_STATE.ACQUIRED &&
        connState !== CLIENT_STATE.ENQUEUED
      }
      colorScheme={"blue"}
    >
      Release
    </Button>
  );

  const closeSegmentButton = (
    <IconButton
      aria-label="close segment"
      textColor={"red.500"}
      variant="outline"
      disabled={connState !== CLIENT_STATE.NOT_CONNECTED}
      icon={<CloseIcon />}
      onClick={() => {
        dispatch(remove(props.id));
      }}
    />
  );

  const historyButton = (
    <IconButton
      aria-label="history"
      variant="ghost"
      icon={<RepeatClockIcon />}
      onClick={onHistoryOpen}
    />
  );

  const messagesButton = (
    <IconButton
      aria-label="messages"
      variant="ghost"
      icon={<ChatIcon />}
      onClick={onMessagesOpen}
    />
  );

  return (
    <Box
      rounded={10}
      borderColor="gray"
      borderWidth={1}
      p={0}
      backdropFilter={"brightness(0.1)"}
    >
      <VStack align={"start"} p={4}>
        {resourceKeys.map((key) => (
          <HStack key={key}>
            <DeleteResourcePathButton
              isActive={resourceKeys.length > 1}
              onClick={() => {
                setResourceKeys((keys) => keys.filter((k) => k !== key));
              }}
            />

            <Resource
              onChange={(value) => {
                resources.current.set(key, value);
              }}
            />
          </HStack>
        ))}
      </VStack>
      {progress}
      {connError && (
        <Text color="red.400" maxW="full" overflowX={"auto"}>
          {connError}
        </Text>
      )}
      <HStack>
        <AddResourceButton
          onClick={() => {
            setResourceKeys([...resourceKeys, nextResourceKey.current++]);
          }}
        />
        <Spacer />
        <ButtonGroup isAttached>
          {connectButton}
          {lockButton}
          {releaseButton}
          {historyButton}
          {messagesButton}
          {closeSegmentButton}
        </ButtonGroup>
      </HStack>

      <HistoryDrawer
        history={history}
        isOpen={isHistoryOpen}
        onClose={onHistoryClose}
      />

      <MessagesDrawer
        messages={messages}
        isOpen={isMessagesOpen}
        onClose={onMessagesClose}
      />
    </Box>
  );
};

const DeleteResourcePathButton = (props: {
  onClick: Function;
  isActive: boolean;
}) => {
  return (
    <IconButton
      aria-label="Delete path"
      icon={<CloseIcon />}
      variant="outline"
      color="red.200"
      onClick={() => {
        props.onClick();
      }}
      isDisabled={!props.isActive}
    />
  );
};

const AddResourceButton = (props: { onClick: Function }) => {
  return (
    <Button
      variant="outline"
      onClick={() => {
        props.onClick();
      }}
    >
      + Resource
    </Button>
  );
};

const HistoryDrawer = (props: {
  isOpen: boolean;
  onClose: () => void;
  history: string[];
}) => {
  const isEmpty = props.history.length === 0 || null;

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Session History</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isEmpty && <Text>(History is emtpy)</Text>}
          <VStack align={"start"}>
            {props.history.map((h, i) => (
              <Box w="full">
                <Text key={i}>{h}</Text>
                <Divider />
              </Box>
            ))}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const MessagesDrawer = (props: {
  isOpen: boolean;
  onClose: () => void;
  messages: {
    message: string;
    incoming: boolean;
  }[];
}) => {
  const isEmpty = props.messages.length === 0 || null;

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Communication History</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isEmpty && <Text>(Communication history is emtpy)</Text>}
          <VStack align={"start"}>
            {props.messages.map((h, i) => (
              <Box w="full">
                <HStack>
                  {h.incoming && <ArrowBackIcon />}
                  <Text key={i}>
                    {JSON.stringify(JSON.parse(h.message), null, 2)}
                  </Text>
                  {!h.incoming && <ArrowForwardIcon />}
                </HStack>
                <Divider />
              </Box>
            ))}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
