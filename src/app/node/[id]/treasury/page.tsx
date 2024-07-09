"use client";

import { ResearchTreasury } from "@/app/node/[id]/components/ResearchTreasury";
import { Table, TableCell, TableRow } from "@/components/table";
import React from "react";

export default function Page() {
	//const { node } = useResearchPage();
	return (
		<>
			<ResearchTreasury />
			<div className="mt-10">
				<div className="font-bold mb-4">Active Payroll</div>
				<Table
					headers={[
						{
							label: "Researcher",
							columnSpan: 5,
						},
						{
							label: "Total Tokens",
							columnSpan: 3,
						},
						{
							label: "Available to Claim",
							columnSpan: 3,
						},
					]}
				>
					<TableRow index={0}>
						<TableCell className="py-2" columnSpan={5}>
							vitalik.eth
						</TableCell>
						<TableCell columnSpan={3}>200.242 GROW</TableCell>
						<TableCell columnSpan={3}>12.1 GROW</TableCell>
					</TableRow>
				</Table>
			</div>
		</>
	);
}
