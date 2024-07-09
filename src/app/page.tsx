"use client";
import { CreateTechTree } from "@/app/CreateTechTreeModal";
import { LoadingOutlined } from "@/components/icons/LoadingOutlined";
import { PlusOutlined } from "@/components/icons/PlusOutlined";
import { TechTreeOutlined } from "@/components/icons/TechTreeOutlined";
import { useContributionContract } from "@/hooks/useContributionContract";
import { useAuth } from "@/providers/AuthProvider";
import { TechTree } from "@/typings";
import clsx from "clsx";
import Link from "next/link";
import React, { useEffect } from "react";

function CreateRoadmap({ onCreate }: { onCreate(): void }) {
	const {
		isAuthenticated,
		login,
		showInstructionsForTestnetTokens,
		hasBalance,
	} = useAuth();
	const [isAuthenticating, setIsAuthenticating] = React.useState(false);

	useEffect(() => {
		if (isAuthenticating && isAuthenticated) {
			setIsAuthenticating(false);
			if (hasBalance) {
				onCreate();
			} else {
				showInstructionsForTestnetTokens();
			}
		}
	}, [isAuthenticating, isAuthenticated, hasBalance]);

	function checkForBalanceAndExecute() {
		if (isAuthenticated && hasBalance) {
			onCreate();
		} else {
			showInstructionsForTestnetTokens();
		}
	}

	function handleAuth() {
		setIsAuthenticating(true);
		login();
	}

	return (
		<div
			onClick={isAuthenticated ? checkForBalanceAndExecute : handleAuth}
			className={clsx(
				"transition-all bg-green-50 flex flex-col items-center justify-center cursor-pointer text-green-900 hover:bg-green-100 border leading-none border-green-100 space-y-4 px-4 py-10 rounded-lg",
			)}
		>
			<PlusOutlined className="text-xl" />
			<span className="text-sm font-medium">Create roadmap</span>
		</div>
	);
}

function TechTreeItem({ techTree }: { techTree: TechTree }) {
	return (
		<Link
			key={techTree.id}
			href={`/roadmap/${techTree.id}`}
			className={clsx(
				"transition-all bg-indigo-50/25 flex flex-col items-center justify-center cursor-pointer text-indigo-900 hover:bg-indigo-100 border leading-none border-indigo-100 space-y-4 px-4 py-10 rounded-lg",
			)}
		>
			<TechTreeOutlined className="text-xl" />
			<span className="text-sm font-medium">{techTree.title}</span>
		</Link>
	);
}

export default function Home() {
	const [intentToCreate, setIntentToCreate] = React.useState(false);
	const { data: techTrees, isLoading } = useContributionContract<TechTree[]>({
		functionName: "getTechTrees",
	});

	return (
		<>
			<div className="transition-all flex flex-col bg-white items-center rounded w-full">
				<div className="h-full rounded px-6 mt-20 space-y-10 layout">
					<div className="space-y-2">
						<h1 className=" font-black text-3xl leading-[40px]">
							Simplified method to achieve
							<br />
							futuristic technologies.
						</h1>
						<p className="w-8/12 text-gray-700 text-base leading-7">
							Roadmaps enable a clear, structured pathway for tackling complex
							scientific and technological challenges, making it easier for
							researchers, developers, and innovators to navigate and contribute
							to the advancement of any scientific end-goal.
						</p>
					</div>
					<div>
						{isLoading ? (
							<LoadingOutlined />
						) : (
							<div className="grid grid-cols-4 gap-2">
								<CreateRoadmap onCreate={() => setIntentToCreate(true)} />
								{techTrees?.map((techTree, idx) => (
									<TechTreeItem key={`node-${idx}`} techTree={techTree} />
								))}
							</div>
						)}
						{/*<div className="flex flex-col h-full pt-48 space-y-4 w-10/12 mx-auto items-center">
							<TechTreeOutlined className="text-gray-300 text-4xl"/>
							<span className="text-gray-400 text-xs text-center">
									Seems that you don't have any technology trees yet. Let's get
									started by creating one.
								</span>
						</div>*/}
					</div>
				</div>
			</div>
			{intentToCreate && (
				<CreateTechTree handleBack={() => setIntentToCreate(false)} />
			)}
		</>
	);
}
