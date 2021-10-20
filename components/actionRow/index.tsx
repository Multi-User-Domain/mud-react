import { Grid, GridItem, Center, Text, Circle } from "@chakra-ui/react";
import { getThingName } from '../../lib/utils';
import { getUrl, getStringNoLocale } from '@inrupt/solid-client';
import { IRowComponent } from "../thingList";
import { MUD_LOGIC } from "../../lib/MUD";

/**
 * component is responsible for displaying a mudlogic:Action in a row
*/

export default function ActionRow({thing, selectHandler} : IRowComponent): React.ReactElement {  
  const onRowSelect = (event) => {
    selectHandler(thing);
  }
  
  return (
  <Grid templateColumns="repeat(6, 1fr)" w="80%" margin="auto" marginBottom={10} gap={1}>
    <GridItem w="100px" h="100px" colSpan={2} verticalAlign="middle" paddingTop={10} paddingBottom={10}
        tag="a" onClick={onRowSelect} style={{ cursor: "pointer" }}>
      <Center h="100%"><Circle bg="tomato" w={5} h={5}></Circle></Center>;
    </GridItem>

    <GridItem colSpan={2} verticalAlign="middle" paddingTop={10} paddingBottom={10}
        tag="a" onClick={onRowSelect} style={{ cursor: "pointer" }}>
      <Center h="100%"><Text>{getThingName(thing)}</Text></Center>
    </GridItem>

    <GridItem colSpan={2} verticalAlign="middle" paddingTop={10} paddingBottom={10}
        tag="a" onClick={onRowSelect} style={{ cursor: "pointer" }}>
      <Center h="100%"><Text>{getStringNoLocale(thing, MUD_LOGIC.actAt)}</Text></Center>
    </GridItem>
  </Grid>);
  }