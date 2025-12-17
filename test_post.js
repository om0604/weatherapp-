async function test() {
    try {
        const body = {
            "messages": [
                {
                    "role": "user",
                    "content": "What is the weather?"
                }
            ],
            "runId": "weatherAgent",
            "maxRetries": 2,
            "maxSteps": 5,
            "temperature": 0.5,
            "topP": 1,
            "runtimeContext": {},
            "threadId": "2024510008",
            "resourceId": "weatherAgent"
        };

        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        console.log("Status:", response.status);
        console.log("Text:", await response.text());
    } catch (e) {
        console.error(e);
    }
}
test();
