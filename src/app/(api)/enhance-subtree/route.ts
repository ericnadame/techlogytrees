import { EdgeData, NodeData } from "@/typings";
import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({
	apiKey: process.env["ANTHROPIC_API_KEY"], // This is the default and can be omitted
});

interface RelatedNodesAndEdges {
	parents?: NodeData[];
	edges?: EdgeData[];
	subject?: NodeData;
	children?: NodeData[];
}

export async function POST(req: NextRequest) {
	const body: RelatedNodesAndEdges = await req.json();

	try {
		const message = await anthropic.messages.create({
			max_tokens: 4048,
			temperature: 0,
			system:
				"You're a scientific advisor specializing in creating research roadmaps. Your mission is to analyze the following nodes and their connections, and determine if they are appropriately specific within the broader research trajectory. If the nodes are too high-level or too low-level, create a new, more suitable set of nodes.\n\nMaintain the given nodeIds as they are used to connect existing nodes. You may update the title and other properties, but it's crucial that the JSON output can be directly integrated into the existing research roadmap.\n\n=== RESEARCH AND DEVELOPMENT TYPES ===\n1. Fundamental Research (TRL 1-2)\n2. Applied Research (TRL 2-4)\n3. Translational Research (TRL 3-5)\n4. Technology Development (TRL 4-7)\n5. Demonstration and Validation (TRL 6-8)\n6. Implementation and Deployment (TRL 8-9)\n7. Continuous Improvement\n8. Ultimate Objective\n\n=== OBJECT PROPERTIES ===\nNode:\n  id: string\n  title: string\n  description: string\n  type: enum(fundamental-research, applied-research, translational-research, technology-development, demonstration-validation, implementation-deployment, continuous-improvement, ultimate-objective)\n  trl: number (1-9)\n  state: enum(conceptual, emerging, established)\n  maturity: enum(nascent, developing, mature)\n  impact_potential: enum(low, medium, high)\n  resource_intensity: enum(low, medium, high)\n  interdisciplinary_level: enum(low, medium, high)\n  time_horizon: enum(short-term, medium-term, long-term)\n\nEdge:\n  source: string (nodeId)\n  target: string (nodeId)\n  relationship_type: enum(prerequisite, supportive, collaborative, iterative)\n  strength: enum(weak, moderate, strong)\n\nThis function allows you to generate an id for new nodes & edges:\n() => Math.random().toString(36).substring(2, 9)\n\n=== RESPONSE FORMAT ===\nONLY PROVIDE THE JSON OUTPUT WITHOUT ADDITIONAL CONTEXT",
			messages: [
				{
					role: "user",
					content: `
						 subject: ${JSON.stringify(body?.subject || [])}
						 parents: ${JSON.stringify(body?.parents || [])}
						 children: ${JSON.stringify(body?.children || [])}
						 Edges: ${JSON.stringify(body?.edges || [])}
   				 `,
				},
			],
			model: "claude-3-5-sonnet-20240620",
		});
		const data =
			message.content?.map((item) => JSON.parse((item as any)?.text))?.[0] ||
			{};
		return NextResponse.json({ data: { ...data, expanded: true } });
	} catch (error) {
		console.error("Error while verifying", error);
		return NextResponse.error();
	}
}
