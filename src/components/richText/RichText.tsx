import { EditorProvider } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import React from "react";

interface InputRichTextProps {
	value?: string;
}

export function RichText({ value }: InputRichTextProps) {
	let content;
	try {
		content = value && JSON.parse(value);
	} catch (e) {}
	return (
		<EditorProvider
			extensions={[StarterKit]}
			content={{
				type: "doc",
				content: [
					{
						type: "heading",
						attrs: { level: 2 },
						content: [{ type: "text", text: "Introduction" }],
					},
					{
						type: "paragraph",
						content: [
							{
								type: "text",
								text: "Cellulosic ethanol is a biofuel produced from lignocellulosic biomass. It represents a renewable alternative to fossil fuels and has the potential to reduce greenhouse gas emissions.",
							},
						],
					},
					{
						type: "heading",
						attrs: { level: 2 },
						content: [{ type: "text", text: "Feedstock" }],
					},
					{
						type: "paragraph",
						content: [
							{
								type: "text",
								text: "Common feedstocks for cellulosic ethanol include agricultural residues (e.g., corn stover, wheat straw), forestry residues, and dedicated energy crops (e.g., switchgrass, miscanthus). These materials are abundant and do not compete with food crops.",
							},
						],
					},
					{
						type: "heading",
						attrs: { level: 2 },
						content: [{ type: "text", text: "Production Process" }],
					},
					{
						type: "heading",
						attrs: { level: 3 },
						content: [{ type: "text", text: "Pretreatment" }],
					},
					{
						type: "paragraph",
						content: [
							{
								type: "text",
								text: "The biomass undergoes pretreatment to break down the complex lignocellulose structure, making the cellulose and hemicellulose more accessible for enzymatic hydrolysis. Methods include physical, chemical, and biological treatments.",
							},
						],
					},
					{
						type: "heading",
						attrs: { level: 3 },
						content: [{ type: "text", text: "Enzymatic Hydrolysis" }],
					},
					{
						type: "paragraph",
						content: [
							{
								type: "text",
								text: "Enzymes, such as cellulases and hemicellulases, break down the pretreated biomass into fermentable sugars. This step is critical for the efficiency of ethanol production.",
							},
						],
					},
					{
						type: "heading",
						attrs: { level: 3 },
						content: [{ type: "text", text: "Fermentation" }],
					},
					{
						type: "paragraph",
						content: [
							{
								type: "text",
								text: "Microorganisms, typically yeast or bacteria, ferment the sugars into ethanol. Advances in genetic engineering have led to more efficient strains capable of fermenting a wider range of sugars.",
							},
						],
					},
					{
						type: "heading",
						attrs: { level: 3 },
						content: [{ type: "text", text: "Distillation" }],
					},
					{
						type: "paragraph",
						content: [
							{
								type: "text",
								text: "The ethanol is separated from the fermentation broth through distillation, resulting in a high-purity biofuel. The remaining byproducts can be used for energy or as animal feed.",
							},
						],
					},
					{
						type: "heading",
						attrs: { level: 2 },
						content: [{ type: "text", text: "Advantages" }],
					},
					{
						type: "bulletList",
						content: [
							{
								type: "listItem",
								content: [
									{
										type: "paragraph",
										content: [
											{
												type: "text",
												text: "Utilizes non-food biomass, reducing competition with food supply.",
											},
										],
									},
								],
							},
							{
								type: "listItem",
								content: [
									{
										type: "paragraph",
										content: [
											{
												type: "text",
												text: "Potentially lower greenhouse gas emissions compared to fossil fuels.",
											},
										],
									},
								],
							},
							{
								type: "listItem",
								content: [
									{
										type: "paragraph",
										content: [
											{
												type: "text",
												text: "Abundance of feedstock materials.",
											},
										],
									},
								],
							},
						],
					},
					{
						type: "heading",
						attrs: { level: 2 },
						content: [{ type: "text", text: "Challenges" }],
					},
					{
						type: "bulletList",
						content: [
							{
								type: "listItem",
								content: [
									{
										type: "paragraph",
										content: [
											{
												type: "text",
												text: "High production costs compared to conventional ethanol.",
											},
										],
									},
								],
							},
							{
								type: "listItem",
								content: [
									{
										type: "paragraph",
										content: [
											{
												type: "text",
												text: "Technical difficulties in biomass pretreatment and enzymatic hydrolysis.",
											},
										],
									},
								],
							},
							{
								type: "listItem",
								content: [
									{
										type: "paragraph",
										content: [
											{
												type: "text",
												text: "Development of efficient and cost-effective enzymes and microorganisms.",
											},
										],
									},
								],
							},
						],
					},
					{
						type: "heading",
						attrs: { level: 2 },
						content: [
							{ type: "text", text: "Current Research and Development" },
						],
					},
					{
						type: "paragraph",
						content: [
							{
								type: "text",
								text: "Research is focused on improving pretreatment methods, developing more efficient enzymes and microorganisms, and reducing production costs. Pilot and demonstration plants are being developed to scale up the technology.",
							},
						],
					},
				],
			}}
			editable={false}
		/>
	);
}
