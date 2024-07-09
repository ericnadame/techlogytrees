"use client";

import { useTxEvents } from "@/providers/ContractEventsProvider";
import { useNodesAndEdges } from "@/providers/NodesAndEdgesProvider";
import { NodeData, TechTreeAddType, TechTreeMode } from "@/typings";
import React, {
	ReactNode,
	createContext,
	useContext,
	useMemo,
	useEffect,
} from "react";

type TechTreeContextProps = {
	mode: TechTreeMode;
	setMode: (mode: TechTreeMode) => void;
	setActiveNode: (nodeId?: string) => void;
	setActiveNodeRaw?: (node: NodeData) => void;
	activeNode?: NodeData;
	activeEditType?: TechTreeAddType;
	objective?: NodeData;
	setActiveEditType: (type?: TechTreeAddType) => void;
};

export const TechTreeContext = createContext<TechTreeContextProps>({
	mode: "move",
	setMode: () => {},
	setActiveNode: () => {},
	setActiveEditType: () => {},
});

export const useTechTreeContext = (): TechTreeContextProps => {
	const context = useContext(TechTreeContext);
	if (!context) {
		throw new Error("useTechTree must be used within a TechTreeProvider");
	}
	return context;
};

export function TechTreeLayoutContextProvider({
	children,
	techTreeId,
}: { children: ReactNode; techTreeId: bigint }) {
	const { events } = useTxEvents();
	const { nodes, hasUpdates } = useNodesAndEdges();
	const [mode, setMode] = React.useState<TechTreeMode>("move");
	const [activeEditType, setActiveEditType] = React.useState<
		TechTreeAddType | undefined
	>();

	const [activeNode, setActiveNode] = React.useState<NodeData>();

	useEffect(() => {
		const event = events.find(
			(event) =>
				event.eventName === "TechTreeUpdated" &&
				event.args.techTreeId === techTreeId,
		);
		if (event) {
			setActiveNode(undefined);
			setMode("move");
			setActiveEditType(undefined);
		}
	}, [events, techTreeId]);

	function handleSetActiveNode(nodeId?: string) {
		const node = nodes.find((n) => n.id === nodeId);
		setActiveNode(node);
	}

	const value = useMemo(
		() => ({
			mode,
			setMode,
			setActiveNode: handleSetActiveNode,
			activeNode,
			activeEditType,
			setActiveEditType,
			objective: nodes.find((node) => node.type === "ultimate-objective"),
			setActiveNodeRaw: setActiveNode,
		}),
		[mode, activeNode, activeEditType, nodes],
	);

	return (
		<TechTreeContext.Provider value={value}>
			{children}
		</TechTreeContext.Provider>
	);
}
