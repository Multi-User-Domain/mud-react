import {
    getThingAll,
    getUrl
  } from "@inrupt/solid-client";

import {RDF} from "@inrupt/lit-generated-vocab-common";

import axios from 'axios';

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

/**
 * @param uri: the URI of the Thing which I want to describe 
 * @returns content returned from the server (should be a plain text string). Null if the server had no content
*/
export const getContentRequest = async (contentServerURL: string, uri: string) : Promise<any> => {
    return await axios.get(contentServerURL, { params: { uri: uri } });
}