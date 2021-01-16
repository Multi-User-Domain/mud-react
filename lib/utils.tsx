import {
    getThingAll,
    getUrl
  } from "@inrupt/solid-client";

import {RDF} from "@inrupt/lit-generated-vocab-common";

/**
 * @returns All Things from a given dataset if they are of parameterised type
 */
export const getFilteredThings = (dataset, propertyType) => {
    let ret = [];
    getThingAll(dataset).forEach((thing) => {
        const TYPE = getUrl(thing, RDF.type);
        if(propertyType == TYPE) ret.push(thing);
    });
    return ret
};