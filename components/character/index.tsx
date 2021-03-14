import { Grid, GridItem, Center, Text } from "@chakra-ui/react";
import { getThingName } from '../../lib/utils';
import ThingDepiction from "../thingDepiction";
import { getUrl } from '@inrupt/solid-client';
import { IRowComponent } from "../thingList";
import { MUD_CHARACTER } from "../../lib/MUD";
import styles from "./character.module.css";

export default function Character({thing, selectHandler} : IRowComponent): React.ReactElement {  
  const onCharacterSelect = (event) => {
    selectHandler(thing);
  }

  const task = getUrl(thing, MUD_CHARACTER.hasTask);
  const taskComponent = task ? <Text color="#e34e1b" fontWeight="bold">BUSY</Text> : <Text color="#77a513" fontWeight="bold">IDLE</Text>;
  
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
    
    <GridItem w="100%" colSpan={1} colEnd={6} className={styles.characterField}>
      <Center h="100%">{taskComponent}</Center>
    </GridItem>
  </Grid>);
  }