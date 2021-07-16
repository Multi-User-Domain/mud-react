import {useState} from "react";
import { useSession } from "@inrupt/solid-ui-react/dist";

import {
  Flex,
  Box,
  Button,
  Container,
  useDisclosure
} from "@chakra-ui/react";

import {
  LogoutButton,
} from "@inrupt/solid-ui-react";

import { MudFederationProvider } from "../lib/context/mudFederationContext";
import { MudContentProvider } from "../lib/context/mudContentContext";
import { MudActionProvider } from "../lib/context/mudActionContext";
import { MudWorldProvider } from "../lib/context/mudWorldContext";
import { MudAccountProvider } from "../lib/context/mudAccountContext";
import { TerminalFeedProvider } from "../lib/context/terminalFeedContext";
import LoginForm from "../components/loginForm";
import ActionMenu from "../components/actionMenu";
import Terminal from "../components/terminal";
import GameWindow from "../components/gameWindow";
import WorldFinder from "../components/worldFinder";

export default function Home(): React.ReactElement {
  const [ worldConnection, setWorldConnection ] = useState(null);
  const { session } = useSession();
  const { webId } = session.info;
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!session.info.isLoggedIn) {
    return <LoginForm />;
  }

  const header = (
    <Container marginBottom={4} textAlign="left">
      <Flex>
        <Box alignSelf="flex-start">
          <Button colorScheme="teal" onClick={onOpen}>Open Action Menu</Button>
          <ActionMenu isOpen={isOpen} onClose={onClose} />
        </Box>

        <Box w="100vw"></Box>

        <Box alignSelf="flex-end">
          <LogoutButton>
            <Button variant="contained">
                Log&nbsp;out
            </Button>
          </LogoutButton>
        </Box>
      </Flex>
    </Container>
  );

  let inner = null;

  if(!worldConnection) inner = <WorldFinder foundWebId={setWorldConnection} />;
  // display the full MUD game UI when the initial world connection has been made
  else {
    inner = (
      <MudWorldProvider>
        <MudContentProvider>
          <MudActionProvider>
            <MudAccountProvider webId={webId}>
              <TerminalFeedProvider>
                <Container>
                  {header}
                  <Container marginBottom={5}>
                    <GameWindow />
                  </Container>
                  <Container>
                    <Terminal />
                  </Container>
                </Container>
              </TerminalFeedProvider>
            </MudAccountProvider>
          </MudActionProvider>
        </MudContentProvider>
      </MudWorldProvider>
    );
  }

  return <MudFederationProvider>
    {inner}
  </MudFederationProvider>;
}
