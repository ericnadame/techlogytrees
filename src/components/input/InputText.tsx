import { LoadingOutlined } from "@/components/icons/LoadingOutlined";
import { InputLabel } from "@/components/input/InputLabel";
import clsx from "clsx";
import * as React from "react";
import { ReactNode } from "react";

export interface BaseInputProps<T>
	extends Omit<
		React.InputHTMLAttributes<HTMLInputElement>,
		"value" | "defaultValue" | "onChange" | "className"
	> {
	value: T | undefined;
	onChange(value: T): void;
	loading?: boolean;
	icon?: ReactNode;
	wrapperClassName?: string;
	className?: string;
	tabIndex?: number;
	label?: string;
	isValid?: boolean;
}

export type InputTextProps = BaseInputProps<string> & {
	suffixIcon?: React.ReactNode;
};

function InputText({
	value = "",
	onChange,
	onBlur,
	wrapperClassName,
	className,
	icon,
	loading,
	tabIndex,
	disabled,
	suffixIcon,
	label,
	isValid = true,
	...inputProps
}: InputTextProps) {
	const [focus, setFocus] = React.useState(false);

	function handleFocus(): void {
		setFocus(true);
	}

	function handleBlur(): void {
		setFocus(false);
	}

	async function handleChange({
		currentTarget: { value: newValue },
	}: React.ChangeEvent<HTMLInputElement>) {
		if (typeof onChange === "function") {
			onChange(newValue);
		}
	}

	return (
		<div className="w-full">
			{label && <InputLabel label={label} />}
			<div
				className={clsx(
					"leading-11 m-0 flex h-11 w-full rounded border border-gray-200 p-0 align-middle shadow-none transition-all duration-300",
					{
						"ring-1": focus,
						"hover:border-blue-300 hover:shadow-blue-300": !focus && isValid,
						"border-blue-300 shadow-blue-300": focus && isValid,
						"border-red-300 hover:shadow-red-300": !focus && !isValid,
						"border-red-300 ring-red-300 shadow-red-300": focus && !isValid,
						"bg-gray-100 hover:!border-gray-300 hover:!shadow-none opacity-70":
							disabled,
					},
					wrapperClassName,
				)}
				onFocus={handleFocus}
				onBlur={handleBlur}
			>
				{icon && <div className="flex h-full items-center pl-3">{icon}</div>}
				<input
					value={value}
					onChange={handleChange}
					onBlur={onBlur}
					tabIndex={tabIndex}
					className={clsx(
						"leading-11 h-full w-full rounded border-0 p-0 px-3 text-sm text-black outline-none transition-all duration-300 ease-in",
						{ "cursor-not-allowed": disabled },
						className,
					)}
					disabled={disabled}
					autoComplete="off"
					role="textbox"
					{...inputProps}
				/>
				{loading ? (
					<div className="flex h-full items-center">
						<LoadingOutlined className="float-right ml-2 mr-4" />
					</div>
				) : (
					suffixIcon && (
						<div className="ml-2 mr-4 flex h-full items-center">
							{suffixIcon}
						</div>
					)
				)}
			</div>
		</div>
	);
}

export default InputText;
