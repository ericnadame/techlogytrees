import * as React from "react";

import clsx from "clsx";
import { Icon, IconProps } from "./Icon";

export function EdgeOutlined(props: IconProps) {
	return (
		<Icon {...props} viewBox="0 0 16 16">
			<path
				fill="currentColor"
				fillRule="evenodd"
				d="M0 7.75A3 3 0 015.905 7h4.19a3.001 3.001 0 110 1.5h-4.19A3.001 3.001 0 010 7.75zm3-1.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm10 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"
				clipRule="evenodd"
			/>
		</Icon>
	);
}
