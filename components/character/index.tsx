import { Grid, GridItem, Center, Text, Button, useDisclosure } from "@chakra-ui/react";
import { getThingName } from '../../lib/utils';
import ThingDepiction from "../thingDepiction";
import { getUrl } from '@inrupt/solid-client';
import { IRowComponent } from "../thingList";
import CharacterProfile from '../characterProfile';
import TimerProgressBar from "../timerProgressBar";
import { MUD_CHARACTER } from "../../lib/MUD";
import styles from "./character.module.css";

export default function Character({thing, selectHandler} : IRowComponent): React.ReactElement {  
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const onCharacterSelect = (event) => {
    selectHandler(thing);
  }

  const task = getUrl(thing, MUD_CHARACTER.hasTask);
  let taskComponent = <Text color="#77a513" fontWeight="bold">IDLE</Text>;
  if(task) {
    //TODO: get the start time and end time from the character
    const startTime: number = new Date().getTime()
    const endTime: number = startTime + 60000;

    taskComponent = (
      <TimerProgressBar startTime={startTime} endTime={endTime} />
    )
  }
  
  return (
  <Grid templateColumns="repeat(7, 1fr)" w="80%" margin="auto" gap={1} className={styles.characterRow}>
    <GridItem w="100px" h="100px" colSpan={2} className={styles.profilePic}
        tag="a" onClick={onCharacterSelect} style={{ cursor: "pointer" }}>
      <ThingDepiction thing={thing} />
    </GridItem>

    <GridItem colSpan={2} className={styles.characterField} 
        tag="a" onClick={onCharacterSelect} style={{ cursor: "pointer" }}>
      <Center h="100%"><Text>{getThingName(thing)}</Text></Center>
    </GridItem>
    
    <GridItem colSpan={2} className={styles.characterField}>
      <Center h="100%">{taskComponent}</Center>
    </GridItem>

    <GridItem colSpan={1} className={styles.characterField}>
      <CharacterProfile character={thing} isOpen={isOpen} onClose={onClose} />
      <Center><Button onClick={onOpen}>Profile</Button></Center>
    </GridItem>
  </Grid>);
  }