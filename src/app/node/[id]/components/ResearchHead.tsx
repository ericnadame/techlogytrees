"use client";

import { ProjectMenu } from "@/app/node/[id]/components/ProjectMenu";
import { useResearchPage } from "@/app/node/[id]/providers/ResearchPageProvider";
import { StatusTag } from "@/components/StatusTag";
import { Button } from "@/components/button";
import { contributionAbi, contributionContractAddress } from "@/lib/constants";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useWriteContract } from "wagmi";

export function ResearchHead() {
	const { account } = useAuth();
	const { title, status, techTreeId, createdBy, id, isFinished } =
		useResearchPage();
	const router = useRouter();
	const {
		data: hash,
		writeContract,
		isSuccess,
		isError,
		isPending,
	} = useWriteContract();

	useEffect(() => {
		if (isSuccess) {
			toast.success("Research concluded successfully");
			router.refresh();
		} else if (isError) {
			toast.error("Failed to conclude research");
		}
	}, [isSuccess, isError]);

	async function handleConcludeResearch() {
		if (!id) return;
		writeContract({
			abi: contributionAbi,
			address: contributionContractAddress,
			functionName: "finishNode",
			args: [techTreeId as bigint, id],
		});
	}

	return (
		<>
			<div className="mb-6 flex justify-between">
				<div>
					<h1 className="font-black text-2xl">{title}</h1>
					<div className="mt-1">
						<div className="flex items-center space-x-2">
							<div className="text-xs">Status:</div>
							<StatusTag status={status} />
						</div>
					</div>
				</div>
				{account?.address === createdBy &&
					!isFinished &&
					status === "in-progress" && (
						<div>
							<Button
								loading={isPending}
								onClick={handleConcludeResearch}
								variant="primary"
							>
								Conclude the research
							</Button>
						</div>
					)}
			</div>
			<ProjectMenu status={status} />
		</>
	);
}
