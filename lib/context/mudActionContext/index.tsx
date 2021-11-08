import {
    ReactElement,
    createContext,
} from 'react';

import axios, { AxiosResponse } from 'axios';

import { 
    Thing,
    createSolidDataset,
    setThing
} from '@inrupt/solid-client';

import { triplesToTurtle, MUD_LOGIC, useMudAccount } from "@multi-user-domain/mud-lib";
import useMudFederation from '../../hooks/useMudFederation';

/**
 * The Action Context leverages the FederationContext to expose choices and actions to the player
 * Components can use it to find choices in a scene, and to effect those choices from user input
 */

export interface IMUDActionContext {
    postTransitTask?: (subjectThing: Thing, destinationLocatable: Thing) => Promise<any>;
};

export const MudActionContext = createContext<IMUDActionContext>({});

export const MudActionProvider = ({
    children
}): ReactElement => {

    const { getFirstConfiguredEndpoint } = useMudFederation();
    const { setTask } = useMudAccount();

    const buildTransitPostData = (subject: Thing, locatable: Thing) : Promise<string> => {
        //should return a turtle file with just declarations for the locatable and the thing being given a location
        const dataset = setThing(setThing(createSolidDataset(), subject), locatable);
        return triplesToTurtle(Array.from(dataset[0]));
    }
    
    const postTask = (data: any, taskUri: String) : Promise<AxiosResponse<any>> => {
        let endpoint = getFirstConfiguredEndpoint(MUD_LOGIC.Transit);
        return axios.post(endpoint, data, { params: { taskUri: taskUri } });
    }
    
    /**
     * creates a Transit task for the parameterised thing to the parameterised mud:Locatable
     */
    //TODO: using shapes in Action Discovery to avoid needing to define this explicitly
    //  https://github.com/Multi-User-Domain/mud-jena/issues/44
    const postTransitTask = (subjectThing: Thing, destinationLocatable: Thing) : Promise<any> => {
        return new Promise<any>((resolve, reject) => {
            //get turtle POST data for transit
            return buildTransitPostData(subjectThing, destinationLocatable).then((postData) => {
                
                //make POST request using axios
                //caller is responsible for handling beginning and endState of the task
                postTask(postData, MUD_LOGIC.Transit).then((res) => {
                    if(res) {
                        setTask(subjectThing, res.headers['location'])
                    }

                    resolve(res)
                });
            });
        });
    }

    return(
        <MudActionContext.Provider
            value={{
                postTransitTask
            }}
        >
            {children}
        </MudActionContext.Provider>
    );
}