
const baseUrl = 'https://brief-thousands-sunset-9fcb1c78-485f-4967-ac04-2759a8fa1462.mastra.cloud';
const paths = [
    '/api/agent/weatherAgent/stream',
    '/api/agents/weatherAgent/stream', // Re-check
    '/agents/weatherAgent/stream',
    '/weatherAgent/stream',
    '/api/stream', // generic?
];

async function check() {
    for (const path of paths) {
        const url = baseUrl + path;
        console.log(`Checking ${url}...`);
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-mastra-dev-playground': 'true'
                },
                body: JSON.stringify({ messages: [{ role: 'user', content: 'Hi' }] })
            });
            console.log(`Result: ${res.status} ${res.statusText}`);
            if (res.ok) {
                console.log("SUCCESS PATH:", path);
            }
        } catch (e) {
            console.log(`Error:`, e.message);
        }
    }
}

check();
