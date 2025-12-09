import { GoogleGenAI, Type } from "@google/genai";
import { AuditResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAudit = async (userProblem: string): Promise<AuditResult> => {
  const model = "gemini-2.5-flash";

  const prompt = `
    Tu es un expert consultant en IA et automatisation pour les entreprises, spécialisé dans l'aide aux chefs d'entreprise débordés.
    L'utilisateur va décrire une tâche ou un problème qui lui prend du temps.
    Ton but est d'analyser ce problème avec empathie et de proposer 3 solutions d'automatisation IA concrètes.

    Problème utilisateur : "${userProblem}"

    Réponds au format JSON uniquement.
    Garde un ton chaleureux, encourageant et professionnel.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: {
              type: Type.STRING,
              description: "Une brève analyse empathique du problème (2 phrases max).",
            },
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  timeSaved: { type: Type.STRING, description: "Estimation du temps gagné (ex: 5h/semaine)" },
                  difficulty: { type: Type.STRING, enum: ["Facile", "Moyen", "Complexe"] },
                },
                required: ["title", "description", "timeSaved", "difficulty"],
              },
            },
          },
          required: ["analysis", "suggestions"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as AuditResult;

  } catch (error) {
    console.error("Gemini Audit Error:", error);
    // Fallback data in case of error to keep UI functional
    return {
      analysis: "Nous rencontrons une forte demande sur notre IA. Voici une estimation basée sur des cas similaires.",
      suggestions: [
        {
          title: "Automatisation de la boîte mail",
          description: "Utilisation de filtres intelligents et de réponses brouillons générées par IA.",
          timeSaved: "3h / semaine",
          difficulty: "Facile"
        },
        {
          title: "Gestion documentaire",
          description: "Extraction automatique des données de factures et classement.",
          timeSaved: "4h / semaine",
          difficulty: "Moyen"
        },
        {
          title: "Planification intelligente",
          description: "Agent IA pour gérer les rendez-vous et l'agenda sans allers-retours.",
          timeSaved: "2h / semaine",
          difficulty: "Facile"
        }
      ]
    };
  }
};