import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    console.log("Chat API Route HIT");
    try {
        const body = await req.json();
        console.log("Request Body:", JSON.stringify(body, null, 2));

        const targetUrl = 'https://brief-thousands-sunset-9fcb1c78-485f-4967-ac04-2759a8fa1462.mastra.cloud/api/agents/weatherAgent/stream';
        console.log("Forwarding to:", targetUrl);

        // Forward the request to the Mastra agent
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                'Connection': 'keep-alive',
                'Content-Type': 'application/json',
                'x-mastra-dev-playground': 'true'
            },
            body: JSON.stringify(body)
        });

        console.log("Mastra Response Status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Mastra API Error Body:", errorText);
            return NextResponse.json({ error: `Mastra API Error: ${response.status} ${response.statusText}`, details: errorText }, { status: response.status });
        }

        // Return the stream directly
        return new Response(response.body, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Transfer-Encoding': 'chunked'
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
