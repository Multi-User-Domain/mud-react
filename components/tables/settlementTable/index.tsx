import {useState} from "react";

import {
    getStringNoLocale,
    Thing
} from "@inrupt/solid-client";

import { Grid, GridItem, Center, Text, Heading } from "@chakra-ui/react";
import { MUD } from "../../../lib/MUD";

import useMudWorld from "../../../lib/hooks/useMudWorld";
import BuildingTable from "../buildingTable";
import {getThingName} from "../../../lib/utils";
import {ThingList, IRowComponent} from "../../thingList";

function Settlement({thing, selectHandler} : IRowComponent): React.ReactElement {
    //row event -> open detail
    const onRowSelect = (event) => {
        selectHandler(thing);
    }

    return (
        <>
        <hr/>
        <Grid templateColumns="repeat(5, 1fr)" w="100%" gap={1} marginBottom={3} paddingTop={3}>
          <GridItem w="100%" colSpan={3} tag="a" onClick={onRowSelect} style={{ cursor: "pointer" }}>
            <Center h="100%"><Text>{getThingName(thing)}</Text></Center>
          </GridItem>
          
          <GridItem w="100%" colSpan={1} tag="a" onClick={onRowSelect} style={{ cursor: "pointer" }}>
            <Center h="100%"><Text>{getStringNoLocale(thing, MUD.population)}</Text></Center>
          </GridItem>
        </Grid>
        </>
    );
}

export default function SettlementTable(): React.ReactElement {
    const { settlements } = useMudWorld();
    const [ selectedSettlement, setSelectedSettlement ] = useState(null);


    const clearSettlementSelected = () => {
        setSelectedSettlement(null);
    }

    if (!settlements) return <div>loading...</div>;

    if (selectedSettlement) {
        return <BuildingTable settlement={selectedSettlement} goBack={clearSettlementSelected} />;
    }

    return  (
        <>
        <Heading textAlign="center" marginBottom={4}>Settlements</Heading>
        <ThingList things={settlements} rowComponent={Settlement} selectThing={(thing: Thing) => {setSelectedSettlement(thing);}} />
        <hr/>
        </>
    );
}