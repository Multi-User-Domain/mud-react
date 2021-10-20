import {
    ReactElement,
    createContext,
} from 'react';

import axios from 'axios';

import { 
    Thing,
    SolidDataset,
    createSolidDataset,
    setThing,
} from '@inrupt/solid-client';

import { MUD } from "../../MUD";
import { triplesToTurtle, parseTurtleToSolidDataset } from "../../utils";
import useMudFederation from "../../hooks/useMudFederation";

export interface IMUDSceneContext {
    buildScene?: (things: Thing[], expandFromWorldServer: boolean) => Promise<SolidDataset>;
};

export const MudSceneContext = createContext<IMUDSceneContext>({});

export const MudSceneProvider = ({
    children
}): ReactElement => {

    const { getFirstConfiguredEndpoint } = useMudFederation();

    const buildScene = (things: Thing[], postToWorldServer=true): Promise<SolidDataset> => {
        return new Promise<SolidDataset>((resolve, reject) => {
            let scene: SolidDataset = createSolidDataset();

            // build the basic scene from parameterised things
            for(let thing of things) {
                scene = setThing(scene, thing);
            }

            if(!postToWorldServer) return resolve(scene);

            triplesToTurtle(Array.from(scene)).then((sceneTurtle) => {
                // post it to the scene building endpoint
                axios.post(getFirstConfiguredEndpoint(MUD.sceneGenerationEndpoint), sceneTurtle).then((response) => {
                    if(!response || response.data == null) {
                        console.warn("attempted to generate scene but server response was empty");
                        return resolve(scene);
                    }

                    return resolve(parseTurtleToSolidDataset(response.data));
                }).catch((err) => reject(err));
            });
        });
    }

    return(
        <MudSceneContext.Provider
            value={{
                buildScene
            }}
        >
            {children}
        </MudSceneContext.Provider>
    );
};
