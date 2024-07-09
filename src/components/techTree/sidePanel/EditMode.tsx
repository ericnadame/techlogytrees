"use client";

import { NodeTypeTag } from "@/components/StatusTag";
import { Button } from "@/components/button";
import { InputSelect } from "@/components/input/InputSelect";
import InputText from "@/components/input/InputText";
import { useNodesAndEdges } from "@/providers/NodesAndEdgesProvider";
import { useTechTreeContext } from "@/providers/TechTreeLayoutContextProvider";
import { EdgeData, NodeData, NodeType, SelectOptionItem } from "@/typings";
import { fetchWrapper } from "@/utils/query.utils";
import { parseTypeToSearchFieldItems } from "@/utils/select.utils";
import Link from "next/link";
import React, { useEffect } from "react";

export function EditMode() {
	const { handleNodeUpdate, nodes } = useNodesAndEdges();
	const { activeNode, setActiveNode, setMode } = useTechTreeContext();
	const [isHandlingSave, setIsHandlingSave] = React.useState(false);
	const [update, setUpdate] = React.useState<Partial<NodeData>>({
		title: activeNode?.title,
		type: activeNode?.type,
	});

	useEffect(() => {
		setUpdate({
			title: activeNode?.title,
			type: activeNode?.type,
		});
	}, [activeNode]);

	async function handleSave() {
		if (!activeNode?.id) return;
		handleNodeUpdate(activeNode?.id, update);
		setUpdate({});
		if (update?.type === "ultimate-objective") {
			setIsHandlingSave(true);
			// await create(update.title);
			setActiveNode(undefined);
			setIsHandlingSave(false);
			setMode("move");
		} else {
			setActiveNode(undefined);
		}
	}

	const hasEndGoalInNodes =
		nodes?.length > 0 &&
		nodes.some((node) => node.type === "ultimate-objective");

	return (
		<div className="pr-2">
			<div className="mb-6">
				<div className="text-xs uppercase text-gray-500">Creator Mode</div>
				<div className="text-lg font-bold">{activeNode?.title}</div>
				<div className="mt-4">
					<div className="text-xs text-gray-500">Node Type</div>
					<div className="text-sm">
						{activeNode?.type && <NodeTypeTag type={activeNode?.type} />}
					</div>
				</div>
			</div>

			{activeNode?.origin !== "on-chain" ? (
				<div className="space-y-3">
					<InputText
						label="Title"
						value={update.title}
						onChange={(value) =>
							setUpdate((prev) => ({ ...prev, title: value }))
						}
					/>
					<InputSelect
						label="Type"
						options={parseTypeToSearchFieldItems(hasEndGoalInNodes)}
						value={{
							label: (update.type || "")?.toLowerCase() || "-",
							value: update.type || "-",
						}}
						onChange={(item: SelectOptionItem) =>
							setUpdate((prev) => ({
								...prev,
								type: item.value as NodeType,
							}))
						}
						isMulti={false}
					/>
					<div className="!mt-4 !pt-4 border-t border-gray-100 w-full space-y-3">
						<Button
							disabled={
								!update?.title || update?.title?.length < 2 || !update.type
							}
							loading={isHandlingSave}
							fullSize
							onClick={handleSave}
							variant="primary"
						>
							Save
						</Button>
						<div className="w-10/12 text-gray-500">
							* Saving a node only adds the changes locally. To fully address
							the changes, you need to publish them.
						</div>
					</div>
				</div>
			) : (
				<>
					<div className="text-xs px-6 py-4 bg-yellow-50 rounded leading-relaxed text-yellow-700">
						This node is already on-chain and currently cannot be edited. Join
						our Discord and ask us to amplify this feature!
					</div>
					{activeNode?.type === "ultimate-objective" && (
						<Link
							href={`/node/${activeNode?.id}`}
							className="mt-10 block w-full"
						>
							<Button className="!py-3" fullSize variant="black">
								Visit Details Page
							</Button>
						</Link>
					)}
				</>
			)}
		</div>
	);
}
