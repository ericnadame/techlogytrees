"use client";

import React, { MouseEvent, useEffect } from "react";
import ReactFlow, {
	ConnectionLineType,
	ConnectionMode,
	Controls,
	Edge,
} from "reactflow";

import "reactflow/dist/style.css";
import { LoadingOutlined } from "@/components/icons/LoadingOutlined";
import { Legend } from "@/components/techTree/Legend";
import { TechNode } from "@/components/techTree/TechNode";
import { TechTreeSidePanel } from "@/components/techTree/sidePanel";
import { useNodesAndEdges } from "@/providers/NodesAndEdgesProvider";
import { useTechTreeContext } from "@/providers/TechTreeLayoutContextProvider";

import { getLayoutElements } from "@/utils/nodes.utils";
import clsx from "clsx";

const nodeTypes = { "tech-tree": TechNode };

export function TechTreeLayout() {
	const { nodes, edges, handleEdgeUpdate, isLoading } = useNodesAndEdges();
	const { mode, setActiveNode, activeNode, activeEditType } =
		useTechTreeContext();

	const { nodes: layoutNodes, edges: layoutEdges } = getLayoutElements(
		nodes,
		edges,
		activeNode,
	);

	return (
		<div
			className={clsx(
				mode === "edit" && "tech-tree-edit",
				"flex-1 relative h-full bg-grid flex",
			)}
		>
			<>
				{isLoading && (
					<div className="absolute inset-0 z-10 horizontal justify-center">
						<LoadingOutlined className="text-2xl text-gray-400" />
					</div>
				)}
				<ReactFlow
					nodes={layoutNodes}
					edges={layoutEdges}
					connectionLineType={ConnectionLineType.SmoothStep}
					fitView
					connectionMode={ConnectionMode.Loose}
					maxZoom={1.2}
					nodeTypes={nodeTypes}
					nodesDraggable={mode === "move"}
					zoomOnPinch
					zoomOnScroll
					draggable={mode === "move"}
					autoPanOnNodeDrag={mode === "move"}
					onSelectionEnd={() => setActiveNode(undefined)}
					onConnect={(params) => handleEdgeUpdate(params.source, params.target)}
					edgesUpdatable={mode === "edit" && activeEditType === "edge"}
					onNodeClick={(evt, { id }) => setActiveNode(id)}
				>
					<Controls />
				</ReactFlow>
				<TechTreeSidePanel />
			</>
			<Legend />
		</div>
	);
}
