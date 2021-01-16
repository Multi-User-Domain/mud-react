import {
    getThingAll
  } from "@inrupt/solid-client";

/**
 * @returns All Things from a given dataset if they are of parameterised type
 */
export const getFilteredThings = (dataset) => {
    let ret = [];
    getThingAll(dataset).forEach((thing) => {
        //TODO: filter out Things which are not of parameterised type
        ret.push(thing);
    });
    return ret
};