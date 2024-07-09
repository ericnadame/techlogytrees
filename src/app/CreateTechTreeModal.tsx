import { ButtonWithAuthentication } from "@/components/button/ButtonWithAuthentication";
import InputText from "@/components/input/InputText";
import { Modal } from "@/components/modal";
import { contributionAbi, contributionContractAddress } from "@/lib/constants";
import { generateId } from "@/utils/nodes.utils";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useWatchContractEvent, useWriteContract } from "wagmi";

export function CreateTechTree({ handleBack }: { handleBack: () => void }) {
	const router = useRouter();
	const [title, setTitle] = React.useState("");

	const {
		data: hash,
		writeContract,
		isSuccess,
		isError,
		isPending,
		error,
	} = useWriteContract();

	useWatchContractEvent({
		address: contributionContractAddress,
		abi: contributionAbi,
		eventName: "TechTreeAdded",
		onLogs(logs) {
			logs.forEach((log) => {
				if (log.transactionHash === hash) {
					const args = (log as any).args as Record<string, any>;
					router.push(`/roadmap/${args.techTreeId}`);
				}
			});
		},
	});

	console.log(error);

	useEffect(() => {
		if (isSuccess) {
			toast.success("Tech tree created successfully");
		} else if (isError) {
			toast.error("Failed to create tech tree");
		}
	}, [isSuccess, isError]);

	async function handleCreateTechTree(title: string) {
		writeContract({
			address: contributionContractAddress,
			abi: contributionAbi,
			functionName: "addTechTree",
			args: [title, generateId()],
		});
	}

	return (
		<Modal
			wrapperWidth="max-w-2xl"
			bodyClassName="px-2 py-3"
			open
			close={handleBack}
		>
			<div className="mb-6">
				<h1 className="font-bold text-lg">What would you like to achieve?</h1>
				<p className="w-10/12 text-sm text-gray-700">
					Clearly define the end-goal you want to achieve. This will help you
					communicate your research to the community.
				</p>
			</div>
			<InputText
				placeholder="Dyson Sphere, Faster than light travel, etc."
				value={title}
				className="bg-gray-50"
				onChange={setTitle}
			/>
			<div className="mt-4 w-full flex justify-end space-y-3">
				<ButtonWithAuthentication
					disabled={!title || title?.length < 2}
					loading={isPending}
					onClick={() => handleCreateTechTree(title)}
					variant="primary"
				>
					Create
				</ButtonWithAuthentication>
			</div>
		</Modal>
	);
}
