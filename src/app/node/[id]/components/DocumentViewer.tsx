import { EditOutlined } from "@/components/icons/EditOutlined";
import { ExperimentOutlined } from "@/components/icons/ExperimentOutlined";
import { FileOutlined } from "@/components/icons/FileOutlined";
import React, { ReactNode } from "react";

interface Document {
	name: string;
}

interface Action {
	icon: ReactNode;
	label: string;
	onClick: () => void;
}

interface ResearchContentProps {
	children: ReactNode;
	documents: Document[];
	actions?: Action[];
}

export function DocumentViewer({
	children,
	documents,
	actions,
}: ResearchContentProps) {
	return (
		<div className="border border-gray-100 rounded bg-gray-50/75 leading-relaxed">
			<div className="horizontal justify-between border-b border-gray-100 bg-white rounded-t px-4">
				<div className="flex pt-2">
					{documents?.map((doc, idx) => (
						<div
							key={`docs-file-${idx}`}
							className=" space-x-1.5 border-b pb-0.5 border-primary"
						>
							<FileOutlined className="text-sm text-primary" />
							<span className="text-primary text-xs">{doc.name}</span>
						</div>
					))}
				</div>
				<div className="flex items-center">
					{actions?.map((action, idx) => (
						<div
							key={`docs-action-${idx}`}
							className="text-blue-700 flex items-center space-x-1 hover:underline transition-colors cursor-pointer"
							onClick={action.onClick}
						>
							<EditOutlined className="leading-none text-sm" />

							<span className="text-xs">{action?.label}</span>
						</div>
					))}
				</div>
			</div>
			<div className="p-6">{children}</div>
		</div>
	);
}
