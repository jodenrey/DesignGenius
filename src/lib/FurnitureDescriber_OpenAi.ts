import OpenAI from "openai";

// Initialization function
function initOpenAI(): OpenAI {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error(" OPENAI_API_KEY not found in environment variables.");
    }

    return new OpenAI({ apiKey });
    }
  
// Main image description function
export default async function describeImage(type:string, base64Image: string): Promise<string | null> {
      const openai = initOpenAI();
      
    const response =  await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{
            role: "user",
            content: [
                {
                type: "text",
                text: `You're a professional interior design assistant. Describe only the "${type.toUpperCase()}" in the image in extreme detail — including its furniture type, color, shape, design style, material, texture, and possible use-case. Return your response strictly in valid JSON format with this key only: { "description": "..." } Do not include any explanation, markdown, or extra text. Only return the JSON.`,
                },
                {
                type: "image_url",
                image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`,
                    },
                },
            ],
        }],
    });
    console.log(response.choices[0].message.content);
    return response.choices[0].message.content;
}
