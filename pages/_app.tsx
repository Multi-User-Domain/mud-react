import { SessionProvider } from "@inrupt/solid-ui-react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react"

const theme = extendTheme({
  components:  {
    Container: {
      baseStyle: {
        maxW: "100%"
      },
    },
  },
});

interface IApp {
  Component: React.ComponentType<any>;
  pageProps: any;
}

export default function App(props: IApp): React.ReactElement {
  const { Component, pageProps } = props;

  return (
    <ChakraProvider theme={theme}>
      <SessionProvider sessionId="mud-react">
        <Component {...pageProps} />
      </SessionProvider>
    </ChakraProvider>
  );
}
