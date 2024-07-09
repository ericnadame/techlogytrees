import { Button } from "@/components/button";
import { Modal } from "@/components/modal";
import { FundingState } from "@/typings";
import { formatNumber } from "@/utils/number.utils";

import { useResearchPage } from "@/app/node/[id]/providers/ResearchPageProvider";
import { InputNumber } from "@/components/input/input-number";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface DepositFundsProps {
	close(): void;
}

function DepositFunds({ close }: DepositFundsProps) {
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [value, setValue] = useState<number>(0);

	const debounced = useDebouncedValue(value, 2500);

	useEffect(() => {
		if (isSubmitting && debounced) {
			setIsSubmitting(false);
			toast.success("Funds deposited successfully");
			close();
		}
	}, [debounced]);

	return (
		<Modal
			wrapperWidth="max-w-2xl"
			bodyClassName="px-10 py-14"
			open
			close={close}
		>
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
					onClick={() => setIsSubmitting(true)}
				>
					Deposit
				</Button>
			</div>
		</Modal>
	);
}

export function ContributionAndTreasury() {
	const { fundingState } = useResearchPage();
	const [intentionToAddFunds, setIntentionToAddFunds] =
		useState<boolean>(false);

	if (!fundingState) return <></>;

	const fundingPercentage =
		(fundingState.fundingRaised / fundingState.fundingRequest) * 100;

	return (
		<>
			<div className="space-y-4 border-b border-gray-100 py-6">
				<div className="horizontal justify-between">
					<div>
						<div className="text-base font-bold mb-1">Treasury</div>
						<div className="horizontal space-x-4 text-left">
							<div className="text-sm text-gray-600">
								<span className="font-black text-primary">
									${formatNumber(fundingState.fundingRaised)}
								</span>{" "}
								of ${formatNumber(fundingState.fundingRequest)}
							</div>
						</div>
					</div>
				</div>
				<div className="horizontal space-x-1">
					<div
						className="h-2 bg-primary rounded-full"
						style={{ width: `${fundingPercentage}%` }}
					/>
					<div
						className="h-2 bg-gray-200 rounded-full"
						style={{ width: `${100 - fundingPercentage}%` }}
					/>
				</div>
			</div>
			{intentionToAddFunds && (
				<DepositFunds close={() => setIntentionToAddFunds(false)} />
			)}
		</>
	);
}
