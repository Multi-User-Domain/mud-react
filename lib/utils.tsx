import { Quad } from "rdf-js";

import rdfjsDataset from "@rdfjs/dataset";

import {
    createSolidDataset,
    getThingAll,
    getUrlAll,
    SolidDataset,
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
        const TYPES = getUrlAll(thing, RDF.type);
        if(TYPES.includes(propertyType)) ret.push(thing);
    });
    return ret
};

export async function turtleToTriples(
    raw: string
  ): Promise<Quad[]> {
    const format = "text/turtle";
    const n3 = await loadN3();
    const parser = new n3.Parser({ format: format });
  
    const parsingPromise = new Promise<Quad[]>((resolve, reject) => {
      const parsedTriples: Quad[] = [];
      parser.parse(raw, (error, triple, _prefixes) => {
        if (error) {
          return reject(error);
        }
        if (triple) {
          parsedTriples.push(triple);
        } else {
          resolve(parsedTriples);
        }
      });
    });
  
    return parsingPromise;
  }

  export async function triplesToTurtle(quads: Quad[]): Promise<string> {
    const n3 = await loadN3();
    const format = "text/turtle";
    const writer = new n3.Writer({ format: format });
    // Remove any potentially lingering references to Named Graphs in Quads;
    // they'll be determined by the URL the Turtle will be sent to:
    const triples = quads.map((quad) =>
      rdfjsDataset.quad(quad.subject, quad.predicate, quad.object, undefined)
    );
    writer.addQuads(triples);
    const writePromise = new Promise<string>((resolve, reject) => {
      writer.end((error, result) => {
        /* istanbul ignore if [n3.js doesn't actually pass an error nor a result, apparently: https://github.com/rdfjs/N3.js/blob/62682e48c02d8965b4d728cb5f2cbec6b5d1b1b8/src/N3Writer.js#L290] */
        if (error) {
          return reject(error);
        }
        resolve(result);
      });
    });
  
    const rawTurtle = await writePromise;
    return rawTurtle;
  }
  
  async function loadN3() {
    // When loaded via Webpack or another bundler that looks at the `modules` field in package.json,
    // N3 serves up ES modules with named exports.
    // However, when it is loaded in Node, it serves up a CommonJS module, which, when imported from
    // a Node ES module, is in the shape of a default export that is an object with all the named
    // exports as its properties.
    // This means that if we were to import the default module, our code would fail in Webpack,
    // whereas if we imported the named exports, our code would fail in Node.
    // As a workaround, we use a dynamic import. This way, we can use the same syntax in every
    // environment, where the differences between the environments are in whether the returned object
    // includes a `default` property that contains all exported functions, or whether those functions
    // are available on the returned object directly. We can then respond to those different
    // situations at runtime.
    // Unfortunately, that does mean that tree shaking will not work until N3 also provides ES modules
    // for Node, or adds a default export for Webpack. See
    // https://github.com/rdfjs/N3.js/issues/196
    const n3Module = await import("n3");
    /* istanbul ignore if: the package provides named exports in the unit test environment */
    if (typeof n3Module.default !== "undefined") {
      return n3Module.default;
    }
    return n3Module;
  }

export const parseTurtleToSolidDataset = async (turtle: string) : Promise<SolidDataset> => {
    const triples = await turtleToTriples(turtle);
    const resource = createSolidDataset();
    triples.forEach((triple) => resource.add(triple));

    return resource;
}

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
    /*let url = new URL(contentServerURL)
    let params = [['uri', uri]]
    url.search = new URLSearchParams(params).toString();*/

    //return getSolidDataset(contentServerURL, );
    return await axios.get(contentServerURL, { params: { uri: uri } });
}