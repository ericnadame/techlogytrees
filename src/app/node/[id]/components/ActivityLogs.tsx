"use client";

import { useResearchPage } from "@/app/node/[id]/providers/ResearchPageProvider";
import { Contributor } from "@/typings";
import { getShortenedFormat } from "@/utils/string.utils";
import { formatDistance } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

type LogType = "creation" | "funded" | "rfp-written" | "contribution";

interface BasicActivityLogProps {
	contributor?: Contributor;
	createdAt?: Date;
	type: LogType;
}

function BasicActivityLog({
	contributor,
	createdAt = new Date(),
	type,
}: BasicActivityLogProps) {
	const { type: nodeType } = useResearchPage();
	function getTypeText(type: LogType) {
		switch (type) {
			case "creation":
				return `created a new ${nodeType} node`;
			case "funded":
				return "funded the node";
			case "rfp-written":
				return "wrote the RFP";
			case "contribution":
				return "contributed to the node";
			default:
				return "";
		}
	}

	return (
		<div className="pb-2 border-b border-gray-100 last:border-0">
			<div className="flex items-center space-x-0.5 text-gray-600">
				<div className="text-gray-400 text-xs leading-none mt-0.5 !mr-1.5">
					○
				</div>
				<div className="font-medium text-gray-800 text-xs">
					{contributor?.ensName || getShortenedFormat(contributor?.address)}
				</div>
				<div className="">{getTypeText(type)}</div>
			</div>
			<div className="ml-3.5 text-xs text-gray-400">
				{formatDistance(new Date(createdAt), new Date(), {
					addSuffix: true,
				})}
			</div>
		</div>
	);
}

export function ActivityLogs() {
	const { contributors, createdAt, createdBy, treasury, contributions, rfp } =
		useResearchPage();

	function isNotDefaultAddress(address?: string) {
		return address !== "0x0000000000000000000000000000000000000000";
	}

	return (
		<>
			<AnimatePresence>
				<motion.div
					variants={{
						hidden: { x: "100%" },
						visible: { x: 0, transition: { duration: 0.15 } },
						exit: { x: "100%", transition: { duration: 0.15 } },
					}}
					className="overflow-y-scroll h-full !w-[400px] border-l border-gray-100"
					initial="hidden"
					animate="visible"
					exit="exit"
				>
					<div className="w-full px-4 text-xs relative h-full">
						<div className="text-sm font-semibold mb-4">Activities</div>
						<div className="space-y-2.5">
							{contributions?.map((contribution) => (
								<BasicActivityLog
									key={contribution.ipfsHash}
									contributor={contributors?.find(
										(item) => item.address === contribution.contributor,
									)}
									createdAt={contribution.createdAt}
									type="contribution"
								/>
							))}
							{isNotDefaultAddress(treasury?.funder) && (
								<BasicActivityLog
									contributor={contributors?.find(
										(item) => item.address === treasury?.funder,
									)}
									createdAt={treasury?.fundedAt}
									type="funded"
								/>
							)}
							{isNotDefaultAddress(rfp?.writer) && (
								<BasicActivityLog
									contributor={contributors?.find(
										(item) => item.address === rfp?.writer,
									)}
									createdAt={rfp?.createdAt}
									type="rfp-written"
								/>
							)}
							<BasicActivityLog
								contributor={contributors?.find(
									(item) => item.address === createdBy,
								)}
								createdAt={createdAt}
								type="creation"
							/>
						</div>
					</div>
				</motion.div>
			</AnimatePresence>
		</>
	);
}
