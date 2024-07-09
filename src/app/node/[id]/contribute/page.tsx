"use client";

import { useResearchPage } from "@/app/node/[id]/providers/ResearchPageProvider";
import { Button } from "@/components/button";
import { InputRichText } from "@/components/richText/InputRichText";
import { contributionAbi, contributionContractAddress } from "@/lib/constants";
import { useTxEvents } from "@/providers/ContractEventsProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useWriteContract } from "wagmi";

export default function Page() {
	const { contributions, id, techTreeId } = useResearchPage();
	const [editedResearch, setEditedResearch] = React.useState<
		string | undefined
	>(contributions?.[0]?.ipfsHash);
	const router = useRouter();
	const { events } = useTxEvents();
	const { writeContract, isPending } = useWriteContract();

	useEffect(() => {
		const event = events.find(
			(event) => event.eventName === "ContributionAdded",
		);
		if (event) {
			router.push(`/node/${id}`);
		}
	}, [events, id]);

	async function handleUpdate() {
		if (!editedResearch) return;

		writeContract({
			abi: contributionAbi,
			address: contributionContractAddress,
			functionName: "addFunds",
			args: [techTreeId as bigint, id, editedResearch],
		});
	}

	return (
		<div className="w-full mt-2 space-y-2">
			<div className="mt-4 flex justify-end space-x-2">
				<Link href={`/node/${id}`}>
					<Button disabled={isPending}>Cancel Changes</Button>
				</Link>
				<Button loading={isPending} variant="primary" onClick={handleUpdate}>
					Submit Changes
				</Button>
			</div>
			<InputRichText
				minRows={10}
				value={editedResearch}
				onChange={(description) => setEditedResearch(description)}
			/>
		</div>
	);
}
