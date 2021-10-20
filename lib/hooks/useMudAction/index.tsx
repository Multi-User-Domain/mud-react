import {
    useContext
} from 'react';

import {
    IMUDActionContext,
    MudActionContext
} from '../../context/mudActionContext';

export default function useMudAction() : IMUDActionContext {
    const {
        discoverActions
    } = useContext(MudActionContext);

    return {
        discoverActions,
    };
}
  