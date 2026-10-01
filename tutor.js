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

    const params =
        new URLSearchParams(
            window.location.search
        );


    const topic =
        params.get("topic") ||
        "General Physics";


    if (currentTopic) {

        currentTopic.textContent =
            topic;

    }

    const conversation = [];

    function formatAIResponse(text) {

        let safe =
            String(text)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");


        safe =
            safe
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


        return safe;

    }

    function addMessage(
        text,
        type
    ) {

        const message =
            document.createElement("div");


        message.className =
            `message ${type}`;


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

    function addThinking() {

        const message =
            document.createElement("div");


        message.className =
            "message ai thinking";


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

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const text =
                input.value.trim();


            if (!text) {
                return;
            }


            addMessage(
                text,
                "user"
            );


            conversation.push({

                role: "user",

                content: text

            });


            input.value = "";

            input.disabled = true;

            sendButton.disabled = true;


            const thinking =
                addThinking();


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
                        "PHYSICA request failed."
                    );

                }


                thinking.remove();


                const answer =
                    data.answer ||
                    "No answer received.";


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

            }


            input.disabled = false;

            sendButton.disabled = false;

            input.focus();

        }
    );


    input.focus();

});
