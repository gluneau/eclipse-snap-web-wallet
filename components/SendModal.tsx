import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import { useSolana } from "@/context/SolanaContext";
import {
  PublicKey,
  Keypair,
  Connection,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

export default function SendModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { solanaAddress, signTransaction, sendTransaction } = useSolana();
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState(0);
  const connection = new Connection(
    "https://mainnet.helius-rpc.com/?api-key=2045dbd2-6921-48d0-8f19-0fa3d659dc15"
  );

  const handleSend = async () => {
    if (solanaAddress && address && amount > 0) {
      try {
        // Check the balance first
        const balance = await connection.getBalance(
          new PublicKey(solanaAddress)
        );
        const lamports = amount * LAMPORTS_PER_SOL;

        if (balance < lamports) {
          console.error(
            `Insufficient balance. Current balance: ${balance}, required: ${lamports}`
          );
          return;
        }

        const tx = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: new PublicKey(solanaAddress),
            toPubkey: new PublicKey(address),
            lamports: lamports,
          })
        );

        tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        tx.feePayer = new PublicKey(solanaAddress);

        const signedTransaction = await signTransaction(tx);
        console.log("Signed transaction:", signedTransaction);

        let txhash = await sendTransaction(signedTransaction);
        console.log(`txhash: ${txhash}`);

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
              <ModalHeader className="flex flex-col gap-1">
                Send SOL
              </ModalHeader>
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
