import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

const getAI = () => {
  if (!ai && process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

export const chatWithAssistant = async (userMessage: string): Promise<string> => {
  const client = getAI();
  if (!client) return "AI service is not configured. Please set up your API key.";
  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: userMessage,
      config: {
        systemInstruction: `You are TechBot, a helpful assistant for "TechNova", a mobile repair and accessories shop.

        Our services:
        1. Professional Repairs (Screens, Batteries, Logic Boards).
        2. Premium Accessories (Cases, Screen Protectors).
        3. Real-time Status Lookup.

        Tone: Professional, Tech-savvy, slightly witty.
        If a user asks about repair status, guide them to the 'Repair Lookup' page.
        If a user asks about products, recommend our high-quality cases.
        Keep answers concise (under 50 words unless detailed explanation is needed).
        `
      }
    });

    return response.text || "I didn't catch that. Could you rephrase?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm currently offline. Please try again later.";
  }
};

export const chatWithThinking = async (userMessage: string): Promise<string> => {
  const client = getAI();
  if (!client) return "AI service is not configured. Please set up your API key.";
  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash-thinking-exp',
      contents: userMessage,
      config: {
        systemInstruction: "You are a senior technical expert. Think step-by-step to solve complex diagnostic problems for mobile devices."
      }
    });
    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Thinking Error:", error);
    return "I couldn't complete the deep analysis.";
  }
};

export const analyzeImage = async (base64Image: string, prompt: string): Promise<string> => {
  const client = getAI();
  if (!client) return "AI service is not configured. Please set up your API key.";
  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: prompt || "Analyze this image for damage." }
        ]
      }
    });
    return response.text || "No insights found.";
  } catch (error) {
    console.error("Vision Error:", error);
    return "I couldn't analyze the image.";
  }
};

// Case style options for mockup generation
export interface CaseStyleOptions {
  caseType: 'slim' | 'tough' | 'clear' | 'leather';
  finish: 'glossy' | 'matte' | 'soft-touch';
  edgeColor: 'black' | 'white' | 'transparent' | 'matching';
}

export const generateCaseMockup = async (
  base64Image: string,
  phoneModel: string,
  style: CaseStyleOptions = { caseType: 'slim', finish: 'glossy', edgeColor: 'black' }
): Promise<string | null> => {
  const client = getAI();
  if (!client) return null;

  const caseTypeDescriptions: Record<string, string> = {
    slim: 'ultra-thin slim-fit case that shows off the phone design',
    tough: 'rugged protective case with reinforced corners and raised bezels',
    clear: 'crystal clear transparent case that shows the phone color through',
    leather: 'premium leather texture case with elegant stitching details'
  };

  const finishDescriptions: Record<string, string> = {
    glossy: 'high-gloss reflective finish with mirror-like shine',
    matte: 'smooth matte anti-fingerprint finish',
    'soft-touch': 'soft-touch rubberized finish with velvety texture'
  };

  const edgeDescriptions: Record<string, string> = {
    black: 'sleek black edges and button covers',
    white: 'clean white edges and button covers',
    transparent: 'clear transparent edges',
    matching: 'edges that match the main design colors'
  };

  try {
    const prompt = `Generate a HYPER-REALISTIC professional product photograph of a custom phone case for ${phoneModel}.

CRITICAL REQUIREMENTS:
1. The user's uploaded image MUST be perfectly printed/wrapped on the back of the phone case
2. Show the case installed on an actual ${phoneModel} smartphone
3. Use professional studio lighting with soft shadows
4. Camera angle: 3/4 perspective view showing both the back design and side profile
5. The phone should be slightly tilted to show depth and the case thickness

CASE SPECIFICATIONS:
- Type: ${caseTypeDescriptions[style.caseType]}
- Surface: ${finishDescriptions[style.finish]}
- Edges: ${edgeDescriptions[style.edgeColor]}

QUALITY STANDARDS:
- Photo-realistic rendering quality (not cartoon or illustration)
- Sharp focus on the case design
- Subtle reflections showing the surface finish
- Clean white/light gray gradient studio background
- Professional e-commerce product photography style
- 4K quality detail on the printed design
- Show realistic camera cutout and button details
- The design should wrap naturally around the curved edges

Make this look like an actual product photo that would be used on Apple or Samsung's official accessory store.`;

    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
            { text: prompt }
          ]
        }
      ],
      config: {
        responseModalities: ['image', 'text'],
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Mockup Generation Error:", error);
    return null;
  }
};

// Generate multiple mockup views
export const generateMultipleMockups = async (
  base64Image: string,
  phoneModel: string,
  style: CaseStyleOptions
): Promise<{ main: string | null; angle: string | null; flat: string | null }> => {
  const client = getAI();
  if (!client) return { main: null, angle: null, flat: null };

  const generateView = async (viewType: 'main' | 'angle' | 'flat'): Promise<string | null> => {
    const viewPrompts: Record<string, string> = {
      main: `3/4 perspective view of the phone case on a ${phoneModel}, showing the back design and side profile clearly. Professional studio lighting, white background.`,
      angle: `Low angle dramatic shot of the phone case on ${phoneModel}, tilted on a reflective surface with artistic lighting. Shows premium quality and thickness.`,
      flat: `Top-down flat lay view of the phone case for ${phoneModel}, perfectly centered on white background. Clean e-commerce style product shot.`
    };

    try {
      const prompt = `Create a PHOTO-REALISTIC product image: ${viewPrompts[viewType]}

The case MUST display the user's uploaded image as the printed design.
Case type: ${style.caseType}, Finish: ${style.finish}, Edge color: ${style.edgeColor}
Make it look like a real professional product photograph, not a 3D render or illustration.`;

      const response = await client.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
              { text: prompt }
            ]
          }
        ],
        config: {
          responseModalities: ['image', 'text'],
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error) {
      console.error(`Mockup ${viewType} Generation Error:`, error);
      return null;
    }
  };

  // Generate all views in parallel
  const [main, angle, flat] = await Promise.all([
    generateView('main'),
    generateView('angle'),
    generateView('flat')
  ]);

  return { main, angle, flat };
};

export const isAIConfigured = (): boolean => {
  return !!process.env.API_KEY;
};
