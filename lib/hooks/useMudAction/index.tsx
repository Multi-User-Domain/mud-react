import {
    useContext
} from 'react';

import {
    IMUDActionContext,
    MudActionContext
} from '../../context/mudActionContext';

export default function useMudAction() : IMUDActionContext {
    const {
        postTransitTask
    } = useContext(MudActionContext);

    return {
        postTransitTask,
    };
}
  