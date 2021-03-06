import { useSession } from "@inrupt/solid-ui-react/dist";

import {
  Button,
  Box,
  Container,
  useDisclosure
} from "@chakra-ui/react";

import {
  LogoutButton,
} from "@inrupt/solid-ui-react";

import { perceptionManager } from "../lib/PerceptionManager";
import { MudWorldProvider } from "../lib/context/mudWorldContext";
import { MudAccountProvider } from "../lib/context/mudAccountContext";
import { TerminalFeedProvider } from "../lib/context/terminalFeedContext";
import LoginForm from "../components/loginForm";
import ActionMenu from "../components/actionMenu";
import Terminal from "../components/terminal";
import GameWindow from "../components/gameWindow";
import { actionManager } from "../lib/ActionManager";

export default function Home(): React.ReactElement {
  const { session } = useSession();
  const { webId } = session.info;
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!session.info.isLoggedIn) {
    return <LoginForm />;
  }

  const header = (
    <Container style={{ marginBottom: 16, textAlign: "left" }}>
      <Button colorScheme="teal" onClick={onOpen}>Open Action Menu</Button>
      <ActionMenu isOpen={isOpen} onClose={onClose} />

      <div style={{float: "right", textAlign: "right"}}>
        <LogoutButton>
          <Button variant="contained">
              Log&nbsp;out
          </Button>
        </LogoutButton>
      </div>
    </Container>
  );

  return (
    //TODO: select the worldWebId from a WorldFinder component
    <MudWorldProvider worldWebId="http://localhost:8080/">
      <MudAccountProvider webId={webId} actionManager={actionManager}>
        <TerminalFeedProvider perceptionManager={perceptionManager}>
          {header}
          <Container style={{marginBottom: "20px"}}>
            <GameWindow />
          </Container>
          <Container>
            <Terminal />
          </Container>
        </TerminalFeedProvider>
      </MudAccountProvider>
    </MudWorldProvider>
    );
}
