import { useState } from "react";

import { FOAF } from "@inrupt/lit-generated-vocab-common";

import {
  getSolidDataset,
  getStringNoLocale,
  getThing,
  getUrl
} from "@inrupt/solid-client";

import {
  useSession,
  DatasetProvider,
  LogoutButton,
} from "@inrupt/solid-ui-react";

import {
  Box,
  Button,
  Card,
  CardActions,
  CardActionArea,
  CardContent,
  Container,
  Typography,
} from "@material-ui/core";

import CharacterTable from "../characterTable";

// TODO: this is better defined in a LIT
const accountPredicate = 'https://calum.inrupt.net/public/voc/mudchar.ttl#Account';
const charactersListPredicate = 'https://calum.inrupt.net/public/voc/mudchar.ttl#CharacterList';

export default function CharactersView(): React.ReactElement {
    const [editing, setEditing] = useState(false);
    const { session } = useSession();
    const { webId } = session.info;
    const [ charactersDataSetLocation, setCharactersDataLocation ] = useState(null);

    //TODO: account should be provided by a context, fetched at login
    getSolidDataset(webId).then((profileDataSet) => {
        const profileThing = getThing(profileDataSet, webId);
        const accountUrl = getUrl(profileThing, FOAF.account);
        getSolidDataset(accountUrl).then((accountDataSet) => {
            const accountThing = getThing(accountDataSet, accountUrl);
            //get the character list dataset from the account
            setCharactersDataLocation(getStringNoLocale(accountThing, charactersListPredicate));
        });
    });

    if(!charactersDataSetLocation) return <h3>loading..</h3>;

    return (
        <Container fixed>
            <Box style={{ marginBottom: 16, textAlign: "right" }}>
                <LogoutButton>
                <Button variant="contained" color="primary">
                    Log&nbsp;out
                </Button>
                </LogoutButton>
            </Box>
            <DatasetProvider datasetUrl={charactersDataSetLocation}>
                <Card style={{ maxWidth: 480 }}>
                <CardContent>
                    <Typography gutterBottom variant="h6" component="h3">
                    Characters
                    </Typography>

                    <CharacterTable edit={editing}/>
                </CardContent>
                <CardActions>
                    <Button
                    size="small"
                    color="primary"
                    onClick={() => setEditing(!editing)}
                    >
                    Toggle Edit
                    </Button>
                </CardActions>
                </Card>
            </DatasetProvider>
        </Container>
    );
}
