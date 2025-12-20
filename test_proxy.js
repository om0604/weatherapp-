


async function testProxy() {
    console.log("Testing local proxy at http://localhost:3000/api/chat");
    try {
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [
                    { role: 'user', content: 'What is the weather in Delhi?' }
                ]
            })
        });

        console.log("Status:", response.status);
        if (response.ok) {
            const text = await response.text();
            console.log("Response:", text.substring(0, 200) + "...");
        } else {
            const error = await response.text();
            console.error("Error:", error);
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

testProxy();
