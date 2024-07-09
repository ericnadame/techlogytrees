"use client";

import { useContributionContract } from "@/hooks/useContributionContract";

import { Contributor, NodeData } from "@/typings";
import { useMemo } from "react";

interface useFetchTechTreeNodeProps {
	isLoading: boolean;
	node?: NodeData;
}

const document = JSON.stringify({});

export function useOnChainNode(
	techTreeId: bigint,
	id: bigint,
): useFetchTechTreeNodeProps {
	const { data: onChainNode, isLoading } = useContributionContract({
		functionName: "getNode",
		args: [techTreeId, id],
	});

	function parseOnChainDateToDateFormat(date: unknown): Date | undefined {
		if (!date || isNaN(Number(date))) return undefined;
		return new Date(Number(date) * 1000);
	}

	const node = useMemo(() => {
		// if (!onChainNode) return undefined;

		const arr = new Set([
			"0xFc1575e15F8763A917111A63364E95A0f4f444E2",
			"0x902DF7C35FE969eAD2f2d444F979991bc43Be711",
			"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
		]);
		const contributors: Contributor[] = [];
		arr.forEach((address) =>
			contributors.push({
				address,
			}),
		);

		/*for (const contributor of contributors) {
			const ensName = await resolveName({
				client: web3Client,
				address: contributor.address,
			});
			if (ensName) {
				contributor.ensName = ensName;
			}
		}*/

		/*		const status: NodeStatus = onChainNode.isFinished
			? "finished"
			: onChainNode.rfp.ipfsHash?.length === 0
				? "idle"
				: onChainNode.rfp.ipfsHash?.length > 0 &&
						onChainNode.treasury.amount === BigInt(0)
					? "rfp"
					: onChainNode.treasury.amount > BigInt(0) &&
							onChainNode.rfp.ipfsHash?.length > 0
						? "in-progress"
						: "idle";*/

		return {
			title: "Cellulosic Ethanol Production",
			id: "2342",
			type: "technology-development",
			isFinished: true,
			techTreeId: BigInt(1),
			status: "finished",
			createdBy: "0x902DF7C35FE969eAD2f2d444F979991bc43Be711",
			createdAt: new Date("2024-06-20T00:00:00Z"),
			contributors,
			contributions: [
				{
					contributor: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
					ipfsHash: document,
					createdAt: new Date("2024-06-21T00:00:00Z"),
				},
			],
			rfp: {
				createdAt: new Date("2024-06-20T00:00:00Z"),
				ipfsHash: "rfp.ipfsHash",
				writer: "0xFc1575e15F8763A917111A63364E95A0f4f444E2",
			},
			treasury: {
				amount: BigInt(32423421312312),
				funder: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
				fundedAt: new Date("2024-06-21T00:00:00Z"),
			},
		} as NodeData; /*

		return {
			title: onChainNode.title,
			id,
			type: onChainNode.nodeType as NodeType,
			isFinished: onChainNode.isFinished,
			techTreeId: onChainNode.techTreeId,
			status,
			rfp: {
				createdAt: parseOnChainDateToDateFormat(onChainNode.rfp.createdAt),
				ipfsHash: onChainNode.rfp.ipfsHash,
				writer: onChainNode.rfp.writer,
			},
			createdBy: onChainNode.createdBy,
			createdAt: parseOnChainDateToDateFormat(onChainNode.createdAt),
			contributors,
			contributions: onChainNode.contributions?.map((contribution) => ({
				contributor: contribution.contributor,
				ipfsHash: contribution.ipfsHash,
				createdAt: parseOnChainDateToDateFormat(
					(contribution as any).createdAt,
				),
			})),
			treasury: {
				amount: onChainNode.treasury.amount,
				funder: onChainNode.treasury.funder,
				fundedAt: parseOnChainDateToDateFormat(onChainNode.treasury.fundedAt),
			},
		} as NodeData;*/
	}, [onChainNode]);

	return {
		node,
		isLoading: false,
	};
}
