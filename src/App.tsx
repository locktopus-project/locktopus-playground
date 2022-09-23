import * as React from "react";
import { Box, ChakraProvider, theme } from "@chakra-ui/react";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { store } from "./store";
import { Provider as ReduxProvider } from "react-redux";

export const App = () => (
  <ChakraProvider theme={theme}>
    <ReduxProvider store={store}>
      <Box>
        <Header />
        <Footer />
      </Box>
    </ReduxProvider>
  </ChakraProvider>
);
