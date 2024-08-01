import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import { useSolana } from "@/context/SolanaContext";

export default function SendModal() {
  const { solanaAddress } = useSolana();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState<number>(0);

  const handleSend = () => {
    // Implement the sign and send logic here
    console.log("Sending", amount, "to", address, "from", solanaAddress);
    onOpenChange(); // Close the modal
  };

  return (
    <>
      <Button onPress={onOpen}>Send</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Send SOL</ModalHeader>
              <ModalBody>
                <Input
                  fullWidth
                  isClearable
                  label="Recipient Address"
                  placeholder="Enter the recipient's address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <Input
                  fullWidth
                  isClearable
                  type="number"
                  placeholder="0.000000000"
                  label="Amount"
                  value={amount.toString()}
                  onChange={(e) => setAmount(parseFloat(e.target.value))}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={handleSend}>
                  Sign & Send
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
