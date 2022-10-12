import { extendTheme } from "@chakra-ui/react";
import { colors } from "./colors";
import { theme as defaultTheme } from "@chakra-ui/theme";

const theme = extendTheme({
  config: {
    initialColorMode: "system",
    useSystemColorMode: false,
  },
  colors: { ...defaultTheme.colors, ...colors },
});

export { theme };
