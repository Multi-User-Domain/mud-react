import {useState} from "react";

import { 
    Tabs,
    TabList, 
    TabPanels, 
    Tab, 
    TabPanel, 
    Drawer,
    DrawerBody,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton, } from "@chakra-ui/react"

import CharacterView from "../characterView";
import WorldView from "../worldView";

export default function ActionMenu({isOpen, onClose=null} : {isOpen: boolean, onClose: () => void}): React.ReactElement {
  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xl">
        <DrawerOverlay>
            <DrawerContent>
                <DrawerCloseButton />

                <DrawerBody>
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
                </DrawerBody>
            </DrawerContent>
        </DrawerOverlay>
    </Drawer>
  )
}
