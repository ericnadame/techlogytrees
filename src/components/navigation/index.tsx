"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";

export type NavigationItemProps = {
  label: string;
  icon?: ReactNode;
  href: string;
  isActive?: boolean;
};

interface Props {
  menu: NavigationItemProps[];
}

export function Navigation({ menu }: Props) {
  const pathname = usePathname();
  return (
    <div className="flex">
      {menu.map(({ href, label, icon, isActive }, idx) => (
        <Link
          key={`${idx}-${href}`}
          href={href}
          className={clsx(
            "flex items-center px-4 pb-2 pt-2 border-b hover:border-primary hover:text-primary",
            pathname === href || isActive
              ? "text-black font-medium border-black"
              : "border-gray-200 text-gray-600"
          )}
        >
          {icon && <span className="mr-2 ">{icon}</span>}
          <span className="text-xs">{label}</span>
        </Link>
      ))}
      <div className="w-full border-b border-gray-100" />
    </div>
  );
}
