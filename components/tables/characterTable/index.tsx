import { useState } from 'react';
import useMudAccount from '../../../lib/hooks/useMudAccount';
import useMudAction from "../../../lib/hooks/useMudAction";
import useMudScene from "../../../lib/hooks/useMudScene";
import { Box, Button, Input, useDisclosure } from "@chakra-ui/react"
import styles from "./characterTable.module.css";
import Character from "../../character";
import ActionRow from "../../actionRow";

import { MUD, MUD_CHARACTER } from "../../../lib/MUD";
import {ThingListModal} from "../../modals/thingListModal";
import {ThingList} from "../../thingList";
import {
  Thing,
  getUrl,
  SolidDataset
} from "@inrupt/solid-client";

export default function CharactersTable({edit} : {edit: boolean}) : React.ReactElement {

    const [ newCharName, setNewCharName] = useState("");
    const { characters, addCharacter } = useMudAccount();
    const { discoverActions } = useMudAction();
    const { buildScene } = useMudScene();
    const [ scene, setScene ] = useState<SolidDataset>(null);
    const [ actions, setActions ] = useState<Thing[]>([]);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const onCharacterAdd = () => {
      addCharacter(newCharName);
    }

    const selectCharacter = (character: Thing): void => {
      if(character == null || getUrl(character, MUD_CHARACTER.hasTask)) return;

      // Construct a scene (an array of Things)
      buildScene([character], true).then((builtScene) => {

        setScene(builtScene);

        // Discover actions associated to the scene
        discoverActions(builtScene).then((actions) => {

          // Open the modal to select the desired action
          setActions(actions);
          onOpen();
        });
      });
    }

    // a scene has been built and an action discovered and selected, time to put it into action!
    const selectAction = (action: Thing) : void => {
      //TODO
      console.log("selected action!");
      console.log(action);
    }

    let editContent = null
    if (edit) editContent = (
        <>
        <h3>Add New Character</h3>
        <Box className={styles.newCharacterFields}>
          <Input
            label="Name"
            value={newCharName}
            onChange={(e) => setNewCharName(e.target.value)}
          />
          <Button color="primary" onClick={onCharacterAdd}>
            Add
          </Button>
        </Box>
      </>
    )
    
    return (
    <>
    <ThingListModal things={actions} isOpen={isOpen} rowComponent={ActionRow} onClose={onClose} selectThing={selectAction}/>
    <ThingList things={characters} rowComponent={Character} selectThing={selectCharacter} />
    {editContent}
    </>
    );
}
