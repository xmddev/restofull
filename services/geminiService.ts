import { GoogleGenAI, Type, Schema } from "@google/genai";
import { MenuItem, DailyStat } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

/**
 * Generates a creative description for a menu item based on its name and ingredients.
 */
export const generateMenuDescription = async (name: string, ingredients: string): Promise<string> => {
  if (!apiKey) return "Error: API Key no configurada.";

  try {
    const prompt = `Escribe una descripción apetitosa y profesional para un menú de restaurante de alta cocina.
    Plato: ${name}
    Ingredientes clave: ${ingredients}
    Mantén la descripción en una sola frase, elegante y persuasiva (máximo 25 palabras). Idioma: Español.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No se pudo generar la descripción.";
  } catch (error) {
    console.error("Gemini error:", error);
    return "Error al conectar con AI.";
  }
};

/**
 * Analyzes sales data to provide business insights.
 */
export const analyzeBusinessPerformance = async (data: DailyStat[]): Promise<{ insights: string[], strategy: string }> => {
  if (!apiKey) return { insights: ["Falta API Key"], strategy: "Configure su API Key para recibir consejos." };

  const dataStr = JSON.stringify(data);
  
  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      insights: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Lista de observaciones clave sobre los datos de ventas (max 3)."
      },
      strategy: {
        type: Type.STRING,
        description: "Una recomendación estratégica accionable para mejorar la próxima semana."
      }
    },
    required: ["insights", "strategy"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Actúa como un consultor de restaurantes experto. Analiza estos datos de ventas semanales: ${dataStr}. Provee insights y una estrategia.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const result = JSON.parse(response.text || "{}");
    return {
      insights: result.insights || [],
      strategy: result.strategy || ""
    };
  } catch (error) {
    console.error("Gemini analysis error:", error);
    return { insights: ["Error analizando datos"], strategy: "Intente más tarde." };
  }
};

/**
 * Chat with AI Assistant for restaurant management
 */
export const askAssistant = async (question: string): Promise<string> => {
  if (!apiKey) return "API Key no configurada.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Eres un gerente de restaurante veterano y experto en hospitalidad. Responde brevemente a esta consulta: "${question}".`,
    });
    return response.text || "";
  } catch (error) {
    return "Error de conexión.";
  }
};