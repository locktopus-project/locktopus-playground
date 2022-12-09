import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { store } from "./store";
import { Provider as ReduxProvider } from "react-redux";
import { Body } from "./components/Body";
import { theme } from "./theme/theme";

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <ReduxProvider store={store}>
        <Header />
        <Body />
        <Footer />
      </ReduxProvider>
    </ChakraProvider>
  );
};
