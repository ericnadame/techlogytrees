"use client";

import { getShortenedFormat } from "@/utils/string.utils";

import { useResearchPage } from "@/app/node/[id]/providers/ResearchPageProvider";

import { EthAvatar } from "@/components/EthAvatar";
import { Contributor } from "@/typings";
import { formatNumber } from "@/utils/number.utils";
import React, { useEffect } from "react";
import { useReadContract } from "wagmi";

interface ContributorItemProps {
	length: number;
	idx: number;
	contributor: Contributor;
	setContributorPoints: (address: string, points: bigint) => void;
	totalPoints: bigint;
	points: bigint;
}

function ContributorItem({
	contributor,
	totalPoints,
	points,
	setContributorPoints,
}: ContributorItemProps) {
	const { id } = useResearchPage();

	/*	useEffect(() => {
		const d = data?.toString();
		if (data?.toString()) {
			// const points = BigInt(data.toString());
			// setContributorPoints(contributor.address, points);
		}
	}, [data]);*/

	return (
		<div className="bg-gray-50 flex flex-col items-center rounded w-full py-6">
			<EthAvatar size="lg" address={contributor.address} />

			<div className="text-sm mt-3 text-primary font-bold">
				{contributor?.ensName || getShortenedFormat(contributor.address)}
			</div>
			<>
				<div className="text-sm mt-2">
					<span className="font-semibold">
						{formatNumber((Number(points) / Number(totalPoints)) * 100)}%
					</span>{" "}
					of the work
				</div>
				<div className="text-[12px] font-medium text-gray-500">
					{points?.toString()} Earned Points
				</div>
			</>
		</div>
	);
}

export function Contributors() {
	const { contributors } = useResearchPage();
	const [contributorPoints, setContributorPoints] = React.useState<
		{ address: string; points: bigint }[]
	>([
		{
			address: "0xFc1575e15F8763A917111A63364E95A0f4f444E2",
			points: BigInt(2000),
		},
		{
			address: "0x902DF7C35FE969eAD2f2d444F979991bc43Be711",
			points: BigInt(55),
		},
		{
			address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
			points: BigInt(150),
		},
	]);

	function handleContributorPoints(address: string, points: bigint) {
		setContributorPoints([...contributorPoints, { address, points }]);
	}

	const totalPoints = contributorPoints.reduce(
		(acc, item) => acc + item.points,
		BigInt(0),
	);

	return (
		<div className="mt-10 pb-3">
			<h3 className="font-semibold text-base">
				{contributors?.length} Contributor
				{contributors && contributors?.length > 1 ? "s" : ""}
			</h3>
			<div className="grid grid-cols-6 w-full gap-2 my-4">
				{contributors?.map((item, idx) => (
					<ContributorItem
						key={`contributor-${idx}`}
						contributor={item}
						idx={idx}
						points={contributorPoints[idx]?.points}
						length={contributors?.length}
						setContributorPoints={handleContributorPoints}
						totalPoints={totalPoints}
					/>
				))}
			</div>
		</div>
	);
}
