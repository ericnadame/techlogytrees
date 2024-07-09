import React from "react";

export interface InputLabelProps {
	label: string;
	className?: string;
}

export function InputLabel({ label }: InputLabelProps) {
	return <label className=" text-gray-700 text-sm block mb-1.5">{label}</label>;
}
