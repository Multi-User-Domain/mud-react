import {useState} from "react";
import isURL from 'validator/lib/isURL';

import { 
    Container, Box, Input, Button, Text
} from "@chakra-ui/react";

import useMudFederation from "../../lib/hooks/useMudFederation";

/**
 * The WorldFinder component provides a form to select a World server
 */

 export default function WorldFinder({foundWebId} : {foundWebId: (string) => any}): React.ReactElement {
    const { connect } = useMudFederation();
    const [webId, setWebId] = useState("http://localhost:8080/");
    const [error, setError] = useState(null);

    const onSubmit = () => {
        if(!webId || !isURL(webId, {require_tld: false})) {
            setError("please enter a valid URL");
            console.log(webId);
            return;
        }

        // connect to the webId, only succeed when able to get the configuration
        // and the configuration contains at least the world server endpoint
        connect(webId).then((dataset) => {
          foundWebId(webId);
        })
        .catch((err) => {
          console.trace(err);
          setError("Error with response from this server. Please try another");
        });
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
          <Text color="red">{error}</Text>
          <Button color="primary" onClick={onSubmit}>
            Submit
          </Button>
        </Box>
      </Container>
    );
  }