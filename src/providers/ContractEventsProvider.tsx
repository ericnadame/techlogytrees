"use client";

import React, { ReactNode, createContext, useContext } from "react";
import { decodeEventLog } from "viem";

interface TxEvent {
  address: string;
  blockHash: string;
  blockNumber: bigint;
  eventName: string;
  transactionHash: string;
  transactionIndex: number;
  data: `0x${string}`;
  args: Record<string, any>;
}

type TxEventsContextProps = {
  events: TxEvent[];
};

export const TxEventsContext = createContext<TxEventsContextProps>({
  events: [],
});
/*
const nodeAdded = prepareEvent({
	signature:
		"event NodeAdded(uint256 indexed nodeId, string title,  string nodeType)",
});
const rfpEvent = prepareEvent({
	signature: "event RfpAdded(uint256 indexed nodeIndex, string _ipfsHash)",
});
const TechTreeAdded = prepareEvent({
	signature: "event TechTreeAdded(uint256 indexed techTreeId, string title)",
});
const TechTreeUpdated = prepareEvent({
	signature: "event TechTreeUpdated(uint256 indexed techTreeId)",
});
const NodeFinished = prepareEvent({
	signature: "event NodeFinished(uint256 indexed nodeId)",
});
const TreasuryAdded = prepareEvent({
	signature: "event TreasuryAdded(uint256 indexed nodeIndex, uint256 amount)",
});

*/

export const useTxEvents = (): TxEventsContextProps => {
  const context = useContext(TxEventsContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};

export function ContractEventsProvider({ children }: { children: ReactNode }) {
  return (
    <TxEventsContext.Provider value={{ events: [] as TxEvent[] }}>
      {children}
    </TxEventsContext.Provider>
  );
}
