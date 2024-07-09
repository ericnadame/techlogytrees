import clsx from "clsx";

interface EthAvatarProps {
	address: string;
	size?: "sm" | "md" | "lg";
}

export function EthAvatar({ address, size = "md" }: EthAvatarProps) {
	function getGradientColors() {
		const seedArr = address.match(/.{1,7}/g)?.splice(0, 5);
		const colors: string[] = [];

		seedArr?.forEach((seed) => {
			let hash = 0;
			for (let i = 0; i < seed.length; i += 1) {
				hash = seed.charCodeAt(i) + ((hash << 5) - hash);
				hash = hash & hash;
			}

			const rgb = [0, 0, 0];
			for (let i = 0; i < 3; i += 1) {
				const value = (hash >> (i * 8)) & 255;
				rgb[i] = value;
			}
			colors.push(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
		});

		return colors;
	}

	const colors = getGradientColors();

	return (
		<div
			className={clsx("rounded-full", {
				"w-6 h-6": size === "md",
				"w-16 h-16": size === "lg",
			})}
			style={{
				borderRadius: "50%",
				boxShadow: "inset 0 0 0 1px rgba(0, 0, 0, 0.1)",
				backgroundColor: colors[0],
				backgroundImage: `
          radial-gradient(at 66% 77%, ${colors[1]} 0px, transparent 50%),
          radial-gradient(at 29% 97%, ${colors[2]} 0px, transparent 50%),
          radial-gradient(at 99% 86%, ${colors[3]} 0px, transparent 50%),
          radial-gradient(at 29% 88%, ${colors[4]} 0px, transparent 50%)
        `,
			}}
		/>
	);
}
