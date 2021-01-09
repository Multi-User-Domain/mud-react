import {useState} from "react";

import {
    Box,
    Container,
    BottomNavigation,
    BottomNavigationAction
} from "@material-ui/core";

import CharactersView from "../charactersView";
import WorldView from "../worldView";
import styles from "./gameWindow.module.css";

export default function GameWindow(): React.ReactElement {
  const [activeView, setActiveView] = useState("world");
  const [view, setView] = useState(null);
  
  const viewChanged = (event, newValue) => {
    switch(newValue) {
        case "world":
            setView(<WorldView />);
            break;
        case "characters":
            setView(<CharactersView />);
            break;
    }

    setActiveView(newValue);
  }

  return (
      <Container fixed>
          <Box className={styles.view}>
            {view}
          </Box>
          <Box>
            <BottomNavigation
                value={activeView}
                onChange={viewChanged}
                showLabels
                >
                <BottomNavigationAction label="World" value="world" />
                <BottomNavigationAction label="Characters" value="characters"/>
            </BottomNavigation>
          </Box>
      </Container>
  );
}
