import React, { useEffect, useState } from "react";
import DefaultLayout from "@/layouts/default";
import Moralis from 'moralis';
import { useSolana } from "@/context/SolanaContext";
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { Copy } from "react-feather";
import SendModal from "@/components/SendModal";

export default function IndexPage() {
  const { solanaAddress } = useSolana();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (solanaAddress) {
      const getBalance = async (address: string) => {
        try {
          await Moralis.start({
            apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImFmMzA4ZmU3LTg3NGMtNGNmYi04YTNmLTQxZTQ1NzExYTllZiIsIm9yZ0lkIjoiNDI1IiwidXNlcklkIjoiODMxIiwidHlwZUlkIjoiZjgzMTFhMzktZTExZi00MGY1LWFhOGEtZDgxZGVmOGUxMWNhIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2OTgwOTQ1OTksImV4cCI6NDg1Mzg1NDU5OX0.XhwVYC47NFApTb0TxMCcpXQoPbiso26VraF3udCt2M4"
          });
        
          const response = Moralis.SolApi.account.getPortfolio({
            "network": "mainnet",
            "address": address
          });

          const portfolio = (await response).result;
          console.log("portfolio", portfolio);

          // Correctly access the native balance and convert it to SOL
          const solBalance = (portfolio.nativeBalance as any) / 1000000000;
          setBalance(solBalance);
        } catch (error) {
          console.error("Error getting balance:", error);
        }
      };

      getBalance(solanaAddress);
    }
  }, [solanaAddress]);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <Card className="w-5/6 max-w-[1200px]">
          <CardHeader className="flex justify-between gap-4 items-center">
            <div className="flex flex-col">
              <p className="text-md font-bold">Total portfolio value</p>
              <p className="text-2xl font-bold">${(balance * 100.58).toFixed(2)}</p>
            </div>
            <Divider orientation="vertical" />
            <div className="flex flex-col">
              <p className="text-md">Solana Wallet</p>
              <div className="flex items-center">
                <p className="text-small text-default-500">
                  {solanaAddress || "Connect your wallet to get started"}
                </p>
                <button
                  onClick={() => {
                    console.log("click button");
                  }}
                  className="ml-2"
                >
                  <Copy size="16" />
                </button>
              </div>
            </div>
            <div className="flex gap-4 ml-auto">
              <Button>Receive</Button>
              <SendModal />
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <p className="text-lg font-bold">Assets</p>
            <Table aria-label="Assets table">
              <TableHeader>
                <TableColumn>NAME</TableColumn>
                <TableColumn>PRICE/24H CHANGE</TableColumn>
                <TableColumn>VALUE</TableColumn>
                <TableColumn>AMOUNT</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow key="1">
                  <TableCell>
                    <p className="text-md font-bold">Solana</p>
                    <p className="text-small text-default-500">SOL</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-md">$100.58</p>
                    <p className="text-small text-green-600">+3.09%</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-md">${(balance * 100.58).toFixed(2)}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-md">
                      {balance !== null ? balance.toFixed(6) : "Loading..."}
                    </p>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </section>
    </DefaultLayout>
  );
}
