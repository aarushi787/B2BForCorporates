
import { GoogleGenAI, Type } from "@google/genai";
import { Company, Deal } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const aiMatchCompanies = async (query: string, companies: Company[]) => {
  const companyData = companies.map(c => ({
    name: c.name,
    capabilities: c.capabilities,
    domain: c.domain,
    reputation: c.reputation,
    verified: c.verified
  }));

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Based on the user query: "${query}", analyze the following companies and recommend the top 3 best matches for a B2B collaboration. Return a JSON array of objects with company name and a brief reason for matching. Prioritize verified companies.
    
    Company List: ${JSON.stringify(companyData)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            companyName: { type: Type.STRING },
            reason: { type: Type.STRING }
          },
          required: ["companyName", "reason"]
        }
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateContract = async (type: 'NDA' | 'SOW', companyA: string, companyB: string, details: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Generate a professional, legally-sound ${type} agreement between ${companyA} and ${companyB}. Specific terms: ${details}. Format as a clean string.`,
  });
  return response.text;
};

export const analyzeDealRisk = async (deal: Deal, companies: Company[]) => {
  const buyer = companies.find(c => c.id === deal.buyerId);
  const sellers = companies.filter(c => deal.sellerIds.includes(c.id));
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the B2B deal risk.
    Buyer: ${buyer?.name} (Reputation: ${buyer?.reputation})
    Sellers: ${sellers.map(s => `${s.name} (Reputation: ${s.reputation}, Verified: ${s.verified})`).join(', ')}
    Deal Amount: $${deal.amount}
    Details: ${deal.notes}
    
    Provide a risk score (0-100, where 100 is highest risk) and 3 specific risk factors.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          factors: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          recommendation: { type: Type.STRING }
        },
        required: ["score", "factors", "recommendation"]
      }
    }
  });
  return JSON.parse(response.text);
};

export const generateAuditReport = async (company: Company) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a detailed B2B Audit Report for:
    Name: ${company.name}
    GST: ${company.gst}
    Revenue: $${company.revenue}
    On-Time Delivery: ${company.onTimeDelivery}%
    Completion Rate: ${company.dealCompletionRate}%
    
    Return JSON format for a verified audit report.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          score: { type: Type.NUMBER },
          summary: { type: Type.STRING },
          financialHealth: { type: Type.STRING },
          operationalCompliance: { type: Type.STRING }
        },
        required: ["title", "score", "summary", "financialHealth", "operationalCompliance"]
      }
    }
  });
  return JSON.parse(response.text);
};

export const generateMarketTrends = async (category: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Provide 3 short, data-driven market trends for the ${category} B2B sector for 2024. Return as a JSON array of strings.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });

  return JSON.parse(response.text);
};
