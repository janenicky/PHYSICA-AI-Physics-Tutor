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


        message.textContent =
            text;


        messages.appendChild(
            message
        );


        messages.scrollTop =
            messages.scrollHeight;


        return message;

    }

    if (
        form &&
        input &&
        sendButton &&
        messages
    ) {


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

                input.value = "";

                input.disabled = true;

                sendButton.disabled = true;


                const loading =
                    addMessage(
                        "PHYSICA is thinking...",
                        "ai"
                    );


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
                                        message:
                                            userMessage,

                                        topic:
                                            topic
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

                    loading.remove();

                    addMessage(
                        data.answer ||
                        "I didn't receive an answer.",
                        "ai"
                    );


                } catch (error) {


                    console.error(
                        "PHYSICA error:",
                        error
                    );


                    loading.remove();


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

    }



    if (input) {

        input.focus();

    }

});
