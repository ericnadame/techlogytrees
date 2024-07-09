import type { Config } from "tailwindcss";

const config: Config = {
	content: ["{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}"],
	theme: {
		extend: {
			fontSize: {
				xs: "0.75rem", // 12px
				sm: "0.875rem", // 14px
				base: "1rem", // 16px
				lg: "1.125rem", // 18px
				xl: "1.25rem", // 20px
				"2xl": "1.5rem", // 24px
				"3xl": "1.875rem", // 30px
				"4xl": "2.25rem", // 36px
				"5xl": "3rem", // 48px
				"6xl": "4rem", // 64px
				"7xl": "5rem", // 80px
			},
			backgroundColor: {
				primary: "#004560",
				secondary: "#287a93",
				third: "#91d3e2",
			},
			borderColor: {
				primary: "#004560",
				secondary: "#287a93",
				third: "#91d3e2",
			},
			colors: {
				primary: "#004560",
				secondary: "#287a93",
				third: "#91d3e2",
			},
		},
	},
	plugins: [],
};
export default config;
