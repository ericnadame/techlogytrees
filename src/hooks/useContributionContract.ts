import { contributionAbi, contributionContractAddress } from "@/lib/constants";
import { useReadContract } from "wagmi";

interface ContributionContractProps {
	functionName: string;
	args?: unknown[];
	enabled?: boolean;
}

export function useContributionContract<T>({
	functionName,
	args,
	enabled,
}: ContributionContractProps) {
	const response = useReadContract({
		abi: contributionAbi,
		address: contributionContractAddress,
		functionName,
		args,
		query: {
			enabled,
		},
	});
	return {
		...response,
		data: response?.data as T,
	};
}
