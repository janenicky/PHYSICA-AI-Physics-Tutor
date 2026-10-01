document.addEventListener("DOMContentLoaded", function () {

    const form =
        document.getElementById("chat-form");


    const input =
        document.getElementById("chat-message");


    const sendButton =
        document.getElementById("chat-send");


    const messages =
        document.getElementById("messages");


    const currentTopic =
        document.getElementById("current-topic");

    const WORKER_URL =
        "https://soft-frost-e73a.nikjena09-09.workers.dev/";

    const urlParams =
        new URLSearchParams(
            window.location.search
        );


    const topic =
        urlParams.get("topic") ||
        "General Physics";


    if (currentTopic) {

        currentTopic.textContent =
            topic;

    }

    const conversation = [];

    function formatAIResponse(text) {

        let safeText =
            String(text)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");


        safeText =
            safeText
                .replace(
                    /^### (.*)$/gm,
                    "<h4>$1</h4>"
                )

                .replace(
                    /^## (.*)$/gm,
                    "<h3>$1</h3>"
                )

                .replace(
                    /^# (.*)$/gm,
                    "<h2>$1</h2>"
                )

                .replace(
                    /\*\*(.*?)\*\*/g,
                    "<strong>$1</strong>"
                )

                .replace(
                    /__([^_]+)__/g,
                    "<strong>$1</strong>"
                )

                .replace(
                    /`([^`]+)`/g,
                    "<code>$1</code>"
                )

                .replace(
                    /^\- (.*)$/gm,
                    "<li>$1</li>"
                )

                .replace(
                    /^\* (.*)$/gm,
                    "<li>$1</li>"
                )

                .replace(
                    /\n\n/g,
                    '<div class="response-space"></div>'
                )

                .replace(
                    /\n/g,
                    "<br>"
                );


        return safeText;

    }

    function addMessage(
        text,
        type
    ) {

        const message =
            document.createElement("div");


        message.classList.add(
            "message",
            type
        );


        if (type === "ai") {

            message.innerHTML =
                formatAIResponse(text);

        } else {

            message.textContent =
                text;

        }


        messages.appendChild(
            message
        );


        messages.scrollTop =
            messages.scrollHeight;


        return message;

    }

    function addThinkingMessage() {

        const message =
            document.createElement("div");


        message.classList.add(
            "message",
            "ai",
            "thinking"
        );


        message.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;


        messages.appendChild(
            message
        );


        messages.scrollTop =
            messages.scrollHeight;


        return message;

    }

    if (
        !form ||
        !input ||
        !sendButton ||
        !messages
    ) {

        return;

    }


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const userMessage =
                input.value.trim();


            if (!userMessage) {
                return;
            }

            addMessage(
                userMessage,
                "user"
            );


            conversation.push({

                role: "user",

                content: userMessage

            });


            input.value = "";


            input.disabled = true;

            sendButton.disabled = true;

            const thinking =
                addThinkingMessage();


            try {

                const response =
                    await fetch(
                        WORKER_URL,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({

                                    topic:
                                        topic,

                                    messages:
                                        conversation.slice(-12)

                                })

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.error ||
                        "PHYSICA could not process your question."
                    );

                }

                thinking.remove();

                const answer =
                    data.answer ||
                    "I didn't receive an answer.";


                addMessage(
                    answer,
                    "ai"
                );


                conversation.push({

                    role: "assistant",

                    content: answer

                });


            } catch (error) {


                console.error(
                    "PHYSICA error:",
                    error
                );


                thinking.remove();


                addMessage(
                    "I couldn't connect to PHYSICA right now. Please try again.",
                    "ai"
                );


            } finally {


                input.disabled = false;

                sendButton.disabled = false;

                input.focus();

            }

        }
    );


    input.focus();

});
