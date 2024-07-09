"use client";

import { Button } from "@/components/button";
import { LoadingOutlined } from "@/components/icons/LoadingOutlined";
import { useOnChainNode } from "@/hooks/useOnChainNode";
import { NodeData, NodeStatus } from "@/typings";
import Link from "next/link";
import React, { ReactNode, createContext, useContext, useEffect } from "react";

type ResearchContextProps = Partial<NodeData> & {
	handleStatusChange?: (status: NodeStatus) => void;
};

export const ResearchPageContext = createContext<ResearchContextProps>({});

export const useResearchPage = (): ResearchContextProps => {
	const context = useContext(ResearchPageContext);
	if (!context) {
		throw new Error(
			"useResearchPage must be used within a ResearchPageProvider",
		);
	}
	return context;
};

export function ResearchPageProvider({
	children,
	id,
	techTreeId,
}: { children: ReactNode; id: string; techTreeId: string }) {
	const { node, isLoading } = useOnChainNode(BigInt(techTreeId), BigInt(id));
	const [localNode, setLocalNode] = React.useState<NodeData>();

	useEffect(() => {}, []);

	useEffect(() => {
		if (node) {
			setLocalNode(node);
		}
	}, [node]);

	function handleStatusChange(status: NodeStatus) {
		setLocalNode((prevState) => prevState && { ...prevState, status });
	}

	return (
		<ResearchPageContext.Provider value={{ ...localNode, handleStatusChange }}>
			{isLoading ? (
				<div className="pt-10 layout">
					<LoadingOutlined />
				</div>
			) : node && !isLoading ? (
				children
			) : (
				<div className="pt-20 layout">
					<h1 className="font-bold text-3xl ">Node not found</h1>
					<p className="text-gray-600 text-sm mb-6 w-6/12">
						The node you are looking for does not exist or has been deleted.
						Navigate back to the app to view all available research/development
						projects.
					</p>
					<Link href="/">
						<Button variant="primary">Go Back</Button>
					</Link>
				</div>
			)}
		</ResearchPageContext.Provider>
	);
}
