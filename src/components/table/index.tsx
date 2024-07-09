import clsx from "clsx";
import Link from "next/link";
import React from "react";

interface ColumnHeaderCell {
	label: string;
	columnSpan?: number;
}

interface TableContentCell {
	children: React.ReactNode;
	columnSpan?: number;
	className?: string;
}

interface TableHeaderProps {
	headers: ColumnHeaderCell[];
	withBorder?: boolean;
	withPadding?: boolean;
	children: React.ReactNode;
}

export function TableCell({
	children,
	columnSpan = 1,
	className,
}: TableContentCell) {
	return (
		<div
			style={{
				width: `${(columnSpan * 100) / 12}%`,
			}}
			className={className}
		>
			{children}
		</div>
	);
}

export function TableRow({
	children,
	index,
	onClick,
	href,
}: {
	children: React.ReactNode;
	index: number;
	onClick?(): void;
	href?: string;
}) {
	const Component = href ? Link : "div";
	return (
		<Component
			href={href || ""}
			onClick={onClick}
			className={clsx(
				"w-full flex px-4 text-xs justify-start items-center border-b border-gray-100 last:border-0 py-2",
				index % 2 === 0 ? "bg-gray-50/75" : "bg-white",
				onClick && "cursor-pointer hover:bg-blue-50/50",
				`group/tablerow-${index}`,
			)}
		>
			{children}
		</Component>
	);
}

function TableRowColumn({ label, columnSpan = 1 }: ColumnHeaderCell) {
	return (
		<div
			style={{
				width: `${(columnSpan * 100) / 12}%`,
			}}
			className={clsx("text-gray-400 text-xs font-semibold")}
		>
			{label}
		</div>
	);
}

export function Table({
	children,
	headers,
	withBorder = true,
	withPadding = true,
}: TableHeaderProps) {
	return (
		<>
			<div
				className={clsx(
					"horizontal pb-2",
					withBorder && "border-b border-gray-100",
					withPadding && "px-4 ",
				)}
			>
				{headers.map((header, index) => (
					<TableRowColumn key={`${index}`} {...header} />
				))}
			</div>
			{children}
		</>
	);
}
