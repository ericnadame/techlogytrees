"use client";

import { Button } from "@/components/button";
import { ArrowLeftOutlined } from "@/components/icons/ArrowLeftOutlined";
import { EnhanceOutlined } from "@/components/icons/EnhanceOutlined";
import { ModeSelectionItem } from "@/components/techTree/menu/TechTreeMenu";
import { useNodesAndEdges } from "@/providers/NodesAndEdgesProvider";
import { useTechTreeContext } from "@/providers/TechTreeLayoutContextProvider";
import { EdgeData, NodeData } from "@/typings";
import { getNodeTypeBgColor } from "@/utils/nodes.utils";
import { fetchWrapper } from "@/utils/query.utils";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

function UltimateObjectivePanel() {
	const { updateAll, nodes } = useNodesAndEdges();
	const { setActiveNode, setMode, objective } = useTechTreeContext();
	const [isGenerating, setIsGenerating] = React.useState(false);

	async function create() {
		setIsGenerating(true);
		const response = await fetchWrapper<{
			nodes: NodeData[];
			edges: EdgeData[];
		}>(`/generate-tech-tree?title=${objective?.title}&id=${objective?.id}`);

		updateAll(
			response?.nodes.map((node) => ({
				id: node.id,
				title: node.title,
				description: node.description,
				type: node.type,
			})),
			response?.edges.map((edge, idx) => ({
				id: `${idx}`,
				source: edge.source,
				target: edge.target,
			})),
		);
		setIsGenerating(false);
		setMode("move");
		setActiveNode(undefined);
	}

	return (
		<div className="w-full relative">
			<div className="py-10 bg-gray-50 rounded" />
			{/*{nodes?.length > 1 && (
				<div className="mt-6 space-y-5 flex flex-col items-start">
					<div className="flex flex-col items-start space-y-2">
						<div>
							<div className="w-8 aspect-square horizontal justify-center font-bold text-gray-400 bg-gray-100 rounded-full">
								2
							</div>
						</div>
						<div className="text-sm pr-6 text-gray-700">
							Enhance your roadmap by adding more nodes and edges to the graph.
							You can also edit the existing nodes and edges.
						</div>
					</div>
					<Button
						loading={isGenerating}
						variant="primary"
						onClick={create}
						fullSize
					>
						Generate roadmap
					</Button>
				</div>
			)}*/}

			<div className="mt-10">
				<div className="text-sm font-medium mb-2 pb-2 border-b border-gray-100">
					Research & Developments
				</div>
				{nodes?.length <= 1 ? (
					<div className="space-y-5 flex flex-col items-start">
						<div className="flex flex-col w-full">
							<span className="text-gray-600 text-[13px] w-11/12 mb-3">
								Seems that you don't have any nodes & edges. Start connecting
								with other researchers{" "}
							</span>
							<div>
								<Button
									loading={isGenerating}
									variant="primary"
									className="!text-xs"
									onClick={create}
								>
									Generate
								</Button>
							</div>
						</div>
					</div>
				) : (
					nodes
						?.filter((item) => item.type !== "ultimate-objective")
						?.map((node) => <NodeItem node={node} />)
				)}
			</div>
		</div>
	);
}

function NodeItem({ node }: { node: NodeData }) {
	const { setActiveNode } = useTechTreeContext();
	return (
		<div
			onClick={() => setActiveNode(node.id)}
			className="cursor-pointer transition-colors hover:bg-gray-50 px-4 rounded w-full py-3 border-b border-gray-100 last:border-0"
		>
			<div className="flex items-center space-x-2">
				<div
					className={clsx(
						getNodeTypeBgColor(node.type, "dark"),
						"w-2 aspect-square rounded-full",
					)}
				/>
				<div className="text-xs font-medium">{node.title}</div>
			</div>
			<span className="capitalize text-gray-500 font-medium text-xs">
				<span className="font-normal">State: </span>
				{node.state || "emerging"}
			</span>
		</div>
	);
}

function ActiveNode() {
	return (
		<>
			<ModeSelectionItem
				label="enhance"
				mode="enhance"
				icon={<EnhanceOutlined />}
			/>
		</>
	);
}

export function TechTreeSidePanel() {
	const [expanded, setExpanded] = React.useState(true);
	const { nodes, hasUpdates, handlePublish, isPublishing } = useNodesAndEdges();
	const { activeNode, setActiveNode, objective } = useTechTreeContext();

	function handleClear() {
		setActiveNode(undefined);
		setExpanded(false);
	}

	return (
		<>
			<AnimatePresence>
				<motion.div
					className={clsx(
						"overflow-y-scroll absolute pt-5 right-0 space-y-6 self-start transition-all rounded bg-white drop-shadow-sm !w-[450px] ml-2 px-5 border-gray-200",
					)}
					initial={{ height: "auto" }}
					animate={{ height: expanded ? "100%" : "auto" }}
					transition={{ duration: 0.1 }}
				>
					<div>
						{!activeNode ? (
							<div className="text-[10px] text-gray-500">ROADMAP</div>
						) : (
							<div
								onClick={() => setActiveNode(undefined)}
								className="horizontal text-gray-500 hover:text-gray-950 cursor-pointer space-x-1"
							>
								<ArrowLeftOutlined className="text-xs" />
								<span className="text-xs">Back</span>
							</div>
						)}
						<div className="horizontal items-start justify-between">
							<div>
								<div className="text-base font-bold">
									{(activeNode || objective)?.title}
								</div>
							</div>
							<div className="horizontal space-x-3">
								<div
									className="text-xs px-3 py-1 bg-gray-100 hover:bg-indigo-100 transition-colors cursor-pointer hover:text-indigo-950 rounded-full text-gray-500 font-medium"
									onClick={() => setExpanded(!expanded)}
								>
									{expanded ? "Collapse" : "Expand"}
								</div>
								{/*<div
								onClick={() => handleClear()}
								className="group transition-colors cursor-pointer bg-gray-50 hover:bg-red-50 rounded"
							>
								<CloseOutlined className="group-hover:text-red-700 text-base text-gray-500 transition-colors" />
							</div>*/}
							</div>
						</div>
					</div>
					{!activeNode && expanded ? (
						<UltimateObjectivePanel />
					) : (
						<ActiveNode />
					)}
					{hasUpdates && (
						<div className="sticky bg-white space-y-6 bottom-0 py-6 z-20 inset-x-6">
							<div className="border-t border-gray-100 pt-4">
								<div className="text-xs text-gray-500 w-9/12">
									You have unsaved changes. Please save your changes before you
									leave
								</div>
							</div>
							<Button
								fullSize
								loading={isPublishing}
								onClick={() => handlePublish("publish")}
								disabled={!hasUpdates}
								className="py-2"
								variant="black"
							>
								Publish
							</Button>
						</div>
					)}
				</motion.div>
			</AnimatePresence>
		</>
	);
}
