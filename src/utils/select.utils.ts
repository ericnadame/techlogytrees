import { NodeTypeValues, SelectOptionItem } from "@/typings";

export function parseTypeToSearchFieldItems(
	hasEndGoalInNodes: boolean,
): SelectOptionItem[] {
	const values =
		NodeTypeValues.map((item) => ({
			label: item.toLowerCase(),
			value: item,
		})) || [];
	if (!hasEndGoalInNodes) {
		return values;
	}
	return values.filter((item) => item.value !== "ultimate-objective");
}
