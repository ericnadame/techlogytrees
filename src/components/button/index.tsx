import clsx from "clsx";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { LoadingOutlined } from "../icons/LoadingOutlined";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	children?: React.ReactNode;
	variant?: "primary" | "default" | "black" | "secondary" | "danger";
	size?: "small" | "medium" | "large";
	ghost?: boolean;
	icon?: ReactNode;
	loading?: boolean;
	disabled?: boolean;
	className?: string;
	fullSize?: boolean;
	withAuth?: boolean;
};

export function Button({
	children,
	className,
	ghost = false,
	icon: Icon,
	size = "medium",
	variant,
	loading = false,
	disabled = false,
	fullSize,
	withAuth,
	...props
}: ButtonProps) {
	return (
		<button
			type="button"
			disabled={loading || disabled}
			{...props}
			className={clsx(
				"group !no-underline rounded border transition-colors focus:outline-none",
				{
					"!bg-transparent": ghost && variant !== "primary",
					"group-hover:brightness-120 group-hover:border-primary/75 group-focus:brightness-90 bg-primary border-primary/50":
						variant === "primary",
					"group-hover:brightness-110 group-focus:brightness-90 bg-secondary border-secondary":
						variant === "secondary",
					"bg-white border-gray-200 group-hover:border-gray-700":
						variant === "default",
					"bg-black border-gray-900": variant === "black",
					"group-hover:brightness-110 group-focus:brightness-90 bg-red-600 border-red-600":
						variant === "danger",
					"py-1.5 px-2 space-x-2 text-xs": size === "small",
					"py-2.5 px-2.5 space-x-2 text-sm": size === "medium",
					"py-3 px-4 space-x-2 text-base": size === "large",
					"disabled:cursor-not-allowed disabled:opacity-50": disabled,
					"w-full": fullSize,
				},
				className,
			)}
		>
			<div
				className={clsx(
					"flex h-full w-full items-center gap-x-2 leading-none justify-center transition",
					{
						"text-white group-hover:brightness-110 group-focus:brightness-90":
							variant === "primary" && !ghost,
						"group-hover:brightness-110 group-focus:brightness-90 text-primary":
							variant === "primary" && ghost,
						"group-hover:brightness-110 group-focus:brightness-90 text-secondary":
							variant === "secondary" && ghost,
						"text-secondary-500 group-hover:text-secondary":
							variant === "default",
						"text-white":
							variant === "danger" || (variant === "black" && !ghost),
						"text-black":
							variant === "secondary" || (variant === "black" && ghost),
					},
				)}
			>
				<>
					{Icon ||
						(loading && (
							<span
								className={clsx({
									"w-3 h-3": size === "small",
									"w-4 h-4": size === "medium" || size === "large",
								})}
							>
								{loading ? <LoadingOutlined /> : Icon}
							</span>
						))}
					{children}
				</>
			</div>
		</button>
	);
}
