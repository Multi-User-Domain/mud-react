import { useState } from 'react';
import { VCARD } from "@inrupt/lit-generated-vocab-common";
import {
    CombinedDataProvider,
    Text,
    Table,
    TableColumn,
} from "@inrupt/solid-ui-react";
import useMudAccount from '../../../lib/hooks/useMudAccount';
import { Grid, GridItem, Box, Button, Input } from "@chakra-ui/react"
import styles from "./characterTable.module.css";
import { MUD } from "../../../lib/MUD";

export default function CharactersTable({edit} : {edit: boolean}) : React.ReactElement {

    const [ newCharName, setNewCharName] = useState("");
    const { characterDataSet, characters, addCharacter } = useMudAccount();

    const onCharacterAdd = () => {
      addCharacter(newCharName);
    }

    if (!characterDataSet || !characters) return <div>loading...</div>;

    const characterThings = characters.map((thing) => ({
      dataset: characterDataSet,
      thing: thing,
    }));

    let editContent = null
    if (edit) editContent = (
        <>
        <h3>Add New Character</h3>
        <Box className={styles.newCharacterFields}>
          <Input
            label="Name"
            value={newCharName}
            onChange={(e) => setNewCharName(e.target.value)}
          />
          <Button color="primary" onClick={onCharacterAdd}>
            Add
          </Button>
        </Box>
      </>
    )
    
    return (
    <>
    <Table things={characterThings}>
        <TableColumn property={MUD.owner} header="Owner" dataType="url" body={({ value }) => (
            <CombinedDataProvider datasetUrl={value} thingUrl={value}>
                <Text property={VCARD.fn.value} />
            </CombinedDataProvider>
          )} />
        <TableColumn property={VCARD.fn} header="Name" />
    </Table>
    {editContent}
    </>
    );
}
