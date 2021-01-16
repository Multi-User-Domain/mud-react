import {useState} from 'react';

import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
  } from "@material-ui/core";

import SettlementTable from '../tables/settlementTable';

export default function WorldView(): React.ReactElement {
    const [ view, setView ] = useState(<SettlementTable />);
    
    return (
        <Container fixed>
            <Card style={{ maxWidth: 480 }}>
            <CardContent>
                {view}
            </CardContent>
            </Card>
        </Container>
    );
}
