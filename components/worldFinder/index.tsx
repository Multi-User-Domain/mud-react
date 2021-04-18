import {useState} from "react";

import { 
    Container, Box, Input, Button
} from "@chakra-ui/react";

/**
 * The WorldFinder component provides a form to select a World server
 */

 export default function WorldFinder({foundWebId} : {foundWebId: (string) => any}): React.ReactElement {
    const [webId, setWebId] = useState("http://localhost:8080/");

    const onSubmit = () => {
        if(!webId) return;

        //TODO: validate input is valid URL
        //TODO: fetch MUD configuration

        foundWebId(webId);
    }

    return (
      <Container>
        <h3>Enter URL for World WebID</h3>
        <Box>
          <Input
            label="worldWebID"
            value={webId}
            onChange={(e) => setWebId(e.target.value)}
          />
          <Button color="primary" onClick={onSubmit}>
            Submit
          </Button>
        </Box>
      </Container>
    );
  }