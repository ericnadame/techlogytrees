import { NodeType } from "@/typings";
import clsx from "clsx";

function LegendItem({ color, label }: { color: string; label: NodeType }) {
	return (
		<div className="flex flex-col space-y-1 pl-4">
			<div className={clsx("w-3 h-1.5 rounded-xl", color)} />
			<div className="capitalize text-gray-700 text-[11px]">
				{label?.replace("-", " ")}
			</div>
		</div>
	);
}

export function Legend() {
	return (
		<div className="transition-all flex flex-col absolute left-2 bottom-2 ">
			<div className="flex items-center divide-x divide-gray-200 space-x-4">
				<LegendItem color="bg-blue-600" label="fundamental-research" />
				<LegendItem color="bg-yellow-600" label="applied-research" />
				<LegendItem color="bg-red-600" label="translational-research" />
				<LegendItem color="bg-purple-600" label="technology-development" />
				<LegendItem color="bg-indigo-600" label="demonstration-validation" />
				<LegendItem color="bg-pink-600" label="implementation-deployment" />
				<LegendItem color="bg-gray-600" label="continuous-improvement" />
			</div>
		</div>
	);
}
