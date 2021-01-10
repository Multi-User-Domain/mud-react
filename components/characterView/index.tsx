import { useState } from "react";

import {
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

export default function CharacterView(): React.ReactElement {
    const [editing, setEditing] = useState(false);

    return (
        <Container fixed>
            <Box style={{ marginBottom: 16, textAlign: "right" }}>
                <LogoutButton>
                <Button variant="contained" color="primary">
                    Log&nbsp;out
                </Button>
                </LogoutButton>
            </Box>
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
        </Container>
    );
}
