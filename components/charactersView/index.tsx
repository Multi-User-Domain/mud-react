import { useState } from "react";

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
import useMudAccount from "../../lib/hooks/useMudAccount";

export default function CharactersView(): React.ReactElement {
    const [editing, setEditing] = useState(false);
    const {charactersDataSet} = useMudAccount();

    if(!charactersDataSet) return <h3>loading..</h3>;

    return (
        <Container fixed>
            <Box style={{ marginBottom: 16, textAlign: "right" }}>
                <LogoutButton>
                <Button variant="contained" color="primary">
                    Log&nbsp;out
                </Button>
                </LogoutButton>
            </Box>
            <DatasetProvider dataset={charactersDataSet}>
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
