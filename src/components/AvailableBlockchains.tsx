import DropDown, { DropdownMenuItemProps } from "@/components/DropDown";
import { DownOutlined } from "@/components/icons/DownOutlined";
import { FilecoinFilled } from "@/components/icons/FilecoinFilled";
import { HardHatFilled } from "@/components/icons/HardHatFilled";

import React, { ReactNode } from "react";
import { filecoinCalibration, hardhat } from "viem/chains";
import { useChainId, useSwitchChain } from "wagmi";
import { ThetaFilled } from "./icons/ThetaFilled";

const NetworkIcons: Record<string, ReactNode> = {
  [`${filecoinCalibration.id}`]: <ThetaFilled className="text-xl" />,
  //   [`${filecoinCalibration.id}`]: <FilecoinFilled className="text-xl" />,
  [`${hardhat.id}`]: <HardHatFilled className="text-xl" />,
};

export function AvailableBlockchains() {
  const chainId = useChainId();
  const { chains, switchChain } = useSwitchChain();

  const activeChain = chains?.find((a) => chainId === Number(a?.id));
  const options: DropdownMenuItemProps[] = chains?.map((chain) => ({
    onClick: () => handleChainChange(chain.id),
    label: chain?.name,
    icon: NetworkIcons[chain.id],
    id: `${chain.id}`,
  }));

  function handleChainChange(chainId: number) {
    const chain = chains?.find((c) => c.id === chainId);
    if (chain) {
      switchChain({ chainId: chain.id });
    }
  }

  return (
    <DropDown menu={options}>
      <div className="flex items-center cursor-pointer rounded-full leading-none space-x-2">
        {activeChain?.id && NetworkIcons[activeChain?.id]}
        <span className="capitalize text-xs font-medium">
          {activeChain?.name || "no active network"}
        </span>
        <DownOutlined className="text-[10px]" />
      </div>
    </DropDown>
  );
}
