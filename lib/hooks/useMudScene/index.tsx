import {
    useContext
} from 'react';

import {
    IMUDSceneContext,
    MudSceneContext
} from '../../context/mudSceneContext';

export default function useMudContent() : IMUDSceneContext {
    const {
        buildScene
    } = useContext(MudSceneContext);

    return {
        buildScene
    };
}
  