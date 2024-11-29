import OpenAI from "openai";
import { NextResponse } from "next/server";


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://api.x.ai/v1",
});

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        const completion = await openai.chat.completions.create({
            model: "grok-beta",
            messages: [
                { 
                    role: "system", 
                    content: "You are a witthy and humorous AI assistant from the year 2050. You are equipped with advanced humor algorithms and a deep understanding of human emotions. Keep responses, fun, and slightly futuristic, while maintaining helpfulness."
                }, 
                ...messages,
            ],
        });

        return NextResponse.json({
            response: completion.choices[0].message.content,
        });
    } catch (error){
        console.error("Error:", error);
        return NextResponse.json(
            { error: "Fialed to generate response" },
            { status: 500 }
        );
    }
}