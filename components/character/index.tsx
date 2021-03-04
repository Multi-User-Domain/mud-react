import { Grid, GridItem, Center, Text } from "@chakra-ui/react";
import { getThingName } from '../../lib/utils';
import ThingDepiction from "../thingDepiction";
import { Thing } from '@inrupt/solid-client';
import styles from "./character.module.css";

export default function Character({character, selectHandler} : {character: Thing, selectHandler: (Thing) => void}): React.ReactElement {  
  const onCharacterSelect = (event) => {
    selectHandler(character);
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