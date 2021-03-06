import { useState } from "react";

import {
    Box,
    Button,
    Container,
    Heading
} from "@chakra-ui/react";

import CharacterTable from "../tables/characterTable";

export default function CharacterView(): React.ReactElement {
    const [editing, setEditing] = useState(false);

    return (
        <Container>
            <Box>
            <Box>
                <Heading textAlign="center" marginBottom={4}>Characters</Heading>

                <CharacterTable edit={editing}/>
            </Box>
            <Box>
                <Button
                size="small"
                color="primary"
                onClick={() => setEditing(!editing)}
                >
                Toggle Edit
                </Button>
            </Box>
            </Box>
        </Container>
    );
}
