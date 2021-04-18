import {useState} from "react";
import { useSession } from "@inrupt/solid-ui-react/dist";

import {
  Button,
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
import WorldFinder from "../components/worldFinder";
import { actionManager } from "../lib/ActionManager";

export default function Home(): React.ReactElement {
  const [ worldWebId, setWorldWebId ] = useState(null);
  const { session } = useSession();
  const { webId } = session.info;
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!session.info.isLoggedIn) {
    return <LoginForm />;
  }

  if(!worldWebId) {
    return <WorldFinder foundWebId={setWorldWebId} />
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
    <MudWorldProvider worldWebId={worldWebId}>
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
