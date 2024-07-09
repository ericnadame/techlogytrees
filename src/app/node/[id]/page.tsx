"use client";

import { RequestForFunding } from "@/app/node/[id]/components/RequestForFunding";
import { LoadingOutlined } from "@/components/icons/LoadingOutlined";

import { Contributors } from "@/app/node/[id]/components/Contributors";
import { DocumentViewer } from "@/app/node/[id]/components/DocumentViewer";
import { WriteRfp } from "@/app/node/[id]/components/WriteRfp";
import { useResearchPage } from "@/app/node/[id]/providers/ResearchPageProvider";

import { Button } from "@/components/button";
import { EditOutlined } from "@/components/icons/EditOutlined";
import { WarningOutlined } from "@/components/icons/WarningOutlined";
import { RichText } from "@/components/richText/RichText";
import { useAuth } from "@/providers/AuthProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export default function Page() {
	const { status, id, contributions, techTreeId } = useResearchPage();
	const router = useRouter();
	const { account, login } = useAuth();
	return (
		<div className="!pb-10">
			{status === "idle" ? (
				<WriteRfp />
			) : status === "rfp" ? (
				<RequestForFunding />
			) : status === "in-progress" ? (
				<>
					<Contributors />
					<DocumentViewer
						documents={[
							{
								name: "Research",
							},
						]}
						actions={[
							{
								icon: <EditOutlined />,
								label: "Contribute",
								onClick: () => {
									router.push(`/node/${id}/contribute`);
								},
							},
						]}
					>
						{contributions && contributions?.length > 0 ? (
							<RichText
								value={contributions?.[contributions?.length - 1]?.ipfsHash}
							/>
						) : (
							<div>
								<div className=" p-2 text-sm flex items-center space-x-4 flex-wrap">
									<div className="w-8 aspect-square horizontal justify-center rounded bg-yellow-100">
										<WarningOutlined className="text-yellow-800 text-lg" />
									</div>
									<span className="text-gray-700 text-xs">
										This research does not have a{" "}
										<span className="font-medium">contribution</span> yet. Let's
										get started!
									</span>
								</div>
								<div className="mt-4">
									{account?.address ? (
										<Link href={`/node/${id}/contribute`}>
											<Button variant="primary">Contribute</Button>
										</Link>
									) : (
										<Button onClick={login}>Login</Button>
									)}
								</div>
							</div>
						)}
					</DocumentViewer>
				</>
			) : status === "finished" ? (
				<>
					<div className="mt-4">
						<div className="p-2 bg-yellow-50/75 border flex items-center justify-start space-x-6 rounded border-yellow-300 ">
							<div className="horizontal justify-center w-14 text-xl aspect-square rounded bg-orange-100">
								🎉
							</div>
							<div className="w-9/12">
								<h1 className="font-bold text-sm">Research concluded</h1>
								<p className="text-xs text-gray-700 ">
									Thank you for your contribution. The research has been
									concluded.
								</p>
							</div>
						</div>
						<Contributors />
						<DocumentViewer
							documents={[
								{
									name: "Research",
								},
							]}
						>
							<RichText
								value={contributions?.[contributions?.length - 1]?.ipfsHash}
							/>
						</DocumentViewer>
					</div>
				</>
			) : (
				<div className="mt-10">
					<LoadingOutlined />
				</div>
			)}
		</div>
	);
}
