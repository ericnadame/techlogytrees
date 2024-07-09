import { useResearchPage } from "@/app/node/[id]/providers/ResearchPageProvider";

import { Button } from "@/components/button";
import { WarningOutlined } from "@/components/icons/WarningOutlined";
import { InputRichText } from "@/components/richText/InputRichText";
import { contributionAbi, contributionContractAddress } from "@/lib/constants";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useWriteContract } from "wagmi";

export function WriteRfp() {
	const router = useRouter();
	const { account, login } = useAuth();
	const { id, techTreeId } = useResearchPage();
	const [writeRfp, setWriteRfp] = React.useState(false);
	const [proposal, setProposal] = React.useState<string>();
	const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
	const {
		data: hash,
		writeContract,
		isSuccess,
		isError,
		isPending,
	} = useWriteContract();

	useEffect(() => {
		if (isSuccess) {
			setProposal("");
			setWriteRfp(false);
			router.refresh();
		} else if (isError) {
			setIsSubmitting(false);
		}
	}, [isSuccess]);

	async function handlePublish() {
		if (!proposal || !id) return;
		setIsSubmitting(true);
		writeContract({
			abi: contributionAbi,
			address: contributionContractAddress,
			functionName: "addRfp",
			args: [techTreeId as bigint, id, proposal],
		});
	}

	return (
		<div className="mt-4">
			{!writeRfp ? (
				<>
					<div className=" p-2 text-sm flex items-center space-x-4 flex-wrap">
						<div className="w-8 aspect-square horizontal justify-center rounded bg-yellow-100">
							<WarningOutlined className="text-yellow-800 text-lg" />
						</div>
						<span className="text-gray-700">
							This research does not have an{" "}
							<span className="font-medium">Request for Proposal (RFP)</span>{" "}
							yet. Let's get started!
						</span>
					</div>
					<div className="mt-4">
						{account?.address ? (
							<Button
								withAuth
								onClick={() => setWriteRfp(true)}
								variant="primary"
							>
								Write & Upload an RFP
							</Button>
						) : (
							<Button onClick={login}>Login</Button>
						)}
					</div>
				</>
			) : (
				<>
					<div className="!pt-4">
						<InputRichText
							minRows={10}
							label="Request For Proposal"
							value={proposal}
							onChange={(rfp) => setProposal(rfp)}
						/>
						<div className="mt-4 flex justify-end">
							<Button
								className="!py-2 !px-6"
								loading={isSubmitting || isPending}
								disabled={!proposal || proposal?.length < 2}
								variant="primary"
								onClick={() => handlePublish()}
							>
								Publish
							</Button>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
