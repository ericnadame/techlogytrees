"use client";

import { useResearchPage } from "@/app/node/[id]/providers/ResearchPageProvider";
import { Button } from "@/components/button";
import { Table, TableCell, TableRow } from "@/components/table";
import { getShortenedFormat } from "@/utils/string.utils";
import React from "react";

export default function Page() {
	const { handleStatusChange, contributors } = useResearchPage();
	return (
		<>
			<div className="font-bold text-lg mt-8">Proposals</div>
			<div className="p-4 rounded mt-2 bg-gray-50">
				<div className="text-sm font-medium">Finalise Research Project</div>
				<p className="text-gray-700 text-sm w-6/12">
					You're about to submit the following changes. Verify that these
					changes are intended before proceeding.
				</p>
				<div className="mt-8">
					<Table
						headers={[
							{
								label: "Contributor",
								columnSpan: 5,
							},
							{
								label: "Contributor",
								columnSpan: 5,
							},
						]}
					>
						{contributors?.map((contributor, idx) => (
							<TableRow index={0} key={contributor.address}>
								<TableCell className="py-2" columnSpan={5}>
									{contributor.ensName ||
										getShortenedFormat(contributor.address)}
								</TableCell>
							</TableRow>
						))}
					</Table>
				</div>
			</div>
			<Button
				variant="primary"
				onClick={() => handleStatusChange?.("finished")}
			>
				Finish
			</Button>
		</>
	);
}
