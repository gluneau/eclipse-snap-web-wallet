import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { SnapWalletAdapter } from "@drift-labs/snap-wallet-adapter";
import {
  PublicKey,
  Connection,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";

interface SolanaContextProps {
  solanaAddress: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  signTransaction: (
    tx: Transaction | VersionedTransaction
  ) => Promise<Transaction | VersionedTransaction>;
  sendTransaction: (tx: Transaction | VersionedTransaction) => Promise<string>;
}

const SolanaContext = createContext<SolanaContextProps | undefined>(undefined);

export const SolanaProvider = ({ children }: { children: ReactNode }) => {
  const [solanaAddress, setSolanaAddress] = useState<string | null>(null);
  const [driftSnapWalletAdapter, setDriftSnapWalletAdapter] =
    useState<SnapWalletAdapter | null>(null);
  const connection = new Connection(
    "https://mainnet.helius-rpc.com/?api-key=2045dbd2-6921-48d0-8f19-0fa3d659dc15"
  );

  useEffect(() => {
    const adapter = new SnapWalletAdapter();
    setDriftSnapWalletAdapter(adapter);

    const handleConnect = async () => {
      console.log("Wallet connected");
      await fetchSolanaAddress();
    };
    const handleDisconnect = () => {
      console.log("Wallet disconnected");
      setSolanaAddress(null);
    };
    const handleError = (error: Error) => console.error("Wallet error:", error);

    adapter.on("connect", handleConnect);
    adapter.on("disconnect", handleDisconnect);
    adapter.on("error", handleError);

    return () => {
      adapter.off("connect", handleConnect);
      adapter.off("disconnect", handleDisconnect);
      adapter.off("error", handleError);
    };
  }, []);

  const fetchSolanaAddress = async () => {
    console.log("Fetching Solana address...");
    if (driftSnapWalletAdapter && driftSnapWalletAdapter.connected) {
      try {
        const publicKey = driftSnapWalletAdapter.publicKey?.toString();
        console.log("Public key:", publicKey);
        setSolanaAddress(publicKey || null);
      } catch (error) {
        console.error("Failed to fetch Solana address:", error);
      }
    }
  };

  const connectWallet = async () => {
    if (driftSnapWalletAdapter) {
      console.log("Attempting to connect...");
      try {
        await driftSnapWalletAdapter.connect();
        console.log("Connected to wallet");
        await fetchSolanaAddress();
      } catch (error) {
        console.error("Failed to connect:", error);
      }
    } else {
      console.error("SnapWalletAdapter not initialized");
    }
  };

  const disconnectWallet = async () => {
    if (driftSnapWalletAdapter) {
      try {
        await driftSnapWalletAdapter.disconnect();
      } catch (error) {
        console.error("Failed to disconnect:", error);
      }
    }
  };

  const signTransaction = async (
    tx: Transaction | VersionedTransaction
  ): Promise<Transaction | VersionedTransaction> => {
    if (driftSnapWalletAdapter) {
      try {
        return await driftSnapWalletAdapter.signTransaction(tx);
      } catch (error) {
        console.error("Failed to sign transaction:", error);
        throw error;
      }
    } else {
      throw new Error("SnapWalletAdapter not initialized");
    }
  };

  const sendTransaction = async (tx: Transaction | VersionedTransaction) => {
    if (driftSnapWalletAdapter) {
      try {
        return await driftSnapWalletAdapter.sendTransaction(tx, connection);
      } catch (error) {
        console.error("Failed to send transaction:", error);
        throw error;
      }
    } else {
      throw new Error("SnapWalletAdapter not initialized");
    }
  };

  return (
    <SolanaContext.Provider
      value={{
        solanaAddress,
        connectWallet,
        disconnectWallet,
        signTransaction,
        sendTransaction,
      }}
    >
      {children}
    </SolanaContext.Provider>
  );
};

export const useSolana = () => {
  const context = useContext(SolanaContext);
  if (!context) {
    throw new Error("useSolana must be used within a SolanaProvider");
  }
  return context;
};
