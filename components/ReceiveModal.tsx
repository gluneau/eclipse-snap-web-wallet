import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { QRCodeSVG } from 'qrcode.react';

interface ReceiveModalProps {
  address: string;
}

const ReceiveModal: React.FC<ReceiveModalProps> = ({ address }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button onPress={onOpen}>Receive</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Receive Funds</ModalHeader>
              <ModalBody>
                <div className="flex flex-col items-center">
                  <QRCodeSVG value={address} size={200} />
                  <p className="mt-4 text-sm break-all">{address}</p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ReceiveModal;