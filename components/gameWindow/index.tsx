import {useState} from "react";

import {
    Box,
    Button,
    Container,
    BottomNavigation,
    BottomNavigationAction
} from "@material-ui/core";

import {
  LogoutButton,
} from "@inrupt/solid-ui-react";

import CharacterView from "../characterView";
import WorldView from "../worldView";
import styles from "./gameWindow.module.css";

export default function GameWindow(): React.ReactElement {
  const [activeView, setActiveView] = useState("world");
  const [view, setView] = useState(<WorldView />);
  
  const viewChanged = (event, newValue) => {
    switch(newValue) {
        case "world":
            setView(<WorldView />);
            break;
        case "characters":
            setView(<CharacterView />);
            break;
    }

    setActiveView(newValue);
  }

  return (
      <Container fixed>
          <Box style={{ marginBottom: 16, textAlign: "right" }}>
            <LogoutButton>
            <Button variant="contained" color="primary">
                Log&nbsp;out
            </Button>
            </LogoutButton>
          </Box>
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
