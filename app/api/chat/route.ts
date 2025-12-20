import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    console.log("Chat API Route HIT");
    try {
        const body = await req.json();
        // Extract the last user message content
        const messages = body.messages || [];
        const lastMessage = messages[messages.length - 1];
        const prompt = lastMessage?.content || "";

        console.log("Prompt:", prompt);

        const targetUrl = 'https://api-dev.provue.ai/api/webapp/agent/test-agent';
        console.log("Forwarding to:", targetUrl);

        // Call the new API
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: prompt,
                stream: false
            })
        });

        console.log("Upstream Response Status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Upstream API Error:", errorText);
            return NextResponse.json({ error: `Upstream API Error: ${response.status}`, details: errorText }, { status: response.status });
        }

        const data = await response.json();
        const responseText = data?.data?.response || "";

        // Return the response text directly. 
        // The frontend expects a stream, but a single text response is a valid stream of one chunk.
        return new Response(responseText, {
            status: 200,
            headers: {
                'Content-Type': 'text/plain; charset=utf-8'
            }
        });

    } catch (error) {
        console.error("Proxy Internal Error:", error);
        return NextResponse.json({ error: 'Internal Server Error', details: String(error) }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({ status: 'API Route is working' });
}
