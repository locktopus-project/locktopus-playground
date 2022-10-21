import {
  ArrowRightIcon,
  CloseIcon,
  LockIcon,
  SmallCloseIcon,
  UnlockIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  ButtonGroup,
  HStack,
  IconButton,
  Progress,
  Spacer,
  Text,
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
      })
      .catch((err) => {
        setConnError(`Connection failed: ${err}`);
        setIsConnecting(false);
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
  }, []);

  const onLock = useCallback(() => {
    const client = locktopusClientRef.current;

    if (!client) {
      return;
    }

    setLockLoading(true);

    const lockResources: LockResource[] = Array.from(
      resources.current.values(),
    ).map((r) => ({
      path: r.path,
      type: r.write ? LOCK_TYPE.WRITE : LOCK_TYPE.READ,
    }));

    client
      .lock(...lockResources)
      .then(() => {
        setLockLoading(false);
        setConnState(client.getState());

        return client.acquire();
      })
      .then(() => {
        setConnState(client.getState());
      })
      .catch((err) => {
        setConnError(`Lock failed: ${err}`);
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
      });
  }, []);

  const isConnected = connState !== CLIENT_STATE.NOT_CONNECTED;

  const connectButton = isConnected ? (
    <Button
      variant={"ghost"}
      leftIcon={<SmallCloseIcon />}
      onClick={onDisconnect}
      colorScheme={"orange"}
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
      colorScheme={"green"}
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
          : "gray"
      }
    />
  );

  const lockButton = (
    <Button
      variant={"ghost"}
      leftIcon={<LockIcon />}
      onClick={onLock}
      isDisabled={connState !== CLIENT_STATE.READY}
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

  return (
    <Box rounded={10} borderColor="gray" borderWidth={1} p={0}>
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
          {closeSegmentButton}
        </ButtonGroup>
      </HStack>
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
