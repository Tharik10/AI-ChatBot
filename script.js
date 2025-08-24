document.addEventListener("DOMContentLoaded", () => {
        const chatMessages = document.getElementById("chat-messages");
        const userInput = document.getElementById("user-input");
        const sendButton = document.getElementById("send-button");
    
        async function getBotResponse(userMessage) {
            try {
                const response = await fetch("http://localhost:11434/api/generate", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        model: "tinydolphin", // 👈 Use tinydolphin model here
                        prompt: userMessage,
                        stream: false
                    })
                });
    
                const data = await response.json();
                return data.response || "Sorry, I didn’t understand that.";
            } catch (error) {
                console.error("Error calling Ollama:", error);
                return "Oops! Unable to get a response from AI.";
            }
        }
    
        function addMessage(message, isUser = false) {
            const messageDiv = document.createElement("div");
            messageDiv.classList.add("message", isUser ? "user-message" : "bot-message");
    
            const messageText = document.createElement("p");

            const formattedMessage=message.replace(/```(.*?)```/gs,'<pre><code>$1</code></pre>')
            .replace(/\n/g,"<br>")
            messageText.innerHTML = formattedMessage;
            messageDiv.appendChild(messageText);
    
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    
        async function sendMessage() {
            const message = userInput.value.trim();
            if (message) {
                addMessage(message, true);
                userInput.value = "";
    
                const botReply = await getBotResponse(message);
                addMessage(botReply, false);
            }
        }
    
        sendButton.addEventListener("click", sendMessage);
    
        userInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                sendMessage();
            }
        });
    });
    