
import { ReactElement } from "react";

import {
    Thing
} from "@inrupt/solid-client";

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button
} from "@chakra-ui/react";

import {IRowComponent, ThingList} from "../../thingList";

interface IThingListModal {
    headerContent?: ReactElement;
    things: Thing[];
    rowComponent: ({thing, selectHandler} : IRowComponent) => React.ReactElement;
    selectThing: (Thing) => void;
    isOpen: boolean;
    onClose: () => void;
}

/**
* A modal which renders a ThingList in a modal, where the parent defines the handler for a selected element
* if the ThingListModal should only be closed by making a selection, pass onClose=null
*/
export function ThingListModal({headerContent=null, things, rowComponent, selectThing, isOpen, onClose=null} : IThingListModal) : React.ReactElement {
    
        if (!things) return <div>loading...</div>;

        let footerContent = null;
        if(onClose != null) footerContent = <Button onClick={onClose}>Close</Button>;

        return (
            <>
            <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" size="xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{headerContent}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                <ThingList things={things} selectThing={selectThing} rowComponent={rowComponent} />
                </ModalBody>
    
                <ModalFooter>
                {footerContent}
                </ModalFooter>
            </ModalContent>
            </Modal>
            
            </>
        );
}