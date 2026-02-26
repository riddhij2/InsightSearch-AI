import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface SearchSource {
  title: string;
  url: string;
}

export interface SearchResponse {
  answer: string;
  sources: SearchSource[];
  relatedQuestions: string[];
}

export async function performSearch(query: string): Promise<SearchResponse> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: `You are an AI search assistant similar to Perplexity. 
        Provide a concise, accurate answer based on the search results. 
        Always cite your sources using [1], [2], etc.
        At the very end of your response, you MUST include a section starting with the exact text "Related Questions:" followed by 3 numbered follow-up questions.
        Format the response clearly with markdown.`,
      },
    });

    const text = response.text || "No response generated.";
    
    // Extract sources from grounding metadata
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: SearchSource[] = chunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title || "Source",
        url: chunk.web.uri,
      }));

    // Split text to extract related questions if they exist at the end
    let answer = text;
    let relatedQuestions: string[] = [];

    const relatedIndex = text.toLowerCase().lastIndexOf("related questions:");
    if (relatedIndex !== -1) {
      answer = text.substring(0, relatedIndex).trim();
      const relatedPart = text.substring(relatedIndex + "related questions:".length);
      relatedQuestions = relatedPart
        .split("\n")
        .map(q => q.replace(/^\d+\.\s*/, "").replace(/^- \s*/, "").replace(/^\*\s*/, "").trim())
        .filter(q => q.length > 5) // Ensure it's a real question
        .slice(0, 3);
    }
    
    return {
      answer: answer,
      sources: sources,
      relatedQuestions: relatedQuestions.length > 0 ? relatedQuestions : [
        "Tell me more about this.",
        "What are the implications?",
        "Can you summarize the key points?"
      ],
    };
  } catch (error) {
    console.error("Search error:", error);
    throw error;
  }
}
