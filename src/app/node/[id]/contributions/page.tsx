"use client";

import { getShortenedFormat } from "@/utils/string.utils";

import { useResearchPage } from "@/app/node/[id]/providers/ResearchPageProvider";

import { EthAvatar } from "@/components/EthAvatar";
import { useContributionContract } from "@/hooks/useContributionContract";
import { Contributor } from "@/typings";
import React, { useEffect } from "react";

interface ContributorItemProps {
	length: number;
	idx: number;
	contributor: Contributor;
	setContributorPoints: (address: string, points: bigint) => void;
	totalPoints: bigint;
}

function ContributorItem({
	contributor,
	totalPoints,
	setContributorPoints,
}: ContributorItemProps) {
	const { id } = useResearchPage();
	const { data, isLoading } = useContributionContract({
		functionName: "getUserNodePoints",
		args: [contributor.address, id],
	});

	useEffect(() => {
		const d = data?.toString();
		if (data?.toString()) {
			const points = BigInt(data.toString());
			setContributorPoints(contributor.address, points);
		}
	}, [data]);

	return (
		<div className="bg-gray-50 flex flex-col items-center rounded w-full py-10">
			<EthAvatar size="lg" address={contributor.address} />

			<div className="text-sm mt-6 text-primary font-bold">
				{contributor?.ensName || getShortenedFormat(contributor.address)}
			</div>
			{!isLoading && (
				<>
					<div className="text-sm mt-2">
						<span className="font-bold">
							{(Number(data) / Number(totalPoints)) * 100}%
						</span>{" "}
						of the work
					</div>
					<div className="text-xs">{data?.toString()} Earned Points</div>
				</>
			)}
		</div>
	);
}

export default function Page() {
	const { contributors } = useResearchPage();
	const [contributorPoints, setContributorPoints] = React.useState<
		{ address: string; points: bigint }[]
	>([]);

	function handleContributorPoints(address: string, points: bigint) {
		setContributorPoints([...contributorPoints, { address, points }]);
	}

	const totalPoints = contributorPoints.reduce(
		(acc, item) => acc + item.points,
		BigInt(0),
	);

	return (
		<div className="mt-10 pb-3  space-x-2">
			<h3 className="font-semibold text-base mb-6">
				{contributors?.length} Contributor
				{contributors && contributors?.length > 1 ? "s" : ""}
			</h3>
			<div className="grid grid-cols-6 w-full space-x-10">
				{contributors?.map((item, idx) => (
					<ContributorItem
						key={`contributor-${idx}`}
						contributor={item}
						idx={idx}
						length={contributors?.length}
						setContributorPoints={handleContributorPoints}
						totalPoints={totalPoints}
					/>
				))}
			</div>
		</div>
	);
}
