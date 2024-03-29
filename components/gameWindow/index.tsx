import { 
    Tabs,
    TabList, 
    TabPanels, 
    Tab, 
    TabPanel} from "@chakra-ui/react";

import CharacterView from "../characterView";
import WorldView from "../worldView";

export default function GameWindow(): React.ReactElement {

    // we duplicate it to display content differently visually and when accessing via screen reader
    return (
        <Tabs isFitted>
            <TabList>
            <Tab>Settlements</Tab>
            <Tab>Characters</Tab>
            </TabList>
        
            <TabPanels>
            <TabPanel>
                <WorldView />
            </TabPanel>
            <TabPanel>
                <CharacterView />
            </TabPanel>
            </TabPanels>
        </Tabs>
    )
}
