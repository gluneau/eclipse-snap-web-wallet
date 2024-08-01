import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import { useSolana } from "@/context/SolanaContext";
import { PublicKey, Transaction } from "@solana/web3.js";

export default function SendModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { solanaAddress, signTransaction } = useSolana();
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState(0);

  const handleSend = async () => {
    if (solanaAddress && address && amount > 0) {
      try {
        const transaction = new Transaction().add(
          // I'll create my transaction here
        );
        const signedTransaction = await signTransaction(transaction);
        // Check what is being returned here
        console.log("Signed transaction:", signedTransaction);
        onOpenChange();
      } catch (error) {
        console.error("Failed to sign transaction:", error);
      }
    }
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
