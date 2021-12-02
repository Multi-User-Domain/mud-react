import {useState, useEffect} from "react";

import {
    Thing,
    getUrlAll,
    getThing,
    getUrl,
} from "@inrupt/solid-client";

import { Grid, GridItem, Text, useDisclosure } from "@chakra-ui/react";

import {
  Box,
  Heading,
  Container
} from "@chakra-ui/react";

import {
    Button
} from "@chakra-ui/react";

import { MUD, MUD_CHARACTER, getThingName } from "@multi-user-domain/mud-lib";
import useMudWorld from "../../../lib/hooks/useMudWorld";
import useMudAccount from "../../../lib/hooks/useMudAccount";

import useTerminalFeed from "../../../lib/hooks/useTerminalFeed";
import {ThingList, IRowComponent} from "../../thingList";
import {ThingListModal} from "../../modals/thingListModal";
import Character from "../../character";

function Building({thing, selectHandler} : IRowComponent): React.ReactElement {
    //row event -> open detail
    const onRowSelect = (event) => {
        selectHandler(thing);
    }

    return (
        <>
        <hr/>
        <Grid templateColumns="repeat(5, 1fr)" w="100%" gap={1} marginBottom={3} paddingTop={3}>
          <GridItem w="100%" colSpan={5} tag="a" onClick={onRowSelect} style={{ cursor: "pointer" }}>
            <Text>{getThingName(thing)}</Text>
          </GridItem>
        </Grid>
        </>);
}

export default function BuildingTable(
    {settlement, goBack} : {settlement: Thing, goBack: () => void}): React.ReactElement {

    const [ buildingThings, setBuildingThings ] = useState<Thing[]>(null);
    const [ selectedBuilding, setSelectedBuilding ] = useState<Thing>(null);
    const { settlementDataSet } = useMudWorld();
    const { characters, transitCharacter } = useMudAccount();
    const { describeScene } = useTerminalFeed();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const thingIsIdleFilter = (things: Thing[]): Thing[] => {
        let ret: Thing[] = [];

        //return all things which do **not** have a task set
        for(let thing of things) if (!getUrl(thing, MUD_CHARACTER.hasTask)) ret.push(thing);

        return ret;
    }

    /**
     * Handles the selection of a character in the modal, and schedules a Transit action for that character
     * @param thing the selected character
     */
    const selectCharacter = (thing: Thing) => {
        //close the modal
        onClose();

        //schedule the Transit task
        transitCharacter(thing, selectedBuilding);

        //log to Terminal feed the building description
        describeScene(characters.concat([selectedBuilding]));
    }

    /**
     * Handles the selection of a building from the list, and opens the modal to select a character to visit
     * @param thing the selected building
     */
    const selectBuilding = (thing: Thing) => {
        setSelectedBuilding(thing);
        onOpen();
    }

    //pull in the buildings from the parameterised settlement
    useEffect(() => {
        const buildingUrls = getUrlAll(settlement, MUD.hasBuilding);
        let buildingArr = [];

        buildingUrls.forEach((url) => buildingArr.push(getThing(settlementDataSet, url)));
        setBuildingThings(buildingArr);
    }, []);

    let tableContent = <h3>Loading...</h3>;

    if(buildingThings) {
        if(buildingThings.length > 0) {
            tableContent = (
            <>
                <Heading textAlign="center" marginBottom={4} >{getThingName(settlement)}</Heading>

                <ThingList things={buildingThings} rowComponent={Building} selectThing={selectBuilding} />
                <hr/>
            </>
            );
        }

        else tableContent = <h3>This Settlement is empty!</h3>;
    }

    const headerContent = <Text>Who is going here?</Text>;

    return (
    <>
        <Grid>
            <GridItem colSpan={1}>
                <Button onClick={goBack} maxW="60ch">
                    Go Back
                </Button>
            </GridItem>
            <GridItem colSpan={10}></GridItem>
        </Grid>
        <Box>
            {tableContent}
        </Box>
        <ThingListModal things={characters} filter={thingIsIdleFilter} isOpen={isOpen} headerContent={headerContent} rowComponent={Character} onClose={onClose} selectThing={selectCharacter}/>
    </>
    );
}