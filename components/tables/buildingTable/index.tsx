import {HTMLAttributes, useState, useEffect} from "react";

import {
    Thing,
    SolidDataset,
    getUrlAll,
    getThing,
} from "@inrupt/solid-client";

import {
    Table,
    TableColumn,
    CombinedDataProvider,
    Text
} from "@inrupt/solid-ui-react";

import {
  Box,
  Typography
} from "@material-ui/core";

import {
    Button
} from "@chakra-ui/react";

import { VCARD } from "@inrupt/lit-generated-vocab-common";
import { MUD } from "../../../lib/MUD";
import useMudWorld from "../../../lib/hooks/useMudWorld";

import styles from "./buildingTable.module.css";
import useTerminalFeed from "../../../lib/hooks/useTerminalFeed";
import { getThingName } from "../../../lib/utils";

export default function BuildingTable(
    {settlement, goBack} : {settlement: Thing, goBack: () => void}): React.ReactElement {

    const [ buildingThings, setBuildingThings ] = useState(null);
    const { settlementDataSet } = useMudWorld();
    const { describeThing } = useTerminalFeed();

    const onRowSelect = (event) => {
        //log to Terminal feed the building description
        const selectedIndex = event.target.parentElement.rowIndex - 1;
        describeThing(buildingThings[selectedIndex].thing);
    }

    const getRowProps = (row, rowThing: Thing, rowDataset: SolidDataset) : HTMLAttributes<HTMLTableRowElement> => {
        return {
            onClick: onRowSelect,
            className: `${styles.buildingRow}`
        };
    }

    //pull in the buildings from the parameterised settlement
    useEffect(() => {
        const buildingUrls = getUrlAll(settlement, MUD.hasBuilding);
        let buildingArr = [];
        buildingUrls.forEach((url) => {
            buildingArr.push({
                dataset: settlementDataSet,
                thing: getThing(settlementDataSet, url)
            });
        });
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
                <Table things={buildingThings} getRowProps={getRowProps}>
                    <TableColumn property={VCARD.fn} header="Name" />
                    <TableColumn property={MUD.owner} header="Owner" dataType="url" body={({ value }) => (
                        <CombinedDataProvider datasetUrl={value} thingUrl={value}>
                            <Text property={VCARD.fn.value} />
                        </CombinedDataProvider>
                    )} />
                </Table>
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