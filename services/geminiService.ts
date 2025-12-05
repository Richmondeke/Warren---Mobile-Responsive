
import { GoogleGenAI, Type } from "@google/genai";
import { Entity, GeminiMatchResult, MatchingProfile } from '../types';

let genAI: GoogleGenAI | null = null;

try {
  if (process.env.API_KEY) {
    genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
} catch (error) {
  console.error("Error initializing Gemini API:", error);
}

export const analyzeSmartMatch = async (
  profile: MatchingProfile, 
  availableEntities: Entity[]
): Promise<GeminiMatchResult[]> => {
  if (!genAI) {
    console.warn("Gemini API key not found. Returning empty match results.");
    return [];
  }

  // Optimize context size
  const entitiesContext = JSON.stringify(availableEntities.map(e => ({
    id: e.id,
    name: e.name,
    desc: e.description,
    focus: e.focusAreas,
    checks: `${e.minCheckSize || '0'} - ${e.maxCheckSize || 'Unlimited'}`,
    loc: e.location
  })));

  const prompt = `
    You are an expert investment banker and deal matchmaker.
    
    Startup Profile:
    - Name: ${profile.companyName}
    - Industry: ${profile.industry}
    - Stage: ${profile.stage}
    - Seeking Capital: $${profile.raiseAmount}
    - Location: ${profile.location}
    - Context/Deck Summary: "${profile.description}"

    Task:
    Analyze the "Available Database of Investors" below and identify the Top 3 best matches for this specific startup.
    Consider investment stage, check size fit (if available), industry focus, and location relevance.
    
    Available Database of Investors:
    ${entitiesContext}

    Return a JSON array of objects with:
    - entityId (string)
    - score (number 0-100)
    - rationale (string, explain specifically why this investor fits the deck provided)
  `;

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              entityId: { type: Type.STRING },
              score: { type: Type.NUMBER, description: "Match score between 0 and 100" },
              rationale: { type: Type.STRING }
            },
            required: ["entityId", "score", "rationale"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    return JSON.parse(text) as GeminiMatchResult[];
  } catch (error) {
    console.error("Gemini Smart Match Error:", error);
    return [];
  }
};

export const generateDealDescription = async (
  inputs: { companyName: string; industry: string; keyHighlights: string }
): Promise<string> => {
  if (!genAI) return "API Key missing. Cannot generate description.";

  const prompt = `
    Write a professional, anonymized deal teaser description (max 150 words) for a search fund acquisition target.
    
    Company Name (for context, keep anonymized in output): ${inputs.companyName}
    Industry: ${inputs.industry}
    Highlights: ${inputs.keyHighlights}

    Tone: Professional, enticing to investors, confidential.
  `;

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });
    return response.text || "Could not generate description.";
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    return "Error generating description.";
  }
};
