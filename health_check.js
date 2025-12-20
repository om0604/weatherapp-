
const baseUrl = 'https://brief-thousands-sunset-9fcb1c78-485f-4967-ac04-2759a8fa1462.mastra.cloud';

async function checkHealth() {
    console.log("Checking server root and health...");
    const paths = ['/', '/health', '/api/health', '/api', '/v1/health'];

    for (const path of paths) {
        try {
            const res = await fetch(baseUrl + path);
            console.log(`GET ${path}: ${res.status} ${res.statusText}`);
            if (res.ok) {
                console.log("Body:", (await res.text()).substring(0, 100));
            }
        } catch (e) {
            console.log(`Error ${path}:`, e.message);
        }
    }
}

checkHealth();
