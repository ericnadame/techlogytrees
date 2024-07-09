import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({
	apiKey: process.env["NEXT_PUBLIC_ANTHROPIC_API_KEY"], // This is the default and can be omitted
});

export async function GET(req: NextRequest, params: { title: string }) {
	const title = req.nextUrl.searchParams.get("title") || "Omni Solar Panels";
	const id = req.nextUrl.searchParams.get("id");

	const message = await anthropic.messages.create({
		model: "claude-3-5-sonnet-20240620",
		max_tokens: 4048,
		temperature: 0,
		system:
			"As a scientific advisor specializing in research roadmaps, your task is to construct a comprehensive research trajectory culminating in '{{TITLE}}'. This trajectory should span the entire spectrum of research and development, from fundamental principles to practical implementation, while accounting for existing knowledge, emerging concepts, and novel areas of inquiry.\n\nConstruct a network of interconnected research nodes, with each connection representing relationships between different stages or aspects of research. Ensure all nodes and connections contribute meaningfully to the ultimate objective, eliminating extraneous elements.\n\nResearch and Development Categories:\n1. Fundamental Research (TRL 1-2)\n2. Applied Research (TRL 2-4)\n3. Translational Research (TRL 3-5)\n4. Technology Development (TRL 4-7)\n5. Demonstration and Validation (TRL 6-8)\n6. Implementation and Deployment (TRL 8-9)\n7. Continuous Improvement\n8. Ultimate Objective: The final goal ('{{TITLE}}')\n\n=== OBJECT PROPERTIES ===\nNode: \n  id: string\n  title: string\n  description: string\n  type: enum(fundamental-research, applied-research, translational-research, technology-development, demonstration-validation, implementation-deployment, continuous-improvement, ultimate-objective)\n  trl: number (1-9)\n  state: enum(conceptual, emerging, established)\n  maturity: enum(nascent, developing, mature)\n  impact_potential: enum(low, medium, high)\n  resource_intensity: enum(low, medium, high)\n  interdisciplinary_level: enum(low, medium, high)\n  time_horizon: enum(short-term, medium-term, long-term)\n\nEdge: \n  source: string (nodeId)\n  target: string (nodeId)\n  relationship_type: enum(prerequisite, supportive, collaborative, iterative)\n  strength: enum(weak, moderate, strong)\n\n=== HELPER FUNCTION ===\nFor generating unique identifiers, utilize:\n() => Math.random().toString(36).substring(2, 9)\n\nGuidelines:\n1. Ensure each node is appropriately categorized and its properties accurately reflect its nature and role in the research trajectory.\n2. Align Technology Readiness Levels (TRLs) with the appropriate research stages.\n3. Consider the state, maturity, potential impact, resource requirements, interdisciplinary nature, and time horizon for each research activity.\n4. Create meaningful connections between nodes, specifying the type and strength of each relationship.\n5. Maintain an appropriate level of abstraction, avoiding overly granular or speculative concepts.\n6. Include a balanced mix of established knowledge, emerging concepts, and areas requiring novel research.\n7. Ensure the entire trajectory logically progresses towards the ultimate objective.\n\n=== RESPONSE FORMAT ===\nPROVIDE ONLY THE JSON OUTPUT WITHOUT ADDITIONAL CONTEXT",
		messages: [
			{
				role: "user",
				content: [
					{
						type: "text",
						text: `Ultimate Objective  = '${title}' & Ultimate Objective ID = '${id}'`,
					},
				],
			},
		],
	});
	try {
		const data = message.content?.map((item) =>
			JSON.parse((item as any)?.text),
		);
		return NextResponse.json({ data: data?.[0] });
	} catch (error) {}
}
