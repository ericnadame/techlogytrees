import { Button } from "@/components/button";
import { Modal } from "@/components/modal";

import { DocumentViewer } from "@/app/node/[id]/components/DocumentViewer";
import { useResearchPage } from "@/app/node/[id]/providers/ResearchPageProvider";
import { InputNumber } from "@/components/input/input-number";
import { RichText } from "@/components/richText/RichText";
import { contributionAbi, contributionContractAddress } from "@/lib/constants";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useWriteContract } from "wagmi";
import { toWei } from "web3-utils";

interface DepositFundsProps {
	close(): void;
	onSuccess?(): void;
}

function DepositFunds({ close, onSuccess }: DepositFundsProps) {
	const { id, techTreeId } = useResearchPage();
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [value, setValue] = useState<number>(0);
	const {
		data: hash,
		writeContract,
		isSuccess,
		isError,
		isPending,
	} = useWriteContract();

	useEffect(() => {
		if (isSuccess) {
			setIsSubmitting(false);
			onSuccess?.();
			close();
		} else if (isError) {
			setIsSubmitting(false);
			toast.error("Failed to deposit funds");
		}
	}, [isSuccess, isError]);

	async function handleDeposit() {
		if (isNaN(Number(id))) return;

		setIsSubmitting(true);
		writeContract({
			abi: contributionAbi,
			address: contributionContractAddress,
			functionName: "addFunds",
			args: [techTreeId as bigint, id],
			value: BigInt(toWei(value.toString())),
		});
	}

	return (
		<Modal open close={close}>
			<div className="mb-10">
				<h2 className="font-bold">Add GROW</h2>
				<p className="text-sm text-gray-700 w-10/12">
					Enter the amount of GROW you would like to add to the treasury. These
					funds will directly support the research.
				</p>
			</div>
			<InputNumber
				precision={1}
				decimalSeparator="."
				aria-label="Demo number input"
				placeholder="Type a number…"
				value={value}
				onChange={(value) => setValue(value)}
			/>
			<div className="mt-4">
				<Button
					fullSize
					className="!py-3"
					loading={isSubmitting}
					variant="primary"
					onClick={handleDeposit}
				>
					Deposit
				</Button>
			</div>
		</Modal>
	);
}

export function RequestForFunding() {
	const [intentionToAddFunds, setIntentionToAddFunds] =
		useState<boolean>(false);
	const { rfp } = useResearchPage();
	const router = useRouter();

	const compensation = 0;
	return (
		<div className="flex items-start space-x-4 mt-4">
			<div className="w-9/12 space-y-4">
				<DocumentViewer
					documents={[
						{
							name: "Request For Proposal",
						},
					]}
				>
					<RichText value={rfp?.ipfsHash} />
				</DocumentViewer>
			</div>
			<div className="w-4/12 py-4 px-6 bg-gray-50 rounded">
				<div className="font-semibold text-sm">Fund Research</div>
				<div className="text-xs text-gray-700">
					The estimated funding to complete the R&D is around{" "}
					<span className="font-bold text-black">
						$1,500 ({compensation} GROW)
					</span>{" "}
					to complete the research.
				</div>
				<div className="mt-4 mb-8">
					<div className="py-2.5 flex justify-between text-xs border-y border-gray-200">
						<div className="text-gray-700">Continuous Compensation (25%)</div>
						<div className="font-medium">{(compensation / 100) * 25} GROW</div>
					</div>
					<div className="py-2.5 flex justify-between text-xs border-b border-gray-200">
						<div className="text-gray-700">Completion fee (75%)</div>
						<div className="font-medium">{(compensation / 100) * 75} GROW</div>
					</div>
					<div className="mt-2 text-[10px] w-11/12 leading-snug text-gray-800 flex items-start space-x-2">
						* These numbers are estimates as researchers can join/leave. Actual
						numbers will become accurate once the researcher starts.
					</div>
				</div>
				<div>
					<Button
						onClick={() => setIntentionToAddFunds(true)}
						variant="primary"
						className="!py-3"
						fullSize
					>
						Fund Research
					</Button>
				</div>
			</div>
			{intentionToAddFunds && (
				<DepositFunds
					onSuccess={() => router.refresh()}
					close={() => setIntentionToAddFunds(false)}
				/>
			)}
		</div>
	);
}
