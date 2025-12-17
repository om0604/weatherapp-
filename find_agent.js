// using global fetch

// If node-fetch is not available, these environments usually have global fetch in Node 18+
// Converting to use global fetch if possible, or remove require if running in newer Node.
// The previous attempt failed because of module not found. I'll rely on global fetch.

const baseUrl = 'https://brief-thousands-sunset-9fcb1c78-485f-4967-ac04-2759a8fa1462.mastra.cloud';
const agentNames = [
    'weatherAgent',
    'WeatherAgent',
    'weather-agent',
    'weather_agent',
    'weatheragent',
    'agent',
    'Agent'
];

async function check() {
    for (const name of agentNames) {
        const url = `${baseUrl}/api/agents/${name}/stream`;
        console.log(`Checking ${url}...`);
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Connection': 'keep-alive',
                    'Content-Type': 'application/json',
                    'x-mastra-dev-playground': 'true'
                },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: 'Hello' }],
                    runId: name,
                    resourceId: name,
                    threadId: "2024510008"
                })
            });
            console.log(`Result for ${name}: ${res.status} ${res.statusText}`);
            if (res.ok) {
                console.log("SUCCESS FOUND:", name);
                break;
            }
        } catch (e) {
            console.log(`Error checking ${name}:`, e.message);
        }
    }
}

check();
