'use server'
import {OpenAI} from 'openai';

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

export default async function analyzeImage(image){
    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            {
                role: 'system',
                content: [
                    {
                        type: 'text',
                        text: 'You are a inventory management system that can identify items from images. Return only the name of the item.'
                    }
                ]
            },
            {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: 'Identify the item in this image and only return the name of the item'
                    },
                    {
                        type: 'image_url',
                        image_url: {
                            url: image,
                            detail: 'low'
                        }
                    }
                ]
            }
        ]
    })
    const itemName = response.choices[0].message.content
    console.log(itemName);
    return itemName;

}