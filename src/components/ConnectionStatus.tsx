import { Badge, Link, Text } from "@chakra-ui/react";
import useAxios from "axios-hooks";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

type ConnStatus = {
  colorScheme: string;
  text: string;
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
      if (!homeUrl) {
        return;
      }

      refetch({}).catch(() => {});
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [connStatus.text, refetch, homeUrl]);

  return (
    connStatus && (
      <Text>
        <Badge colorScheme={connStatus.colorScheme} variant="outline">
          <Link href={homeUrl} target={"_blank"}>
            {connStatus.text}
          </Link>
        </Badge>
      </Text>
    )
  );
};
