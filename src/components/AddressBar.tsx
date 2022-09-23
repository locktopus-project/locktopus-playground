import {
  Badge,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  Link,
  Text,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import useAxios from "axios-hooks";
import { setServerAddress, RootState } from "../store";
import { useDispatch, useSelector } from "react-redux";

type ConnStatus = {
  colorScheme: string;
  text: string;
};

export const AddressBar = () => {
  const dispatch = useDispatch();
  const serverAddress = useSelector((state: RootState) => state.serverAddress);
  const [addressInput, setAddressInput] = useState(serverAddress);

  const isValid = useMemo(() => {
    try {
      const url = new URL(addressInput);

      if (!["ws:", "wss:"].includes(url.protocol)) {
        return false;
      }

      if (!url.pathname.endsWith("/v1")) {
        return false;
      }

      if (!url.searchParams.has("namespace")) {
        return false;
      }

      return true;
    } catch (err) {
      return false;
    }
  }, [addressInput]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(setServerAddress(addressInput));
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [addressInput, dispatch]);

  return (
    <Flex alignItems={"center"} gap={2} w="full" pr={4}>
      <InputGroup size="sm">
        <InputLeftAddon children="server:" />
        <Input
          isInvalid={!isValid}
          placeholder="refer to Help -->>"
          value={addressInput}
          onChange={(event) => setAddressInput(event.target.value)}
          width={`${Math.max(addressInput.length, 20)}ch`}
        />
      </InputGroup>
    </Flex>
  );
};

export const ConnectionStatus = () => {
  const serverAddress = useSelector((state: RootState) => state.serverAddress);

  const homeUrl = useMemo(() => {
    try {
      const apiUrl = new URL(serverAddress);
      const homeUrl = new URL(
        apiUrl.protocol.replace("ws", "http") + "//" + apiUrl.host,
      );
      return homeUrl.toString();
    } catch (err) {
      return "";
    }
  }, [serverAddress]);

  const [{ data, error }, refetch] = useAxios(homeUrl, {
    manual: true,
  });

  const connStatus: ConnStatus | null = useMemo(() => {
    if (error) {
      return {
        colorScheme: "red",
        text: `offline`,
      };
    }
    if (data) {
      return {
        colorScheme: "green",
        text: "online",
      };
    } else {
      return {
        colorScheme: "red",
        text: `offline`,
      };
    }
  }, [data, error]);

  useEffect(() => {
    const interval = setInterval(() => {
      refetch({}).catch((err) => {});
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [connStatus?.text, refetch]);

  return (
    connStatus && (
      <Text>
        <Badge colorScheme={connStatus.colorScheme}>
          <Link href={homeUrl} target={"_blank"}>
            {connStatus.text}
          </Link>
        </Badge>
      </Text>
    )
  );
};
