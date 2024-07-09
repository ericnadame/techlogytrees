import { useTechTreeContext } from "@/providers/TechTreeLayoutContextProvider";
import { NodeData, NodeType } from "@/typings";
import { getNodeTypeColor, nodeHeight, nodeWidth } from "@/utils/nodes.utils";
import clsx from "clsx";
import { useEffect } from "react";
import { Handle, NodeProps, Position, useReactFlow } from "reactflow";

export function TechNode({
	data,
	isConnectable,
	targetPosition = Position.Top,
	sourcePosition = Position.Bottom,
	xPos,
	yPos,
	id,
}: NodeProps<NodeData>) {
	const { mode, activeNode, activeEditType } = useTechTreeContext();
	const hasActiveNodeInMoveMode = activeNode;
	const isActive = activeNode?.id === id;

	const { setCenter } = useReactFlow();

	useEffect(() => {
		if (activeNode?.id === id) {
			setCenter(xPos + nodeWidth / 2 + 250, yPos + nodeHeight / 2, {
				zoom: 0.75,
				duration: 800,
			});
		}
	}, [activeNode]);

	return (
		<>
			<Handle
				type="target"
				className={clsx(
					(mode !== "edit" || activeEditType !== "edge") && "!bg-transparent",
				)}
				position={targetPosition}
				isConnectable={isConnectable}
			/>
			<div
				className={clsx(
					"px-10 py-4 w-[350px] h-[75px] flex items-center relative !text-xs duration-300 transition-all border rounded",
					getNodeTypeColor(data.type),
					hasActiveNodeInMoveMode
						? {
								"border-gray-600 bg-white text-black": isActive,
								"!bg-gray-50 !border-gray-200 !text-gray-300 hover:opacity-100":
									!isActive,
							}
						: "border-gray-200 bg-white",
				)}
			>
				<span
					className={clsx(data?.title?.length === 0 && "text-green-800/50")}
				>
					{data?.title || "no title yet"}
				</span>
			</div>
			<Handle
				type="source"
				className={clsx(
					(mode !== "edit" || activeEditType !== "edge") && "!bg-transparent",
				)}
				position={sourcePosition}
				isConnectable={mode === "edit" && activeEditType === "edge"}
			/>
		</>
	);
}
