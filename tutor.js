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

    let safe = String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");



    safe = safe
        .replace(/\\\((.*?)\\\)/g, "$1")
        .replace(/\\\[(.*?)\\\]/g, "$1")
        .replace(/\\lambda/g, "λ")
        .replace(/\\Delta/g, "Δ")
        .replace(/\\alpha/g, "α")
        .replace(/\\beta/g, "β")
        .replace(/\\theta/g, "θ")
        .replace(/\\mu/g, "μ")
        .replace(/\\pi/g, "π");


    safe = safe
        .replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
        )

        .replace(
            /\*([^*]+)\*/g,
            "<em>$1</em>"
        )

        .replace(
            /`([^`]+)`/g,
            "<code>$1</code>"
        );


    const lines =
        safe.split("\n");


    let html = "";

    let inList = false;
    let listType = null;


    function closeList() {

        if (!inList) {
            return;
        }

        html +=
            listType === "ol"
                ? "</ol>"
                : "</ul>";

        inList = false;
        listType = null;

    }


    for (let line of lines) {

        const trimmed =
            line.trim();



        if (!trimmed) {

            closeList();

            html +=
                '<div class="response-space"></div>';

            continue;

        }


        if (trimmed.startsWith("## ")) {

            closeList();

            html +=
                `<h3>${trimmed.slice(3)}</h3>`;

            continue;

        }


        if (trimmed.startsWith("### ")) {

            closeList();

            html +=
                `<h4>${trimmed.slice(4)}</h4>`;

            continue;

        }


        if (trimmed.startsWith("# ")) {

            closeList();

            html +=
                `<h2>${trimmed.slice(2)}</h2>`;

            continue;

        }


        const numbered =
            trimmed.match(
                /^\d+\.\s+(.*)$/
            );


        if (numbered) {

            if (!inList || listType !== "ol") {

                closeList();

                html += "<ol>";

                inList = true;

                listType = "ol";

            }

            html +=
                `<li>${numbered[1]}</li>`;

            continue;

        }


        const bullet =
            trimmed.match(
                /^[-*•]\s+(.*)$/
            );


        if (bullet) {

            if (!inList || listType !== "ul") {

                closeList();

                html += "<ul>";

                inList = true;

                listType = "ul";

            }

            html +=
                `<li>${bullet[1]}</li>`;

            continue;

        }


        closeList();

        html +=
            `<p>${trimmed}</p>`;

    }


    closeList();


    return html;

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
