import { useState } from "react";

import {
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

//TODO: get this from somewhere... store on my profile card?
const charactersDataSet = "https://calum.inrupt.net/public/collections/characters.ttl";

export default function CharactersView(): React.ReactElement {
    return (
        <Container fixed>
            <Box style={{ marginBottom: 16, textAlign: "right" }}>
                <LogoutButton>
                <Button variant="contained" color="primary">
                    Log&nbsp;out
                </Button>
                </LogoutButton>
            </Box>
            <DatasetProvider datasetUrl={charactersDataSet}>
                <Card style={{ maxWidth: 480 }}>
                <CardContent>
                    <Typography gutterBottom variant="h6" component="h3">
                    Characters
                    </Typography>

                    <CharacterTable />
                </CardContent>
                </Card>
            </DatasetProvider>
        </Container>
    );
}
