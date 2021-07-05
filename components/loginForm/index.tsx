import { useState, useEffect } from "react";
import { LoginButton } from "@inrupt/solid-ui-react";
import { Button, Input, InputGroup, InputRightAddon, Container } from "@chakra-ui/react";

export default function LoginForm(): React.ReactElement {
  // TODO: these are better placed in a configuration file
  const [idp, setIdp] = useState("https://inrupt.net");
  const [currentUrl, setCurrentUrl] = useState("https://localhost:3000");

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, [setCurrentUrl]);

  return (
    <Container fixed="true">
      <InputGroup>
        <Input
          label="Identity Provider"
          placeholder="Identity Provider"
          type="url"
          value={idp}
          onChange={(e) => setIdp(e.target.value)}
        />
        <InputRightAddon>
          <LoginButton oidcIssuer={idp} redirectUrl={currentUrl}>
            <Button variant="contained" color="primary">
              Log&nbsp;in
            </Button>
          </LoginButton>
        </InputRightAddon>
      </InputGroup>
    </Container>
  );
}
