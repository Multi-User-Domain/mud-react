import { Image, Circle, Center } from "@chakra-ui/react"
import { Thing, getUrl } from "@inrupt/solid-client";
import { FOAF } from "@inrupt/lit-generated-vocab-common";

/**
 * purpose: Thing Depiction component can display any Thing with the FOAF:depiction property and render it
 * renders a default icon if the property is not present
 */

export default function ThingDepiction({thing, ...childrenProps}): React.ReactElement {

    const imageUrl = getUrl(thing, FOAF.depiction);

    if(imageUrl) return <Image src={imageUrl} {...childrenProps}></Image>;
    return <Center h="100%"><Circle bg="tomato" w="20px" h="20px" {...childrenProps}></Circle></Center>;
}
