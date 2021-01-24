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

import { MudWorldProvider } from "../lib/context/mudWorldContext";
import { MudAccountProvider } from "../lib/context/mudAccountContext";
import LoginForm from "../components/loginForm";
import ActionMenu from "../components/actionMenu";

export default function Home(): React.ReactElement {
  const { session } = useSession();
  const { webId } = session.info;
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!session.info.isLoggedIn) {
    return <LoginForm />;
  }

  return (
    //TODO: select the worldWebId from a WorldFinder component
    <MudWorldProvider worldWebId="http://localhost:8080/">
      <MudAccountProvider webId={webId}>
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
      </MudAccountProvider>
    </MudWorldProvider>
    );
}
