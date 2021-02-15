import {
    getThingAll,
    getUrl,
    Thing,
    getStringNoLocale
  } from "@inrupt/solid-client";

import {RDF, VCARD, FOAF} from "@inrupt/lit-generated-vocab-common";

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
 * checks common name properties on the Thing (VCARD, FOAF) and returns the first it can find
 * @returns the name of a given Thing, or null if unable to find it
 */
export const getThingName = (thing: Thing): string => {
    const NAME_PROPERTIES = [VCARD.fn, FOAF.name];
    for(let PROP of NAME_PROPERTIES) {
        const name = getStringNoLocale(thing, PROP);

        if(name != null) return name;
    }
    return null;
}

/**
 * @param uri: the URI of the Thing which I want to describe 
 * @returns content returned from the server (should be a plain text string). Null if the server had no content
*/
export const getContentRequest = async (contentServerURL: string, uri: string) : Promise<any> => {
    return await axios.get(contentServerURL, { params: { uri: uri } });
}