import { edgeType } from "@/utils/nodes.utils";
import { Node, Position } from "reactflow";

export interface FundingState {
	fundingRaised: number;
	fundingRequest: number;
	funders: number;
}

export type NodeStatus = "finished" | "in-progress" | "rfp" | "idle";
export type NodeOrigin = "on-chain" | "off-chain";

/*
 *
 * Research and Development Categories:
 * 1. Fundamental Research (TRL 1-2)
 * 2. Applied Research (TRL 2-4)
 * 3. Translational Research (TRL 3-5)
 * 4. Technology Development (TRL 4-7)
 * 5. Demonstration and Validation (TRL 6-8)
 * 6. Implementation and Deployment (TRL 8-9)
 * 7. Continuous Improvement
 * 8. Ultimate Objective: The final goal ('{{TITLE}}')
 *
 * */

export type NodeType =
	| "fundamental-research"
	| "applied-research"
	| "translational-research"
	| "technology-development"
	| "demonstration-validation"
	| "implementation-deployment"
	| "continuous-improvement"
	| "ultimate-objective";

export const NodeTypeValues: NodeType[] = [
	"fundamental-research",
	"applied-research",
	"translational-research",
	"technology-development",
	"demonstration-validation",
	"implementation-deployment",
	"continuous-improvement",
	"ultimate-objective",
];

/*state: enum(conceptual, emerging, established)
  maturity: enum(nascent, developing, mature)
  impact_potential: enum(low, medium, high)
  resource_intensity: enum(low, medium, high)
  interdisciplinary_level: enum(low, medium, high)
  time_horizon: enum(short-term, medium-term, long-term)
*/

export type NodeState = "conceptual" | "emerging" | "established";
export type NodeMaturity = "nascent" | "developing" | "mature";
export type NodeImpactPotential = "low" | "medium" | "high";
export type NodeResourceIntensity = "low" | "medium" | "high";
export type NodeInterdisciplinaryLevel = "low" | "medium" | "high";

export interface ResearchContribution {
	contributor: string;
	createdAt: Date;
	ipfsHash: string;
}

export interface RequestForProposal {
	writer?: string;
	createdAt: Date;
	ipfsHash: string;
}

export interface ResearchTreasury {
	amount: bigint;
	funder: string;
	fundedAt: Date;
}

export interface TechTree {
	title: string;
	id: bigint;
}

export interface NodeData {
	id: string;
	title?: string;
	description?: string;
	createdBy?: string;
	createdAt?: Date;
	origin?: NodeOrigin;
	type: NodeType;
	fundingState?: FundingState;
	rfp?: RequestForProposal;
	contributions?: ResearchContribution[];
	status?: NodeStatus;
	contributors?: Contributor[];
	treasury?: ResearchTreasury;
	isFinished?: boolean;
	techTreeId?: bigint;
	state?: NodeState;
	maturity?: NodeMaturity;
	impactPotential?: NodeImpactPotential;
	resourceIntensity?: NodeResourceIntensity;
	interdisciplinaryLevel?: NodeInterdisciplinaryLevel;
	trl?: number;
}

export interface EdgeData {
	id: string;
	source: string;
	target: string;
	origin?: NodeOrigin;
}

export interface TechTreeData {
	nodes: NodeData[];
	edges: EdgeData[];
}

export type TechTreeLayoutNode = Node<Omit<NodeData, "id">> & {
	targetPosition?: Position;
	sourcePosition?: Position;
};

export type TechTreeLayoutEdge = EdgeData & {
	type?: string;
	animate?: boolean;
	style?: React.CSSProperties;
};

export interface Contributor {
	address: string;
	ensName?: string;
}

export type TechTreeMode = "move" | "edit" | "enhance";
export type TechTreeAddType = "node" | "edge";

export interface SelectOptionItem {
	label: string;
	value: string;
}
