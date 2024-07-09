import {
	EdgeData,
	NodeData,
	NodeType,
	TechTreeLayoutEdge,
	TechTreeLayoutNode,
} from "@/typings";
import dagre from "dagre";

export const generateId = () => Math.random().toString(36).substring(2, 9);
export const defaultPosition = { x: 0, y: 0 };
export const edgeType = "smoothstep";

export const nodeWidth = 350;
export const nodeHeight = 75;

export function transformTechTreeDataToNode({
	id,
	...data
}: NodeData): TechTreeLayoutNode {
	return {
		id,
		type: "tech-tree",
		data: data,
		position: defaultPosition,
	};
}

export function transformEdgeDataToLayoutEdge(
	data: EdgeData,
): TechTreeLayoutEdge {
	return {
		...data,
		type: edgeType,
	};
}

// A sort function for an edges map that sorts based on which level down the tree of the furthest target value
// TODO

export function getLayoutElements(
	nodes: NodeData[] = [],
	edges: EdgeData[] = [],
	activeNode?: NodeData,
): { nodes: TechTreeLayoutNode[]; edges: TechTreeLayoutEdge[] } {
	const initialNodes = nodes.map(transformTechTreeDataToNode);
	const initialEdges = edges.map((edge) => {
		const isEdgeActive =
			edge.source === activeNode?.id || edge.target === activeNode?.id;
		return {
			...edge,
			type: edgeType,
			animated: !isEdgeActive,
			style: isEdgeActive ? { stroke: "#000" } : {},
		};
	});

	const dagreGraph = new dagre.graphlib.Graph();
	dagreGraph.setDefaultEdgeLabel(() => ({}));
	dagreGraph.setGraph({ rankdir: "LR" });

	initialNodes.forEach((node) => {
		dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
	});

	initialEdges.forEach((edge) => {
		dagreGraph.setEdge(edge.source, edge.target);
	});

	dagre.layout(dagreGraph);

	initialNodes.forEach((node) => {
		const nodeWithPosition = dagreGraph.node(node.id);
		// @ts-ignore
		node.targetPosition = "left";
		// @ts-ignore
		node.sourcePosition = "right";

		// We are shifting the dagre node position (anchor=center center) to the top left
		// so it matches the React Flow node anchor point (top left).
		node.position = {
			x: nodeWithPosition.x - nodeWidth / 2,
			y: nodeWithPosition.y - nodeHeight / 2,
		};

		return node;
	});

	const uniqueNodes = new Map(initialNodes.map((node) => [node.id, node]));
	const uniqueEdges = new Map(initialEdges.map((edge) => [edge.id, edge]));

	initialNodes.forEach((node) => uniqueNodes.set(node.id, node));
	initialEdges.forEach((edge) => uniqueEdges.set(edge.id, edge));

	return {
		nodes: Array.from(uniqueNodes.values()),
		edges: Array.from(uniqueEdges.values()),
	};
}

export function areAllNodesConnected(
	nodes: NodeData[] = [],
	edges: EdgeData[] = [],
): boolean {
	if (nodes.length === 0) return true; // An empty graph is trivially connected
	const adjList: { [key: string]: string[] } = {};

	// Initialize adjacency list
	nodes.forEach((node) => {
		adjList[`${node.id}`] = [];
	});

	edges.forEach((edge) => {
		adjList[edge.source].push(edge.target);
		adjList[edge.target].push(edge.source); // Assuming undirected graph for bidirectional connection
	});

	// Function to perform DFS
	const dfs = (nodeId: string, visited: Set<string>) => {
		visited.add(nodeId);
		adjList[nodeId].forEach((neighbor) => {
			if (!visited.has(neighbor)) {
				dfs(neighbor, visited);
			}
		});
	};

	// Perform DFS from the first node
	const visited = new Set<string>();
	if (nodes[0]) dfs(`${nodes[0]?.id}`, visited);

	// Check if all nodes were visited
	return nodes.length === visited.size;
}

export function getNodeTypeBgColor(
	type: NodeType,
	theme: "light" | "dark",
): string {
	const colors: Record<NodeType, any> = {
		"ultimate-objective": {
			light: "bg-green-50",
			dark: "bg-green-800",
		},
		"fundamental-research": {
			light: "bg-blue-50",
			dark: "bg-blue-800",
		},
		"technology-development": {
			light: "bg-yellow-50",
			dark: "bg-yellow-800",
		},
		"continuous-improvement": {
			light: "bg-red-50",
			dark: "bg-red-800",
		},
		"translational-research": {
			light: "bg-indigo-50",
			dark: "bg-indigo-800",
		},
		"implementation-deployment": {
			light: "bg-pink-50",
			dark: "bg-pink-800",
		},
		"demonstration-validation": {
			light: "bg-gray-50",
			dark: "bg-gray-800",
		},
		"applied-research": {
			light: "bg-purple-50",
			dark: "bg-purple-800",
		},
	};
	return colors[type][theme];
}

export function getNodeTypeColor(type: NodeType): string {
	switch (type) {
		case "ultimate-objective":
			return "bg-green-50 border-green-600 text-green-800";
		case "fundamental-research":
			return "bg-blue-50 border-blue-600 text-blue-800";
		case "technology-development":
			return "bg-yellow-50 border-yellow-600 text-yellow-800";
		case "continuous-improvement":
			return "bg-red-50 border-red-600 text-red-800";
		case "translational-research":
			return "bg-indigo-50 border-indigo-600 text-indigo-800";
		case "implementation-deployment":
			return "bg-pink-50 border-pink-600 text-pink-800";
		case "demonstration-validation":
			return "bg-gray-50 border-gray-600 text-gray-800";
		default:
			return "bg-gray-50 border-gray-600 text-gray-800";
	}
}
