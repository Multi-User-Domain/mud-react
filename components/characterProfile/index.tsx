import {useState} from "react";

import {
    Container,
    Box,
    Drawer,
    DrawerBody,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Center, } from "@chakra-ui/react";
import { Thing } from "@inrupt/solid-client";
import { getThingName } from "../../lib/utils";
import ThingDepiction from "../thingDepiction";
import styles from "./characterProfile.module.css";

export default function CharacterProfile(
    {character, isOpen, onClose=null} : {character: Thing, isOpen: boolean, onClose: () => void}): React.ReactElement {

  if(character == null) return null;

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="full">
        <DrawerOverlay>
            <DrawerContent>
                <DrawerCloseButton />

                <DrawerBody>
                    <Container>
                        <Box w="100%" className={styles.profileImage}>
                            <Center>
                                <ThingDepiction thing={character} />
                            </Center>
                        </Box>
                        <Box w="100%" className={styles.profileName}>
                            <Center><h1>{getThingName(character)}</h1></Center>
                        </Box>
                        <hr/>
                    </Container>
                </DrawerBody>
            </DrawerContent>
        </DrawerOverlay>
    </Drawer>
  )
}
