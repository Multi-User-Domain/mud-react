import {useState, useEffect} from "react";

import {
    Thing,
    getUrlAll,
    getThing,
} from "@inrupt/solid-client";

import { Grid, GridItem, Center, Text } from "@chakra-ui/react";

import {
  Box,
  Typography
} from "@material-ui/core";

import {
    Button
} from "@chakra-ui/react";

import { MUD } from "../../../lib/MUD";
import useMudWorld from "../../../lib/hooks/useMudWorld";

import useTerminalFeed from "../../../lib/hooks/useTerminalFeed";
import { getThingName } from "../../../lib/utils";
import {ThingList, IRowComponent} from "../../thingList";

function Building({thing, selectHandler} : IRowComponent): React.ReactElement {
    //row event -> open detail
    const onRowSelect = (event) => {
        selectHandler(thing);
    }

    return (
        <>
        <hr/>
        <Grid templateColumns="repeat(5, 1fr)" w="100%" gap={1} marginBottom="10px" paddingTop="10px">
          <GridItem w="100%" colSpan={5} tag="a" onClick={onRowSelect} style={{ cursor: "pointer" }}>
            <Text>{getThingName(thing)}</Text>
          </GridItem>
        </Grid>
        </>);
}

export default function BuildingTable(
    {settlement, goBack} : {settlement: Thing, goBack: () => void}): React.ReactElement {

    const [ buildingThings, setBuildingThings ] = useState(null);
    const { settlementDataSet } = useMudWorld();
    const { describeThing } = useTerminalFeed();

    const selectHandler = (thing: Thing) => {
        //log to Terminal feed the building description
        describeThing(thing);
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
                <Typography gutterBottom variant="h6" component="h3">
                    {getThingName(settlement)}
                </Typography>
                <ThingList things={buildingThings} rowComponent={Building} selectThing={selectHandler} />
                <hr/>
            </>
            );
        }

        else tableContent = <h3>This Settlement is empty!</h3>;
    }

    return (
    <>
        <Box>
            <Button onClick={goBack}>
                Go Back
            </Button>
        </Box>
        <Box>
            {tableContent}
        </Box>
    </>
    );
}