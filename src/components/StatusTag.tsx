import { Tag } from "@/components/Tag";
import { NodeStatus, NodeType } from "@/typings";
import React from "react";

interface StatusTagProps {
	status?: NodeStatus;
}

export function NodeTypeTag({ type }: { type: NodeType }) {
	return <Tag color={"gray"}>{type?.replace(/-/g, " ")?.toUpperCase()}</Tag>;
}

export function StatusTag({ status }: StatusTagProps) {
	return (
		<Tag
			color={
				status === "rfp"
					? "gray"
					: status === "in-progress"
						? "blue"
						: status === "finished"
							? "green"
							: "gray"
			}
		>
			{status?.replace(/-/g, " ")?.toUpperCase()}
		</Tag>
	);
}
