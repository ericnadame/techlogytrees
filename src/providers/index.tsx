"use client";

import { chainOptions } from "@/lib/constants";
import AuthProvider from "@/providers/AuthProvider";
import { ContractEventsProvider } from "@/providers/ContractEventsProvider";
import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider, createConfig } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { filecoinCalibration, hardhat } from "viem/chains";
import { http } from "wagmi";

type ProviderType = {
  children: React.ReactNode;
};

const queryClient = new QueryClient();

export const config = createConfig({
  chains: [filecoinCalibration, hardhat],

  transports: {
    [filecoinCalibration.id]: http(),
    [hardhat.id]: http(),
  },
});

const Providers = ({ children }: ProviderType) => {
  return (
    <PrivyProvider
      appId={"clye7tasb08n3rnn9rqgng6ca"}
      config={{
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
        supportedChains: chainOptions,
        defaultChain: process.env.IS_LOCAL ? hardhat : filecoinCalibration,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          <AuthProvider>
            <ContractEventsProvider>{children}</ContractEventsProvider>
          </AuthProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
};

export default Providers;
