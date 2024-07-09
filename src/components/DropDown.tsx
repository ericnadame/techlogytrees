import React, {
	MouseEvent,
	ReactNode,
	useEffect,
	useRef,
	useState,
} from "react";

import clsx from "clsx";
import Link from "next/link";

export interface DropdownMenuItemProps {
	label: string;
	href?: string;
	id: string;
	onClick?: (event: MouseEvent<HTMLElement>) => void;
	icon?: React.ReactNode;
}

interface MenuDropdownProps {
	children: ReactNode;
	menu: DropdownMenuItemProps[];
	visible?: boolean;
}

function DropDown({ children, menu, visible = true }: MenuDropdownProps) {
	const dropdownRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState<boolean>(false);

	useEffect(() => {
		document.addEventListener("click", handleDocumentClick, false);
		return () => {
			document.removeEventListener("click", handleDocumentClick, false);
		};
	}, []);

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	function handleDocumentClick(event: any) {
		if (dropdownRef?.current && !dropdownRef.current.contains(event.target)) {
			setIsOpen(false);
		}
	}

	function handleChildClick(
		event: React.MouseEvent<HTMLElement>,
		menuItem: DropdownMenuItemProps,
	) {
		event.stopPropagation();
		menuItem.onClick && menuItem?.onClick?.(event);
		setIsOpen(false);
	}

	function handleMouseDown(event: MouseEvent<HTMLDivElement>) {
		if (event.type === "mousedown" && event.button !== 0) return;
		setIsOpen(true);
	}

	const dropdownMenu =
		visible && isOpen ? (
			<div
				className="overflow-y-auto right-0 absolute top-[100%] z-50 mt-1 list-none text-left bg-clip-padding bg-white rounded border outline-none shadow-sm"
				aria-expanded="true"
			>
				{menu.map((menuItem, menuItemIdx) => {
					const Component = menuItem.href ? Link : "div";
					return (
						<Component
							href={menuItem.href || ""}
							onClick={(e) => handleChildClick(e, menuItem)}
							key={`menu-section-${menuItem.id}`}
							className="py-3.5 px-6 clear-both !w-56 text-[0.80rem] flex items-center gap-x-2 text-gray-900 hover:text-blue-700 whitespace-nowrap cursor-pointer"
						>
							{menuItem?.icon && menuItem?.icon}
							{menuItem?.label}
						</Component>
					);
				})}
			</div>
		) : null;

	return (
		<div
			onMouseDown={handleMouseDown}
			ref={dropdownRef}
			className="overflow-visible relative h-full"
		>
			{children}
			{dropdownMenu}
		</div>
	);
}

export default DropDown;
