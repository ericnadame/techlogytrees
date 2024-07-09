"use client";

import { Modal } from "@/components/modal";
import { usePrivy } from "@privy-io/react-auth";
import React, {
	ReactNode,
	createContext,
	useMemo,
	useContext,
	useEffect,
} from "react";
import { formatEther } from "viem";
import { useBalance } from "wagmi";

type Account = {
	address: string;
};

export interface AuthContextProps {
	account?: Account;
	isAuthenticated: boolean;
	hasBalance: boolean;
	balance: string;
	login: () => void;
	logout: () => void;
	showInstructionsForTestnetTokens: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
	account: undefined,
	isAuthenticated: false,
	hasBalance: false,
	balance: "0",
	login: () => {},
	logout: () => {},
	showInstructionsForTestnetTokens: () => {},
});

export const useAuth = (): AuthContextProps => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within a AuthProvider");
	}
	return context;
};

type AuthProviderProps = {
	children: ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProps) {
	const [
		showInstructionsForTestnetTokens,
		setShowInstructionsForTestnetTokens,
	] = React.useState(false);
	const { authenticated, user, login, ready, logout } = usePrivy();
	const { data, isLoading: isLoadingBalance } = useBalance({
		address: (user?.wallet?.address as `0x${string}`) || "0x0",
		query: {
			enabled: authenticated,
		},
	});

	const balance = data?.value ? formatEther(data?.value) : "0";

	useEffect(() => {
		if (ready && authenticated && !isLoadingBalance && balance === "0") {
			setShowInstructionsForTestnetTokens(true);
		}
	}, [isLoadingBalance, authenticated, balance, ready]);

	const value = useMemo(
		() => ({
			account: user?.wallet?.address
				? { address: user.wallet.address }
				: undefined,
			isAuthenticated: authenticated,
			hasBalance: balance !== "0",
			showInstructionsForTestnetTokens: () =>
				setShowInstructionsForTestnetTokens(true),
			login,
			logout,
			balance,
		}),
		[user, ready, login, logout, balance, authenticated],
	);

	// Go to faucet.calibnet.chainsafe-fil.io and click Send Funds.
	// Paste your address into the address field and click Send funds:
	return (
		<AuthContext.Provider value={value}>
			{children}
			{showInstructionsForTestnetTokens && (
				<Modal
					wrapperWidth="max-w-xl"
					open
					bodyClassName="px-6 pt-4 pb-6"
					close={() => setShowInstructionsForTestnetTokens(false)}
				>
					<div className=" text-sm">
						<h3 className="text-lg font-bold">Testnet tokens required</h3>
						<p className="text-sm text-gray-700 mb-6">
							You need testnet tokens to interact with the application. You can
							get testnet tokens from the faucet.
						</p>
						<div className="px-4 py-2 border border-gray-100 rounded bg-blue-50 mb-6">
							<div>Active Address</div>
							<div className="font-semibold bg-">{user?.wallet?.address}</div>
						</div>
						<div>
							<div className="font-medium mb-2">
								To get testnet tokens, follow these steps:
							</div>
							<div>
								<div>1. Copy the 'active address' above</div>
								<div>
									2. Visit{" "}
									<a
										href="https://faucet.calibnet.chainsafe-fil.io/funds.html"
										target="_blank"
										rel="noreferrer"
										className="text-blue-600"
									>
										faucet.calibnet.chainsafe-fil.io
									</a>
								</div>
								<div>
									3. Paste your address into the address field and click Send
									funds.
								</div>
								<div>
									4. Wait for the transaction to be confirmed and refresh this
									page
								</div>
							</div>
						</div>
					</div>
				</Modal>
			)}
		</AuthContext.Provider>
	);
}
