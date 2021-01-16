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
import useMudWorld from '../../../lib/hooks/useMudWorld';

export default function SettlementTable(): React.ReactElement {
    const { settlementDataSet, settlements } = useMudWorld();

    if (!settlementDataSet || !settlements) return <div>loading...</div>;

    const settlementThings = settlements.map((thing) => ({
      dataset: settlementDataSet,
      thing: thing,
    }));

    return (
    <>
    <Typography gutterBottom variant="h6" component="h3">
                Settlements
    </Typography>
    <Table things={settlementThings}>
        <TableColumn property={VCARD.fn} header="Name" />
        <TableColumn property={MUD.populationPredicate} header="Population" />
    </Table>
    </>
    );
}