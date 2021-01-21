
import { ReactElement } from "react";

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from "@chakra-ui/react"

export default function SimpleModal(
    {header, body, footer, isOpen, onClose, ...modalProps} : {header: ReactElement, body: ReactElement, footer: ReactElement, isOpen: boolean, onClose: () => void}): ReactElement {

    return (
        <>
          <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" size="xl">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{header}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {body}
              </ModalBody>
    
              <ModalFooter>
                {footer}
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
}