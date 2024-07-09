"use client";

import { TechTreeLayout } from "@/components/techTree";
import { TechTreeSidePanel } from "@/components/techTree/sidePanel";
import { NodesAndEdgesProvider } from "@/providers/NodesAndEdgesProvider";
import { TechTreeLayoutContextProvider } from "@/providers/TechTreeLayoutContextProvider";

import { useContributionContract } from "@/hooks/useContributionContract";
import { TechTree } from "@/typings";
import React from "react";

interface Params {
	techTreeId: string;
}

export default function TechTreeDetailsPage({ params }: { params: Params }) {
	const { data: techTrees, isLoading } = useContributionContract<TechTree[]>({
		functionName: "getTechTrees",
	});

	if (isLoading) return <div>Loading...</div>;

	const techTree = techTrees?.find(
		(tree) => tree.id === BigInt(params.techTreeId),
	);

	if (!techTree) return <div>Not found</div>;

	return (
		<NodesAndEdgesProvider techTree={techTree}>
			<TechTreeLayoutContextProvider techTreeId={techTree?.id}>
				<TechTreeLayout />
			</TechTreeLayoutContextProvider>
		</NodesAndEdgesProvider>
	);
}
