class ChatService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.apiUrl = "https://router.huggingface.co/v1/chat/completions";
    }

    async query(data, setReplyText) {
        const response = await fetch(this.apiUrl, {
            headers: {
                "Authorization": `Bearer ${this.apiKey}`,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(data),
        });

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

                try {
                    const jsonString = event.startsWith("data:") ? event.slice(5) : event;
                    const jsonEvent = JSON.parse(jsonString);
                    const content = jsonEvent.choices[0].delta.content;

                    if (content) {
                        text += content;
                        setReplyText(text);
                        await new Promise(resolve => setTimeout(resolve, 10));
                    }
                } catch (error) {
                    console.error("Error parsing event:", error);
                }
            }
        }

        return text;
    }
}

export default ChatService;
