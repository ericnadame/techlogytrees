"use client";

import { EthAvatar } from "@/components/EthAvatar";
import { FullLogo } from "@/components/FullLogo";
import { CaretDownOutlined } from "@/components/icons/CaretDownOutlined";
import { getShortenedFormat } from "@/utils/string.utils";

import { AccountModal } from "@/components/AccountModal";
import { AvailableBlockchains } from "@/components/AvailableBlockchains";
import { Button } from "@/components/button";
import { useAuth } from "@/providers/AuthProvider";
import Link from "next/link";
import React from "react";
import { Toaster } from "react-hot-toast";

export function Header() {
  const { account, login } = useAuth();

  const [showAccountDetails, setShowAccountDetails] = React.useState(false);
  return (
    <>
      <header className="w-full px-4 h-16 z-20 flex items-center text-gray-800 justify-between">
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="w-[110px] font-semibold flex flex-row items-center text-white"
          >
            <FullLogo className="hover:!fill-blue-700" />
            <p className="text-gray-800 hidden md:block">TechnologyTree</p>
          </Link>
        </div>
        <div className="horizontal space-x-6">
          <AvailableBlockchains />
          {account ? (
            <div
              onClick={() => setShowAccountDetails(true)}
              className="h-full rounded cursor-pointer transition-colors pl-2 pr-4 py-1.5 hover:bg-blue-50 flex items-center space-x-2"
            >
              <EthAvatar address={account.address} />
              <div className="font-medium text-xs">
                {getShortenedFormat(account.address)}
              </div>
              <CaretDownOutlined className="text-[9px]" />
            </div>
          ) : (
            <Button
              ghost
              size="small"
              className="px-4 font-medium"
              variant="black"
              onClick={login}
            >
              Login
            </Button>
          )}
        </div>
      </header>
      {showAccountDetails && (
        <AccountModal close={() => setShowAccountDetails(false)} />
      )}
    </>
  );
}

export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-screen">
      <Header />
      <Toaster containerClassName="!text-xs" position="top-center" />
      <div className="h-[calc(100%-4rem)] w-full p-4 pt-0">
        <div className="p-2 h-full flex items-stretch rounded-lg bg-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
}
