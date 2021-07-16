import {
    useContext
} from 'react';

import {
    IMUDContentContext,
    MudContentContext
} from '../../context/mudContentContext';

export default function useMudContent() : IMUDContentContext {
    const {
        getITerminalMessage,
        getThingDescription,
        getSceneDescription
    } = useContext(MudContentContext);

    return {
        getITerminalMessage,
        getThingDescription,
        getSceneDescription
    };
}
  