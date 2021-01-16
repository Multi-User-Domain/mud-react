import { useState } from "react";

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

import CharacterTable from "../tables/characterTable";

export default function CharacterView(): React.ReactElement {
    const [editing, setEditing] = useState(false);

    return (
        <Container fixed>
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
