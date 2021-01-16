import { useSession } from "@inrupt/solid-ui-react/dist";
import { MudWorldProvider } from "../lib/context/mudWorldContext";
import { MudAccountProvider } from "../lib/context/mudAccountContext";
import LoginForm from "../components/loginForm";
import GameWindow from "../components/gameWindow";

export default function Home(): React.ReactElement {
  const { session } = useSession();
  const { webId } = session.info;

  if (!session.info.isLoggedIn) {
    return <LoginForm />;
  }

  return (
    //TODO: select the worldWebId from a WorldFinder component
    <MudWorldProvider worldWebId="http://localhost:8080/">
      <MudAccountProvider webId={webId}>
        <GameWindow />
      </MudAccountProvider>
    </MudWorldProvider>
    );
}
