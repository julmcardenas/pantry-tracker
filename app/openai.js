'use server'
import {OpenAI} from 'openai';

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

export default async function analyzeImage(image){
    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            {
                role: 'system',
                content: 'You are a helpful assistant.'
            },
            {
                role: 'user',
                content: 'What is the meaning of life?'
            }
        ]
    })
    
    console.log(response.choices[0])
    return "cat";

}