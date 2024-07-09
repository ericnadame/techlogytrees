import { EthAvatar } from "@/components/EthAvatar";
import { ArrowLeftOutlined } from "@/components/icons/ArrowLeftOutlined";
import { CopyOutlined } from "@/components/icons/CopyOutlined";
import { FilecoinFilled } from "@/components/icons/FilecoinFilled";
import { LogoutOutlined } from "@/components/icons/LogoutOutlined";
import { Modal } from "@/components/modal";
import { useAuth } from "@/providers/AuthProvider";
import { NodeData } from "@/typings";
import { formatNumber } from "@/utils/number.utils";
import { getShortenedFormat } from "@/utils/string.utils";
import React from "react";
import toast from "react-hot-toast";

interface AccountModalProps {
	close(): void;
}

export function AccountModal({ close }: AccountModalProps) {
	const { account, balance, logout } = useAuth();

	function handleLogout() {
		logout();
		close();
	}

	async function handleCopy() {
		await navigator.clipboard.writeText(account?.address || "");
		toast.success("Copied to clipboard");
	}

	// const totalPoints = points.reduce((acc, point) => acc + point.value, 0);

	if (!account) return null;

	return (
		<Modal position="right" close={close} showClose={false} open>
			<div className="mb-10 horizontal justify-between">
				<div
					onClick={close}
					className="horizontal text-gray-500 hover:text-gray-950 cursor-pointer space-x-1"
				>
					<ArrowLeftOutlined className="text-xs" />
					<span className="text-xs">Back</span>
				</div>
				<div className="horizontal space-x-2 text-gray-500 cursor-pointer">
					<div onClick={handleLogout} className=" ">
						<LogoutOutlined className="text-lg" />
					</div>
					<span className="text-sm">Logout</span>
				</div>
			</div>
			<div className="vertical items-center space-y-4 rounded py-2">
				<EthAvatar size="lg" address={account.address} />
				<div className="horizontal space-x-1">
					<p className="font-bold text-gray-700 text-base">
						{getShortenedFormat(account.address, 6)}
					</p>
					<CopyOutlined
						onClick={handleCopy}
						className="cursor-pointer text-sm -mt-1.5 text-gray-500 hover:text-gray-950"
					/>
				</div>
			</div>
			<div className="font-bold text-sm mb-2">Tokens</div>
			<div className="horizontal justify-between py-4 bg-gray-100 rounded px-5">
				<div className="horizontal space-x-3">
					<FilecoinFilled className="text-2xl" />
					<div className="text-sm font-medium text-gray-900">Filecoin</div>
				</div>
				<div className="font-bold text-sm text-gray-900">
					{formatNumber(Number(balance))} FIL
				</div>
			</div>
			{/*<div className="border-b border-gray-100 pb-2.5 mb-2.5">
						<div className="text-sm font-bold">Total: {totalPoints} Points</div>
					</div>
					<div className="space-y-1">
						{points?.map((point, index) => (
							<div
								key={`points-${index}`}
								className="horizontal justify-between py-4 bg-gray-50 px-4 rounded"
							>
								<div className="horizontal space-x-3">
									<div className="text-xs font-medium text-gray-900">
										{point.node?.title}
									</div>
								</div>
								<div className="text-xs text-gray-900">
									<span className="font-medium">{point.value}</span> Points
								</div>
							</div>
						))}
					</div>*/}
		</Modal>
	);
}
