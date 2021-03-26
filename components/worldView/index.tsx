import {useState} from 'react';

import {
    Box,
    Container,
} from "@chakra-ui/react";

import SettlementTable from '../tables/settlementTable';

export default function WorldView(): React.ReactElement {
    const [ view, setView ] = useState(<SettlementTable />);
    
    return (
        <Container maxWidth="85%">
            <Box>
            <Box textAlign="center">
                {view}
            </Box>
            </Box>
        </Container>
    );
}
