import { useState } from 'react';
import useMudAccount from '../../../lib/hooks/useMudAccount';
import { Grid, GridItem, Box, Button, Input, Center, Text, useDisclosure } from "@chakra-ui/react"
import styles from "./characterTable.module.css";
import { MUD } from "../../../lib/MUD";
import { getThingName } from '../../../lib/utils';
import ThingDepiction from "../../thingDepiction";
import CharacterProfile from '../../characterProfile';
import { Thing } from '@inrupt/solid-client';

function CharacterRow({character, i, selectCharacter} : {character: Thing, i: number, selectCharacter: (number) => void}): React.ReactElement {  
  const onCharacterSelect = (event) => {
    selectCharacter(i);
  }
  
  return (
  <Grid templateColumns="repeat(5, 1fr)" w="100%" gap={1} className={styles.characterRow}>
    <GridItem w="100px" h="100px" colSpan={1} className={styles.profilePic}
        tag="a" onClick={onCharacterSelect} style={{ cursor: "pointer" }}>
      <ThingDepiction thing={character} />
    </GridItem>

    <GridItem w="100%" colSpan={2} className={styles.characterField} 
        tag="a" onClick={onCharacterSelect} style={{ cursor: "pointer" }}>
      <Center h="100%"><Text>{getThingName(character)}</Text></Center>
    </GridItem>
    
    <GridItem w="100%" colSpan={1} colEnd={6} bg="blue.500" className={styles.characterField}>
      <Center h="100%"><Text>Buttons</Text></Center>
    </GridItem>
  </Grid>);
}

export default function CharactersTable({edit} : {edit: boolean}) : React.ReactElement {

    const [ newCharName, setNewCharName] = useState("");
    const { characterDataSet, characters, addCharacter } = useMudAccount();
    const [ selectedCharacter, setSelectedCharacter ] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const onCharacterAdd = () => {
      addCharacter(newCharName);
    }

    const selectCharacter = (i: number): void => {
      if(characters == null || i < 0 || characters.length <= i) return;

      setSelectedCharacter(characters[i]);
      onOpen();
    }

    if (!characterDataSet || !characters) return <div>loading...</div>;

    //building Character Rows elements
    const characterRows = [];

    for(let i = 0; i < characters.length; i++) {
      characterRows.push(<CharacterRow character={characters[i]} i={i} key={i} selectCharacter={selectCharacter} />);
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
    {characterRows}
    {editContent}
    </>
    );
}
