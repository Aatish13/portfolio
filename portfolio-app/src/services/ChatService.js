class ChatService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.apiUrl = "https://router.huggingface.co/v1/chat/completions";
    }

    async query(data, setReplyText) {
        if (!this.apiKey) {
            console.error("No API key provided");
            setReplyText("Error: No API key configured. Please check your .env file.");
            return;
        }

        try {
            const response = await fetch(this.apiUrl, {
                headers: {
                    "Authorization": `Bearer ${this.apiKey}`,
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("API Error:", response.status, errorText);
                setReplyText(`Error: API request failed (${response.status}).`);
                return;
            }

            if (!response.body) {
                throw new Error("No response body found");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let text = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const events = chunk.split("\n\n");

                for (const event of events) {
                    if (event.trim() === "") continue;
                    if (event.includes("[DONE]")) continue;

                    try {
                        const jsonString = event.startsWith("data:") ? event.slice(5) : event;
                        // Skip if it's not JSON (sometimes keep-alive newlines)
                        if (jsonString.trim() === "") continue;

                        const jsonEvent = JSON.parse(jsonString);

                        // Check structure
                        if (jsonEvent.choices && jsonEvent.choices[0].delta && jsonEvent.choices[0].delta.content) {
                            const content = jsonEvent.choices[0].delta.content;
                            text += content;
                            setReplyText(text);
                            // Small delay for typing effect if needed, but usually not necessary for logic
                            // await new Promise(resolve => setTimeout(resolve, 10));
                        }
                    } catch (error) {
                        console.warn("Error parsing event chunk:", error, event);
                    }
                }
            }

            return text;
        } catch (error) {
            console.error("Network or parsing error:", error);
            setReplyText("Error: Failed to connect to AI service.");
        }
    }
}

export default ChatService;
