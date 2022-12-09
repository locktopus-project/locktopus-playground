import { Flex, Input, InputGroup, InputLeftAddon } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { setServerAddress, RootState } from "../store";
import { useDispatch, useSelector } from "react-redux";

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

      if (url.searchParams.has("abandon-timeout-ms")) {
        const abandonTimeout = Number(
          url.searchParams.get("abandon-timeout-ms"),
        );

        if (!Number.isInteger(abandonTimeout)) {
          return false;
        }

        if (Number(abandonTimeout) < 0) {
          return false;
        }
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
    <Flex alignItems={"center"} gap={2}>
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
