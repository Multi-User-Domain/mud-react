/**
 * Copyright 2021 Inrupt Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
 * Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { Quad, Term, BlankNode } from "rdf-js";

import { SolidDataset } from "@inrupt/solid-client";

// Inferior copypasta of internal code from Inrupt's Solid-Client internal code
//  https://github.com/inrupt/solid-client-js/blob/main/src/rdfjs.internal.ts
// Waiting for official support from the library: https://github.com/inrupt/solid-client-js/issues/902

type QuadParseOptions = Partial<{
    otherQuads: Quad[];
    chainBlankNodes: BlankNode[];
}>;

/**
 * Runtime freezing might be too much overhead;
 * if so, this function allows us to replace it by a function
 * that merely marks its input as Readonly<> for static analysis.
 */
export const freeze: typeof Object.freeze = Object.freeze;

function isBlankNode(term: Term): term is BlankNode {
    return term.termType === "BlankNode";
}

export function getBlankNodeId(blankNode: BlankNode) {
    return `_:${blankNode.value}`;
}

function getPredicatesForBlankNode(
    node: BlankNode,
    quadParseOptions: QuadParseOptions
    ) {
    const chainBlankNodes = quadParseOptions.chainBlankNodes ?? [];
    if (
        chainBlankNodes.find((chainBlankNode) => chainBlankNode.equals(node)) ===
        undefined
    ) {
        // If this Blank Node is not used to provide nested values for another Subject,
        // just return its identifier.
        // That identifier will also be listed among the Subjects in the Graph.
        return getBlankNodeId(node);
}

/* istanbul ignore next: If there are chain nodes, there will always be other Quads, so the `?? []` can't be reached: */
const quads = quadParseOptions.otherQuads ?? [];
const quadsWithNodeAsSubject = quads.filter((quad) =>
    quad.subject.equals(node)
);

// First add the Quads with regular Objects
const predicates = quadsWithNodeAsSubject
        .filter((quad) => !isBlankNode(quad.object))
        .reduce((predicatesAcc, quad) => {
        const supportedPredicateTypes: Array<typeof quad.predicate.termType> = [
            "NamedNode",
        ];
        if (!supportedPredicateTypes.includes(quad.predicate.termType)) {
            throw new Error(
            `Cannot parse Quads with nodes of type [${quad.predicate.termType}] as their Predicate node.`
            );
        }
        const objects = predicatesAcc[quad.predicate.value] ?? {};
        return freeze({
            ...predicatesAcc,
            [quad.predicate.value]: addRdfJsQuadToObjects(
            objects,
            quad,
            quadParseOptions
            ),
        });
    }, {});

// And then also add the Quads that have another Blank Node as the Object
// in addition to the Blank Node `node` as the Subject:
const blankNodeObjectQuads = quadsWithNodeAsSubject.filter((quad) =>
        isBlankNode(quad.object)
    );
    return blankNodeObjectQuads.reduce((predicatesAcc, quad) => {
        const supportedPredicateTypes: Array<typeof quad.predicate.termType> = [
        "NamedNode",
        ];
        if (!supportedPredicateTypes.includes(quad.predicate.termType)) {
        throw new Error(
            `Cannot parse Quads with nodes of type [${quad.predicate.termType}] as their Predicate node.`
        );
        }
        /* istanbul ignore next: The `?? {}` doesn't get hit; presumably it's initialised above. */
        const objects = predicatesAcc[quad.predicate.value] ?? {};
        /* istanbul ignore next: The `?? []` doesn't get hit; presumably it's initialised above. */
        const blankNodes = objects.blankNodes ?? [];
        return freeze({
        ...predicatesAcc,
        // The BlankNode assertions are valid because we filtered on BlankNodes above:
        [quad.predicate.value]: {
            ...objects,
            blankNodes: [
            ...blankNodes,
            getPredicatesForBlankNode(
                quad.object as BlankNode,
                quadParseOptions
            ),
            ],
        },
        });
    }, predicates);
}

function addRdfJsQuadToObjects(
    objects,
    quad: Quad,
    quadParseOptions: QuadParseOptions
    ) {
    if (quad.object.termType === "NamedNode") {
        const namedNodes = freeze([
        ...(objects.namedNodes ?? []),
        quad.object.value,
        ]);
        return freeze({
        ...objects,
        namedNodes: namedNodes,
        });
    }

    if (quad.object.termType === "Literal") {
        if (quad.object.datatype.value === "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString") {
        const locale = quad.object.language.toLowerCase();
        const thisLocaleStrings = freeze([
            ...(objects.langStrings?.[locale] ?? []),
            quad.object.value,
        ]);
        const langStrings = freeze({
            ...(objects.langStrings ?? {}),
            [locale]: thisLocaleStrings,
        });
        return freeze({
            ...objects,
            langStrings: langStrings,
        });
        }

        // If the Object is a non-langString Literal
        const thisTypeValues = freeze([
        ...(objects.literals?.[quad.object.datatype.value] ?? []),
        quad.object.value,
        ]);
        const literals = freeze({
        ...(objects.literals ?? {}),
        [quad.object.datatype.value]: thisTypeValues,
        });
        return freeze({
        ...objects,
        literals: literals,
        });
    }

    if (quad.object.termType === "BlankNode") {
        const blankNodePredicates = getPredicatesForBlankNode(
        quad.object,
        quadParseOptions
        );
        const blankNodes = freeze([
        ...(objects.blankNodes ?? []),
        blankNodePredicates,
        ]);
        return freeze({
        ...objects,
        blankNodes: blankNodes,
        });
    }

    throw new Error(
        `Objects of type [${quad.object.termType}] are not supported.`
    );
}

function addRdfJsQuadToPredicates(
    predicates,
    quad: Quad,
    quadParseOptions: QuadParseOptions
    ) {
    const supportedPredicateTypes: Array<typeof quad.predicate.termType> = [
        "NamedNode",
    ];
    if (!supportedPredicateTypes.includes(quad.predicate.termType)) {
        throw new Error(
        `Cannot parse Quads with nodes of type [${quad.predicate.termType}] as their Predicate node.`
        );
    }
    const predicateIri = quad.predicate.value;
    const objects = predicates[predicateIri] ?? {};
    return freeze({
        ...predicates,
        [predicateIri]: addRdfJsQuadToObjects(objects, quad, quadParseOptions),
    });
}

function addRdfJsQuadToSubject(
    subject,
    quad: Quad,
    quadParseOptions: QuadParseOptions
    ) {
    return freeze({
        ...subject,
        predicates: addRdfJsQuadToPredicates(
        subject.predicates,
        quad,
        quadParseOptions
        ),
    });
}

function addRdfJsQuadToGraph(
    graph,
    quad: Quad,
    quadParseOptions: QuadParseOptions
    ) : any {
    const supportedSubjectTypes: Array<typeof quad.subject.termType> = [
        "NamedNode",
        "BlankNode",
    ];
    if (!supportedSubjectTypes.includes(quad.subject.termType)) {
        throw new Error(
        `Cannot parse Quads with nodes of type [${quad.subject.termType}] as their Subject node.`
        );
    }

    const subjectIri =
        quad.subject.termType === "BlankNode"
        ? `_:${quad.subject.value}`
        : quad.subject.value;

    const subject = graph[subjectIri] ?? {
        type: "Subject",
        url: subjectIri,
        predicates: {},
    };
    return freeze({
        ...graph,
        [subjectIri]: addRdfJsQuadToSubject(subject, quad, quadParseOptions),
    });
}

export function addRdfJsQuadToDataset(
    dataset: SolidDataset,
    quad: Quad,
    quadParseOptions: QuadParseOptions = {}
    ): SolidDataset {
    const supportedGraphTypes: Array<typeof quad.graph.termType> = [
        "NamedNode",
        "DefaultGraph",
    ];
    if (!supportedGraphTypes.includes(quad.graph.termType)) {
        throw new Error(
        `Cannot parse Quads with nodes of type [${quad.graph.termType}] as their Graph node.`
        );
    }
    const graphId =
        quad.graph.termType === "DefaultGraph" ? "default" : quad.graph.value;

    const graph = dataset.graphs[graphId] ?? {};
    return freeze({
        ...dataset,
        graphs: freeze({
        ...dataset.graphs,
        [graphId]: addRdfJsQuadToGraph(graph, quad, quadParseOptions),
        }),
    });
}