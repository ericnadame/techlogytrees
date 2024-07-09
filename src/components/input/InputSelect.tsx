import { InputLabel } from "@/components/input/InputLabel";
import { SelectOptionItem } from "@/typings";
import React from "react";
import Select, { MultiValue, SingleValue } from "react-select";
import AsyncSelect from "react-select/async";

type SelectValue<T> = T extends true
	? MultiValue<SelectOptionItem>
	: SingleValue<SelectOptionItem> | undefined;

interface InputSelectProps<T extends boolean> {
	value: SelectValue<T>;
	onChange(value: SelectValue<T>): void;
	onInputChange?(value: string): void;
	onBlur?(): void;
	options?: SelectOptionItem[];
	loadOptions?(inputValue: string): Promise<SelectOptionItem[]>;
	name?: string;
	label?: string;
	placeholder?: string;
	required?: boolean;
	isSearchable?: boolean;
	isClearable?: boolean;
	isMulti: T;
}

export function InputSelect<T extends boolean>({
	value,
	onChange,
	onInputChange,
	options,
	placeholder,
	name = "input-select",
	label,
	required,
	isMulti,
	isSearchable = true,
	isClearable,
	loadOptions,
	onBlur,
}: InputSelectProps<T>) {
	const Component = loadOptions ? AsyncSelect : Select;
	return (
		<div>
			{label && <InputLabel label={label} />}
			<Component
				onBlur={onBlur}
				isSearchable={isSearchable}
				value={value}
				placeholder={placeholder}
				isMulti={isMulti}
				loadOptions={loadOptions}
				onInputChange={onInputChange}
				name={name}
				isClearable={isClearable}
				required={required}
				className="!text-xs !text-black"
				classNames={{
					control: () => " !border-gray-200 !text-black",
				}}
				onChange={onChange}
				options={options}
			/>
		</div>
	);
}
