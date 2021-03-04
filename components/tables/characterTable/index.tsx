import { useState } from 'react';
import useMudAccount from '../../../lib/hooks/useMudAccount';
import { Box, Button, Input, useDisclosure } from "@chakra-ui/react"
import styles from "./characterTable.module.css";
import Character from "../../character";
import CharacterProfile from '../../characterProfile';
import {ThingList} from "../../thingList";
import { Thing } from '@inrupt/solid-client';

export default function CharactersTable({edit} : {edit: boolean}) : React.ReactElement {

    const [ newCharName, setNewCharName] = useState("");
    const { characters, addCharacter } = useMudAccount();
    const [ selectedCharacter, setSelectedCharacter ] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const onCharacterAdd = () => {
      addCharacter(newCharName);
    }

    const selectCharacter = (character: Thing): void => {
      if(character == null) return;

      setSelectedCharacter(character);
      onOpen();
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
    <CharacterProfile character={selectedCharacter} isOpen={isOpen} onClose={onClose} />
    <ThingList things={characters} rowComponent={Character} selectThing={selectCharacter} />
    {editContent}
    </>
    );
}
