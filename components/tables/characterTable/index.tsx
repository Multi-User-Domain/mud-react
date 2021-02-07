import { useState } from 'react';
import { VCARD } from "@inrupt/lit-generated-vocab-common";
import { getStringNoLocale } from '@inrupt/solid-client';
import useMudAccount from '../../../lib/hooks/useMudAccount';
import { Grid, GridItem, Box, Button, Input } from "@chakra-ui/react"
import styles from "./characterTable.module.css";
import { MUD } from "../../../lib/MUD";

export default function CharactersTable({edit} : {edit: boolean}) : React.ReactElement {

    const [ newCharName, setNewCharName] = useState("");
    const { characterDataSet, characters, addCharacter } = useMudAccount();

    const onCharacterAdd = () => {
      addCharacter(newCharName);
    }

    if (!characterDataSet || !characters) return <div>loading...</div>;

    const characterThings = characters.map((thing) => ({
      dataset: characterDataSet,
      thing: thing,
    }));

    const characterRows = [];
    for(let i = 0; i < characters.length; i++) {
      characterRows.push(
        <Grid templateColumns="repeat(5, 1fr)" gap={1} key={i} className={styles.characterRow}>
          <GridItem w="100%" colSpan={1} bg="blue.500" className={styles.characterField}>Picture</GridItem>
          <GridItem w="100%" colSpan={2} bg="blue.500" className={styles.characterField}>{getStringNoLocale(characters[i], VCARD.fn)}</GridItem>
          <GridItem w="100%" colSpan={1} bg="blue.500" className={styles.characterField}>Buttons</GridItem>
        </Grid>
      );
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
    {characterRows}
    {editContent}
    </>
    );
}
