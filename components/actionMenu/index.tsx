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
    DrawerCloseButton, } from "@chakra-ui/react";

export default function ActionMenu({isOpen, onClose=null} : {isOpen: boolean, onClose: () => void}): React.ReactElement {
  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xl">
        <DrawerOverlay>
            <DrawerContent>
                <DrawerCloseButton />

                <DrawerBody>
                    <Tabs isFitted>
                        <TabList>
                        <Tab>Placeholder</Tab>
                        <Tab>Placeholder</Tab>
                        </TabList>
                    
                        <TabPanels>
                        <TabPanel>
                            <p>Placeholder</p>
                        </TabPanel>
                        <TabPanel>
                            <p>Placeholder</p>
                        </TabPanel>
                        </TabPanels>
                    </Tabs>
                </DrawerBody>
            </DrawerContent>
        </DrawerOverlay>
    </Drawer>
  )
}
