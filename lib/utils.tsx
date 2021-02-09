import {
    getThingAll,
    getUrl,
    Thing,
    getStringNoLocale
  } from "@inrupt/solid-client";

import {RDF, VCARD, FOAF} from "@inrupt/lit-generated-vocab-common";

import {Circle, Center} from "@chakra-ui/react";

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
 * @returns a ReactElement, either an img with the FOAF.depcition stored on the Thing, or a placeholder icon
 */
export const getThingDepiction = (thing: Thing) : React.ReactElement => {
    const imageUrl = getUrl(thing, FOAF.depiction);

    if(imageUrl) return <img src={imageUrl}></img>;
    return <Center h="100%"><Circle bg="tomato" w="20px" h="20px"></Circle></Center>;
}

/**
 * @param uri: the URI of the Thing which I want to describe 
 * @returns content returned from the server (should be a plain text string). Null if the server had no content
*/
export const getContentRequest = async (contentServerURL: string, uri: string) : Promise<any> => {
    return await axios.get(contentServerURL, { params: { uri: uri } });
}