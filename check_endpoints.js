
const baseUrl = 'https://brief-thousands-sunset-9fcb1c78-485f-4967-ac04-2759a8fa1462.mastra.cloud';

async function check() {
    console.log("Checking list of agents...");
    try {
        const res = await fetch(`${baseUrl}/api/agents`, {
            method: 'GET',
            headers: {
                'Accept': '*/*',
                'x-mastra-dev-playground': 'true'
            }
        });
        console.log(`GET /api/agents: ${res.status}`);
        if (res.ok) {
            const data = await res.json();
            console.log("Agents list:", JSON.stringify(data, null, 2));
        } else {
            console.log("Response text:", await res.text());
        }
    } catch (e) {
        console.log("Error checking list:", e.message);
    }

    console.log("Checking generate endpoint...");
    try {
        const url = `${baseUrl}/api/agents/weatherAgent/generate`;
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-mastra-dev-playground': 'true'
            },
            body: JSON.stringify({ messages: [{ role: 'user', content: 'Hi' }] })
        });
        console.log(`POST /generate: ${res.status}`);
    } catch (e) {
        console.log("Error checking generate:", e.message);
    }
}

check();
