import React, { useEffect, useState } from "react";
import DefaultLayout from "@/layouts/default";
import Moralis from "moralis";
import { SolNetwork, SolAddress, SolNative } from "@moralisweb3/common-sol-utils";
import { useSolana } from "@/context/SolanaContext";
import {
  Avatar,
  Card,
  CardHeader,
  CardBody,
  Divider,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { Copy } from "react-feather";
import SendModal from "@/components/SendModal";
import ReceiveModal from "@/components/ReceiveModal";

const AnimatedCopyIcon = ({ address }: { address?: string | null }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000); // Reset after 1 second
    }
  };

  return (
    <button
      onClick={handleClick}
      className="ml-2 relative"
      disabled={!address}
    >
      <Copy size="16" className={isAnimating ? "animate-ping" : ""} />
      {isAnimating && (
        <Copy
          size="16"
          className="absolute top-0 left-0 text-green-500"
        />
      )}
    </button>
  );
};

export default function IndexPage() {
  interface Token {
    associatedTokenAddress: SolAddress;
    mint: SolAddress;
    amount: SolNative;
    name: string | null;
    symbol: string | null;
    price?: number;
    value?: number;
  }

  const [tokens, setTokens] = useState<Token[]>([]);
  const { solanaAddress } = useSolana();
  const [balance, setBalance] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [solPrice, setSolPrice] = useState(0);

  const getTokenPrice = async (address: string): Promise<number> => {
    try {
      const response = await Moralis.SolApi.token.getTokenPrice({
        network: SolNetwork.MAINNET,
        address: address
      });
      return response.result.usdPrice ?? 0;
    } catch (error) {
      console.error(`Error fetching price for token ${address}:`, error);
      return 0;
    }
  };

  const getTokenLogoUrl = (mintAddress: string) => {
    return `https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/${mintAddress}/logo.png`;
  };

  useEffect(() => {
    if (solanaAddress) {
      const getBalance = async (address: string) => {
        try {
          await Moralis.start({
            apiKey:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImFmMzA4ZmU3LTg3NGMtNGNmYi04YTNmLTQxZTQ1NzExYTllZiIsIm9yZ0lkIjoiNDI1IiwidXNlcklkIjoiODMxIiwidHlwZUlkIjoiZjgzMTFhMzktZTExZi00MGY1LWFhOGEtZDgxZGVmOGUxMWNhIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2OTgwOTQ1OTksImV4cCI6NDg1Mzg1NDU5OX0.XhwVYC47NFApTb0TxMCcpXQoPbiso26VraF3udCt2M4",
          });

          const response = await Moralis.SolApi.account.getPortfolio({
            network: SolNetwork.MAINNET,
            address: address,
          });

          const portfolio = response.result;
          console.log("portfolio", portfolio);

          const solBalance = (portfolio.nativeBalance as any) / 1000000000;
          setBalance(solBalance);

          // Fetch SOL price
          const currentSolPrice = await getTokenPrice("So11111111111111111111111111111111111111112");
          setSolPrice(currentSolPrice);

          // Fetch token prices and calculate values
          const tokensWithPrices = await Promise.all(portfolio.tokens.map(async (token: any) => {
            const tokenTyped = token as Token;
            const price = await getTokenPrice(tokenTyped.mint.address);
            const value = price * Number(tokenTyped.amount) / 1000000;
            return { ...tokenTyped, price, value };
          }));

          setTokens(tokensWithPrices);

          // Calculate total portfolio value
          const tokenValue = tokensWithPrices.reduce((acc, token) => acc + (token.value || 0), 0);
          const solValue = solBalance * currentSolPrice;
          setTotalValue(tokenValue + solValue);

        } catch (error) {
          console.error("Error getting balance:", error);
        }
      };

      getBalance(solanaAddress);
    }
  }, [solanaAddress]);

  const rows = [
    {
      key: "sol",
      name: (
        <div className="flex items-center gap-3">
          <Avatar src={getTokenLogoUrl("So11111111111111111111111111111111111111112")} size="sm" />
          <div>
            <p className="text-md font-bold">Solana</p>
            <p className="text-small text-default-500">SOL</p>
          </div>
        </div>
      ),
      price: (
        <div>
          <p className="text-md">${solPrice.toFixed(2)}</p>
        </div>
      ),
      value: <p className="text-md">${(balance * solPrice).toFixed(2)}</p>,
      amount: <p className="text-md">{balance !== null ? balance.toFixed(6) : "Loading..."}</p>,
    },
    ...tokens.map((token, index) => ({
      key: index.toString(),
      name: (
        <div className="flex items-center gap-3">
          <Avatar src={getTokenLogoUrl(token.mint.address)} size="sm" />
          <div>
            <p className="text-md font-bold">{token.name || 'Unknown'}</p>
            <p className="text-small text-default-500">{token.symbol || 'N/A'}</p>
          </div>
        </div>
      ),
      price: (
        <div>
          <p className="text-md">${token.price ? token.price.toFixed(2) : '-'}</p>
        </div>
      ),
      value: <p className="text-md">${token.value ? token.value.toFixed(2) : '-'}</p>,
      amount: <p className="text-md">{token.amount ? (Number(token.amount) / 1000000).toFixed(6) : '0'}</p>,
    })),
  ];

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <Card className="w-5/6 max-w-[1200px]">
          <CardHeader className="flex justify-between gap-4 items-center">
            <div className="flex flex-col">
              <p className="text-md font-bold">Total portfolio value</p>
              <p className="text-2xl font-bold">
                ${totalValue.toFixed(2)}
              </p>
            </div>
            <Divider orientation="vertical" />
            <div className="flex flex-col">
              <p className="text-md">Solana Wallet</p>
              <div className="flex items-center">
                <p className="text-small text-default-500">
                  {solanaAddress || "Connect your wallet to get started"}
                </p>
                <AnimatedCopyIcon address={solanaAddress} />
              </div>
            </div>
            <div className="flex gap-4 ml-auto">
              {solanaAddress && <ReceiveModal address={solanaAddress} />}
              <SendModal />
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <p className="text-lg font-bold">Assets</p>
            <Table aria-label="Assets table">
              <TableHeader>
                <TableColumn>NAME</TableColumn>
                <TableColumn>PRICE</TableColumn>
                <TableColumn>VALUE</TableColumn>
                <TableColumn>AMOUNT</TableColumn>
              </TableHeader>
              <TableBody items={rows}>
                {(item) => (
                  <TableRow key={item.key}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>{item.value}</TableCell>
                    <TableCell>{item.amount}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </section>
    </DefaultLayout>
  );
}
