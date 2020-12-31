import { useState, useContext } from 'react';
import { VCARD, RDF } from "@inrupt/lit-generated-vocab-common";
import {
    getThingAll,
    saveSolidDatasetAt,
    getFetchedFrom,
    setThing,
    createThing,
    setUrl,
    setStringUnlocalized
} from "@inrupt/solid-client";
import {
    CombinedDataProvider,
    DatasetContext,
    Text,
    Table,
    TableColumn,
    useSession
} from "@inrupt/solid-ui-react";
import {
    Box,
    Button,
    MenuItem,
    TextField,
    Typography,
} from "@material-ui/core";
import styles from "./characterTable.module.css";

// TODO: this is better defined in a LIT
const characterRDFType: string = 'https://calum.inrupt.net/public/voc/mudchar.ttl#Character';
const ownerPredicate: string = 'https://calum.inrupt.net/public/voc/mudchar.ttl#ownedBy';
const namePredicate: string = 'https://calum.inrupt.net/public/voc/mudchar.ttl#name';

export default function CharactersTable({edit} : {edit: boolean}) : React.ReactElement {

    const { dataset, setDataset } = useContext(DatasetContext);
    const [ newCharName, setNewCharName] = useState("");
    const { session, fetch } = useSession();
    const { webId } = session.info;

    const saveHandler = async (newThing, datasetToUpdate) => {
        const savedDataset = await saveSolidDatasetAt(
          getFetchedFrom(datasetToUpdate),
          setThing(datasetToUpdate, newThing),
          { fetch }
        );
        setDataset(savedDataset);
      };

    const addCharacter = async () => {
        //TODO: create the collection and save to the user's profile, if need be

        // creates a new character Thing, sets properties to it
        let newCharacter = setUrl(createThing(), RDF.type, characterRDFType);
        newCharacter = setUrl(newCharacter, ownerPredicate, webId);
        newCharacter = setStringUnlocalized(newCharacter, namePredicate, newCharName);
        const dataSetWithCharacter = setThing(
            dataset,
            newCharacter
        );
        await saveHandler(newCharacter, dataSetWithCharacter);
    };

    /**
     * @returns All Things from a given dataset if they are of type mudchar:Character
     */
    const getCharacters = () => {
        let ret = [];
        getThingAll(dataset).forEach((thing) => {
            //TODO: filter out Things which are not characters
            ret.push({
                dataset: dataset,
                thing: thing
            });
        });
        return ret
    };

    if (!dataset) return <div>loading...</div>;
    let characters = getCharacters();

    let editContent = null
    if (edit) editContent = (
        <>
        <Typography gutterBottom>Add New Character</Typography>
        <Box className={styles.newCharacterFields}>
          <TextField
            label="Name"
            value={newCharName}
            onChange={(e) => setNewCharName(e.target.value)}
          />
          <Button color="primary" onClick={addCharacter}>
            Add
          </Button>
        </Box>
      </>
    )
    
    return (
    <>
    <Table things={characters}>
        <TableColumn property={ownerPredicate} header="Owner" dataType="url" body={({ value }) => (
            <CombinedDataProvider datasetUrl={value} thingUrl={value}>
                <Text property={VCARD.fn.value} />
            </CombinedDataProvider>
          )} />
        <TableColumn property={namePredicate} header="Name" />
    </Table>
    {editContent}
    </>
    );
}
