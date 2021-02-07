import { useState } from 'react';
import { FOAF, VCARD } from "@inrupt/lit-generated-vocab-common";
import { getStringNoLocale, getUrl } from '@inrupt/solid-client';
import useMudAccount from '../../../lib/hooks/useMudAccount';
import { Grid, GridItem, Box, Button, Input, Center, Text } from "@chakra-ui/react"
import styles from "./characterTable.module.css";
import { MUD } from "../../../lib/MUD";

export default function CharactersTable({edit} : {edit: boolean}) : React.ReactElement {

    const [ newCharName, setNewCharName] = useState("");
    const { characterDataSet, characters, addCharacter } = useMudAccount();

    const onCharacterAdd = () => {
      addCharacter(newCharName);
    }

    if (!characterDataSet || !characters) return <div>loading...</div>;

    //building Character Rows elements
    const characterRows = [];
    for(let i = 0; i < characters.length; i++) {
      const imageUrl = getUrl(characters[i], FOAF.depiction);
      let image = null;
      if(imageUrl) image = <img src={imageUrl}></img>;
      //TODO: display default character profile image

      characterRows.push(
        <Grid templateColumns="repeat(5, 1fr)" w="100%" gap={1} key={i} className={styles.characterRow}>

          <GridItem w="100px" h="100px" colSpan={1} className={styles.profilePic}>
            {image}
          </GridItem>

          <GridItem w="100%" colSpan={2} className={styles.characterField}>
            <Center h="100%"><Text>{getStringNoLocale(characters[i], VCARD.fn)}</Text></Center>
          </GridItem>
          
          <GridItem w="100%" colSpan={1} colEnd={6} bg="blue.500" className={styles.characterField}>
            <Center h="100%"><Text>Buttons</Text></Center>
          </GridItem>
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
