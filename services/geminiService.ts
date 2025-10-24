
import { GoogleGenAI, Type } from "@google/genai";
import { ProductData, FullProductData, PlatformRecommendation, Ticket, AIPrompt } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getPlatformRecommendation = async (data: ProductData): Promise<PlatformRecommendation> => {
    const prompt = `
        Product Name: ${data.projectName}
        Description: ${data.description}
        Target Audience: ${data.targetAudience}
        Problem it Solves: ${data.problemToSolve}
        Core Features:
        ${data.features}

        Based on these details, recommend the best platform (e.g., Web App, Mobile App, Desktop App, Browser Extension) and provide a justification.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            systemInstruction: `You are a senior product manager and software architect. Your task is to recommend the ideal platform for a new product. Respond in JSON format.`,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    platform: {
                        type: Type.STRING,
                        description: "The recommended platform (e.g., 'Web Application', 'Cross-Platform Mobile App')."
                    },
                    justification: {
                        type: Type.STRING,
                        description: "A detailed explanation for why this platform is the best choice."
                    }
                },
                required: ["platform", "justification"]
            }
        }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as PlatformRecommendation;
};

export const generatePRD = async (data: FullProductData): Promise<string> => {
    const prompt = `
        Product Name: ${data.projectName}
        Platform: ${data.platform}
        Description: ${data.description}
        Target Audience: ${data.targetAudience}
        Problem it Solves: ${data.problemToSolve}
        Core Features / User Stories:
        ${data.features.split('\n').map(f => `- ${f}`).join('\n')}

        Generate a comprehensive Product Requirements Document (PRD) based on these details.
        Format the output as a single block of well-structured Markdown. Use headings (#, ##, ###), lists (*), and bold text (**) to create a clean, readable document.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            systemInstruction: `You are an expert product manager. Create a detailed and well-structured PRD in Markdown format. The sections should include Introduction, Product Goals, Target Audience, User Stories/Features, Functional Requirements, and Non-Functional Requirements.`,
        }
    });

    return response.text;
};

export const generateTickets = async (data: FullProductData): Promise<Ticket[]> => {
    const prompt = `
        Product Name: ${data.projectName}
        Platform: ${data.platform}
        Core Features / User Stories:
        ${data.features}

        Generate development tickets for these features.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            systemInstruction: `You are a senior scrum master. Create a list of tickets for a system like Jira. For each ticket, provide a title, a short description, and a list of acceptance criteria in 'Given-When-Then' format. Respond in JSON format.`,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        acceptanceCriteria: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    },
                    required: ["title", "description", "acceptanceCriteria"]
                }
            }
        }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as Ticket[];
};

export const generateAIPrompts = async (data: FullProductData): Promise<AIPrompt[]> => {
    const prompt = `
        Product Name: ${data.projectName}
        Platform: ${data.platform}
        Core Features / User Stories:
        ${data.features}

        Create AI code generation prompts for these features. The target stack is React, TypeScript, and Tailwind CSS.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            systemInstruction: `You are an expert AI prompt engineer specializing in creating instructions for large language models to generate code. For each feature listed, create a detailed and clear prompt that can be given directly to another AI code generator. Each prompt must be a complete instruction set for building a single React component. The prompt should: 1. Start with a clear persona for the AI (e.g., "You are an expert frontend developer specializing in React with TypeScript and Tailwind CSS."). 2. Specify the exact filename for the component (e.g., 'UserProfile.tsx'). 3. Detail the component's purpose and functionality. 4. List all necessary props, including their types. 5. Describe the required state variables and their purpose. 6. Provide a step-by-step implementation guide, including HTML structure (using semantic elements), Tailwind CSS classes for styling, and any logic for event handlers or data manipulation. 7. The final output from the AI should be a single, complete code block for the specified file. The prompt itself should be a clear, direct instruction, not a code comment. Respond in JSON format.`,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        ticketTitle: { type: Type.STRING },
                        generationPrompt: { type: Type.STRING }
                    },
                    required: ["ticketTitle", "generationPrompt"]
                }
            }
        }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as AIPrompt[];
};
