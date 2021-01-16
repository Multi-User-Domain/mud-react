import {
    Table,
    TableColumn,
} from "@inrupt/solid-ui-react";

import {
  Container,
  Box
} from "@material-ui/core";

import { RDF, VCARD, FOAF } from "@inrupt/lit-generated-vocab-common";
import { MUD } from "../../lib/MUD";

import useMudWorld from '../../lib/hooks/useMudWorld';

export default function WorldView(): React.ReactElement {
    const { settlementDataSet, settlements } = useMudWorld();

    if (!settlementDataSet || !settlements) return <div>loading...</div>;

    const settlementThings = settlements.map((thing) => ({
      dataset: settlementDataSet,
      thing: thing,
    }));

    // TODO: write a generic table component for Characters & Settlements to share
    return (
        <Container fixed>
            <Box>
                <Table things={settlementThings}>
                    <TableColumn property={VCARD.fn} header="Name" />
                </Table>
            </Box>
        </Container>
    );
}
