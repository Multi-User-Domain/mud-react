import { Grid, GridItem, Center, Text } from "@chakra-ui/react";
import { getThingName } from '../../lib/utils';
import ThingDepiction from "../thingDepiction";
import { Thing } from '@inrupt/solid-client';
import { IRowComponent } from "../thingList";
import styles from "./character.module.css";

export default function Character({thing, selectHandler} : IRowComponent): React.ReactElement {  
  const onCharacterSelect = (event) => {
    selectHandler(thing);
  }
  
  return (
  <Grid templateColumns="repeat(5, 1fr)" w="100%" gap={1} className={styles.characterRow}>
    <GridItem w="100px" h="100px" colSpan={1} className={styles.profilePic}
        tag="a" onClick={onCharacterSelect} style={{ cursor: "pointer" }}>
      <ThingDepiction thing={thing} />
    </GridItem>

    <GridItem w="100%" colSpan={2} className={styles.characterField} 
        tag="a" onClick={onCharacterSelect} style={{ cursor: "pointer" }}>
      <Center h="100%"><Text>{getThingName(thing)}</Text></Center>
    </GridItem>
    
    <GridItem w="100%" colSpan={1} colEnd={6} bg="blue.500" className={styles.characterField}>
      <Center h="100%"><Text>Buttons</Text></Center>
    </GridItem>
  </Grid>);
  }