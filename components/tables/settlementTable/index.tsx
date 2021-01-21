import {HTMLAttributes, useState} from "react";

import {
    Thing,
    SolidDataset
} from "@inrupt/solid-client";

import {
    Table,
    TableColumn,
} from "@inrupt/solid-ui-react";

import {
  Container,
  Box,
  Typography
} from "@material-ui/core";

import { RDF, VCARD, FOAF } from "@inrupt/lit-generated-vocab-common";
import { MUD } from "../../../lib/MUD";

import styles from "./settlementTable.module.css";
import useMudWorld from "../../../lib/hooks/useMudWorld";
import BuildingTable from "../buildingTable";

export default function SettlementTable(): React.ReactElement {
    const { settlementDataSet, settlements } = useMudWorld();
    const [ selectedSettlement, setSelectedSettlement ] = useState(null);

    //row event -> open detail
    const onRowSelect = (event) => {
        const selectedIndex = event.target.parentElement.rowIndex - 1;
        setSelectedSettlement(settlements[selectedIndex]);
    }

    const getRowProps = (row, rowThing: Thing, rowDataset: SolidDataset) : HTMLAttributes<HTMLTableRowElement> => {
        return {
            onClick: onRowSelect,
            className: `${styles.settlementRow}`
        };
    }

    const clearSettlementSelected = () => {
        setSelectedSettlement(null);
    }

    if (!settlementDataSet || !settlements) return <div>loading...</div>;

    if (selectedSettlement) {
        return (
            <BuildingTable settlement={selectedSettlement} goBack={clearSettlementSelected} />
        );
    }

    const settlementThings = settlements.map((thing) => ({
      dataset: settlementDataSet,
      thing: thing,
    }));

    console.log(VCARD.fn);

    return (
    <>
    <Typography gutterBottom variant="h6" component="h3">
                Settlements
    </Typography>
    <Table things={settlementThings} getRowProps={getRowProps}>
        <TableColumn property={VCARD.fn} header="Name" />
        <TableColumn property={MUD.population} header="Population" />
    </Table>
    </>
    );
}