import * as React from "react";

import { Icon, IconProps } from "./Icon";

export function HeadingOneOutlined(props: IconProps) {
	return (
		<Icon {...props} viewBox="0 0 24 24" className="fill-none">
			<path
				id="Vector"
				d="M16 10L19 9L19 19M3 5V12M3 12V19M3 12H11M11 5V12M11 12V19"
				stroke="#000000"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</Icon>
	);
}
