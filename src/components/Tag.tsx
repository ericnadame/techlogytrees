import clsx from "clsx";
import { ReactNode } from "react";

interface TagProps {
	children?: ReactNode;
	color?: "blue" | "green" | "gray" | "red" | "yellow";
	fontWeight?: "normal" | "medium" | "bold";
	fontSize?: "xs" | "sm" | "md" | "lg";
	className?: string;
}

export function Tag({
	children,
	color = "gray",
	fontWeight = "medium",
	fontSize = "xs",
	className,
}: TagProps) {
	return (
		<span
			className={clsx("px-1.5 py-0.5 rounded-md", {
				"bg-blue-100 text-blue-700": color === "blue",
				"bg-green-100 text-green-700": color === "green",
				"bg-gray-100 text-gray-700": color === "gray",
				"bg-red-100 text-red-700": color === "red",
				"bg-yellow-100 text-yellow-700": color === "yellow",
				"font-medium": fontWeight === "medium",
				"font-bold": fontWeight === "bold",
				"text-[12px]": fontSize === "xs",
				"text-xs": fontSize === "sm",
				"text-md": fontSize === "md",
				"text-base": fontSize === "lg",
				className,
			})}
		>
			{children}
		</span>
	);
}
