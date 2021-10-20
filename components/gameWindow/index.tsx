import React from "react";

import { 
    Tabs,
    TabList, 
    TabPanels, 
    Tab, 
    TabPanel} from "@chakra-ui/react";

import CharacterView from "../characterView";

export default function GameWindow(): React.ReactElement {

    return (
        <Tabs isFitted>
            <TabList>
            <Tab>Characters</Tab>
            </TabList>
        
            <TabPanels>
            <TabPanel>
                <CharacterView />
            </TabPanel>
            </TabPanels>
        </Tabs>
    )
}
