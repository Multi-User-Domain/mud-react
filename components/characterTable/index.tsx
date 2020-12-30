import React from 'react';
import { VCARD } from "@inrupt/lit-generated-vocab-common";
import {
    getThingAll,
  } from "@inrupt/solid-client";
  import {
    CombinedDataProvider,
    Text,
    Table,
    TableColumn,
    useDataset,
  } from "@inrupt/solid-ui-react";

// TODO: this is better defined in a LIT
const ownerPredicate: string = 'https://calum.inrupt.net/public/voc/mudchar.ttl#ownedBy';
const namePredicate: string = 'https://calum.inrupt.net/public/voc/mudchar.ttl#name';

export default function CharactersTable() : React.ReactElement {

    const { dataset, error } = useDataset();

    const getCharacters = () => {
        let ret = [];
        getThingAll(dataset).forEach((thing) => {
            ret.push({
                dataset: dataset,
                thing: thing
            });
        });
        return ret
    };

    if (error) return <div>failed to load</div>;
    if (!dataset) return <div>loading...</div>;
    let characters = getCharacters();
    
    return (
    <Table things={characters}>
        <TableColumn property={ownerPredicate} header="Owner" dataType="url" body={({ value }) => (
            <CombinedDataProvider datasetUrl={value} thingUrl={value}>
                <Text property={VCARD.fn.value} />
            </CombinedDataProvider>
          )} />
        <TableColumn property={namePredicate} header="Name" />
    </Table>
    );
}
