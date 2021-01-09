import {useState} from "react";

import {
    Box,
    Container
} from "@material-ui/core";

import CharactersView from "../charactersView";
import styles from "./gameWindow.module.css";

export default function GameWindow(): React.ReactElement {
  const [activeView, setActiveView] = useState("characters");

  let view = <CharactersView />
  
  //TODO: switch in the selected activeView

  return (
      <Container fixed>
          <Box className={styles.view}>
            {view}
          </Box>
          <Box>
              <h2>TODO: view selector menu</h2>
          </Box>
      </Container>
  );
}
