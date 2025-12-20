


async function checkNewEndpoint(streamValue) {
    const url = 'https://api-dev.provue.ai/api/webapp/agent/test-agent';
    const body = {
        prompt: "What is the weather in Delhi?",
        stream: streamValue
    };

    console.log(`Checking ${url} with stream=${streamValue}...`);
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        console.log(`Status: ${res.status}`);

        if (streamValue) {
            // Just read a bit of the stream if it is one
            // Note: node-fetch body is a stream
            console.log("Headers:", res.headers.raw());
        }

        const text = await res.text();
        console.log("Response Preview:", text.substring(0, 500));

    } catch (e) {
        console.log("Error:", e.message);
    }
}

// Test both non-streaming and streaming
async function run() {
    await checkNewEndpoint(false);
    console.log("-".repeat(20));
    await checkNewEndpoint(true);
}

run();
