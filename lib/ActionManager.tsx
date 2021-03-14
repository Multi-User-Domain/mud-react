import axios, { AxiosResponse } from 'axios';

import { 
    Thing,
    createSolidDataset,
    setThing
} from '@inrupt/solid-client';

import { triplesToTurtle } from "./utils";
import { MUD_LOGIC, MUDAPI } from "./MUD";

/**
 * Action Manager is responsible for managing player action _choices_. Note that the actions themselves are implemented serverside,
 * an action manager should provide as limited a range as possible of hardcoded actions, and should instead be responsible for
 * controlling a healthy variety of choice for the player on a requested resource, much like the system for describing content
 * 
 * what and why: Action manager
 * where and when: the component requesting the choice
 * how: server-side
 */

export interface IActionManager {
    postTransitTask: (worldWebId: string, subjectThing: Thing, destinationLocatable: Thing) => Promise<any>;
};

export const actionManager: IActionManager = (() => {

    const buildTransitPostData = (subject: Thing, locatable: Thing) : Promise<string> => {
        //should return a turtle file with just declarations for the locatable and the thing being given a location
        const dataset = setThing(setThing(createSolidDataset(), subject), locatable);
        return triplesToTurtle(Array.from(dataset));
    }

    const postTask = (worldWebId: string, data: any, taskUri: String) : Promise<AxiosResponse<any>> => {
        return axios.post(worldWebId + MUDAPI.taskPath, data, { params: { taskUri: taskUri } });
    }
    
    /**
     * creates a Transit task for the parameterised thing to the parameterised mud:Locatable
     */
    const postTransitTask = (worldWebId: string, subjectThing: Thing, destinationLocatable: Thing) : Promise<any> => {
        return new Promise<any>((resolve, reject) => {
            //get turtle POST data for transit
            return buildTransitPostData(subjectThing, destinationLocatable).then((postData) => {
                
                //make POST request using axios
                //caller is responsible for handling beginning and endState of the task
                postTask(worldWebId, postData, MUD_LOGIC.Transit).then((res) => resolve(res));
            });
        });
    }

    return {
        postTransitTask: postTransitTask
    };
})();
