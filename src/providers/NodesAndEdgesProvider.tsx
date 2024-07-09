"use client";

import { useOnChainTechTree } from "@/hooks/useOnChainTechTree";
import { contributionAbi, contributionContractAddress } from "@/lib/constants";
import { EdgeData, NodeData, TechTree } from "@/typings";
import { isInvalidNumber } from "@/utils/number.utils";
import deepEqual from "deep-equal";
import React, {
	ReactNode,
	createContext,
	useContext,
	useMemo,
	useState,
	useEffect,
} from "react";
import { useWriteContract } from "wagmi";

type PublishMode = "reset" | "publish";

type NodesAndEdgesProps = {
	nodes: NodeData[];
	edges: EdgeData[];
	addNewNode(data: NodeData): void;
	updateAll(data: NodeData[], edges: EdgeData[]): void;
	handleEdgeUpdate: (source: string | null, target: string | null) => void;
	hasUpdates: boolean;
	handleNodeUpdate(nodeId: string, data: Partial<NodeData>): void;
	handlePublish(mode: PublishMode): void;
	isPublishing: boolean;
	isLoading: boolean;
};

export const NodesAndEdgesContext = createContext<NodesAndEdgesProps>({
	handleEdgeUpdate: () => {},
	updateAll: () => {},
	hasUpdates: false,
	nodes: [],
	edges: [],
	addNewNode: () => {},
	handleNodeUpdate: () => {},
	handlePublish: () => {},
	isPublishing: false,
	isLoading: false,
});

export const useNodesAndEdges = (): NodesAndEdgesProps => {
	const context = useContext(NodesAndEdgesContext);
	if (!context) {
		throw new Error(
			"useNodesAndEdges must be used within a NodesAndEdgesProvider",
		);
	}
	return context;
};

export function NodesAndEdgesProvider({
	children,
	techTree,
}: { children: ReactNode; techTree: TechTree }) {
	const { nodes, edges, isLoadingOnChain } = useOnChainTechTree({
		techTreeId: techTree.id,
	});

	const { data: hash, writeContract, isPending } = useWriteContract();
	const [updatedNodes, setUpdatedNodes] = useState<NodeData[]>([]);
	const [updatedEdges, setUpdatedEdges] = useState<EdgeData[]>([]);

	const nodesWithUpdates = useMemo(() => {
		return [...nodes, ...updatedNodes];
	}, [nodes, updatedNodes]);

	const edgesWithUpdates = useMemo(() => {
		return [...edges, ...updatedEdges];
	}, [edges, updatedEdges]);

	function handleEdgeUpdate(source: string | null, target: string | null) {
		if (!source || !target) return;
		setUpdatedEdges([
			...updatedEdges,
			{
				id: `${edgesWithUpdates?.length || 0}`,
				source,
				target,
			},
		]);
	}

	function updateAll(newNodes: NodeData[], newEdges: EdgeData[]) {
		const uniqueNodes = new Map(
			newNodes
				.filter((item) => item.type !== "ultimate-objective")
				.map((node) => [node.id, node]),
		);
		const uniqueEdges = new Map(newEdges.map((edge) => [edge.id, edge]));

		updatedNodes.forEach((node) => uniqueNodes.set(node.id, node));
		updatedEdges.forEach((edge) => uniqueEdges.set(edge.id, edge));

		setUpdatedNodes(Array.from(uniqueNodes.values()));
		setUpdatedEdges(Array.from(uniqueEdges.values()));
	}

	function handleNodeUpdate(nodeId: string, data: Partial<NodeData>) {
		const updatedNode = updatedNodes.find((node) => node.id === nodeId);
		if (!updatedNode) return;

		const updatedNodesCopy = updatedNodes.map((node) =>
			node.id === nodeId ? { ...node, ...data } : node,
		);
		setUpdatedNodes(updatedNodesCopy);
	}

	async function handlePublish(mode: PublishMode) {
		if (mode === "reset") {
			setUpdatedNodes([]);
			setUpdatedEdges([]);
			return;
		}

		try {
			writeContract({
				abi: contributionAbi,
				address: contributionContractAddress,
				functionName: "updateTechTree",
				args: [
					techTree.id,
					updatedNodes.map((node) => ({
						id: node.id,
						title: node.title || "",
						nodeType: node.type,
					})),
					updatedEdges.map((edge) => ({
						source: edge.source,
						target: edge.target,
					})),
				],
			});
		} catch (error) {
			console.log(error);
		}
	}

	const value = useMemo<NodesAndEdgesProps>(
		() => ({
			nodes: nodesWithUpdates,
			edges: edgesWithUpdates,
			addNewNode: (node) => setUpdatedNodes((prev) => [...(prev || []), node]),
			updateAll,
			handleEdgeUpdate,
			handleNodeUpdate,
			hasUpdates:
				!deepEqual(nodes, nodesWithUpdates) ||
				!deepEqual(edges, edgesWithUpdates),
			handlePublish,
			isPublishing: isPending,
			isLoading: isLoadingOnChain,
		}),
		[nodesWithUpdates, edgesWithUpdates, isPending, isLoadingOnChain],
	);

	return (
		<NodesAndEdgesContext.Provider value={value}>
			{children}
		</NodesAndEdgesContext.Provider>
	);
}
