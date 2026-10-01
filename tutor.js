document.addEventListener("DOMContentLoaded", () => {

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


    /* =====================================================
       WORKER
    ===================================================== */

    const WORKER_URL =
        "https://soft-frost-e73a.nikjena09-09.workers.dev/";


    /* =====================================================
       TOPIC
    ===================================================== */

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


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHTML(text) {

        return String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* =====================================================
       FORMAT AI RESPONSE
    ===================================================== */

    function formatAIResponse(text) {

        let source =
            String(text);


        const mathBlocks = [];


        function saveMath(match) {

            const index =
                mathBlocks.length;

            mathBlocks.push(match);

            return `@@MATHBLOCK${index}@@`;

        }


        /* save display math */

        source = source.replace(
            /\\\[[\s\S]*?\\\]/g,
            saveMath
        );


        source = source.replace(
            /\$\$[\s\S]*?\$\$/g,
            saveMath
        );


        /* escape HTML */

        source = escapeHTML(source);


        /* markdown */

        source = source

            .replace(
                /\*\*(.*?)\*\*/g,
                "<strong>$1</strong>"
            )

            .replace(
                /`([^`]+)`/g,
                "<code>$1</code>"
            )

            .replace(
                /\*([^*]+)\*/g,
                "<em>$1</em>"
            );


        const lines =
            source.split("\n");


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


        for (const line of lines) {

            const trimmed =
                line.trim();


            /* empty line */

            if (!trimmed) {

                closeList();

                html +=
                    '<div class="response-space"></div>';

                continue;

            }


            /* math */

            if (
                /^@@MATHBLOCK\d+@@$/
                    .test(trimmed)
            ) {

                closeList();


                const match =
                    trimmed.match(/\d+/);


                const index =
                    Number(match[0]);


                html +=
                    `<div class="math-block">
                        ${mathBlocks[index]}
                    </div>`;


                continue;

            }


            /* headings */

            if (
                trimmed.startsWith("### ")
            ) {

                closeList();

                html +=
                    `<h4>${trimmed.slice(4)}</h4>`;

                continue;

            }


            if (
                trimmed.startsWith("## ")
            ) {

                closeList();

                html +=
                    `<h3>${trimmed.slice(3)}</h3>`;

                continue;

            }


            if (
                trimmed.startsWith("# ")
            ) {

                closeList();

                html +=
                    `<h2>${trimmed.slice(2)}</h2>`;

                continue;

            }


            /* numbered list */

            const numbered =
                trimmed.match(
                    /^\d+\.\s+(.*)$/
                );


            if (numbered) {

                if (
                    !inList ||
                    listType !== "ol"
                ) {

                    closeList();

                    html += "<ol>";

                    inList = true;

                    listType = "ol";

                }


                html +=
                    `<li>${numbered[1]}</li>`;

                continue;

            }


            /* bullet list */

            const bullet =
                trimmed.match(
                    /^[-*•]\s+(.*)$/
                );


            if (bullet) {

                if (
                    !inList ||
                    listType !== "ul"
                ) {

                    closeList();

                    html += "<ul>";

                    inList = true;

                    listType = "ul";

                }


                html +=
                    `<li>${bullet[1]}</li>`;

                continue;

            }


            /* normal paragraph */

            closeList();


            html +=
                `<p>${trimmed}</p>`;

        }


        closeList();


        return html;

    }


    /* =====================================================
       ADD MESSAGE
    ===================================================== */

    function addMessage(
        text,
        type,
        formatted = false
    ) {

        const message =
            document.createElement("div");


        message.classList.add(
            "message",
            type
        );


        if (
            type === "ai" &&
            formatted
        ) {

            message.innerHTML =
                formatAIResponse(text);

        } else {

            message.textContent =
                text;

        }


        messages.appendChild(message);


        messages.scrollTop =
            messages.scrollHeight;


        if (
            type === "ai" &&
            formatted &&
            window.MathJax
        ) {

            MathJax.typesetPromise([
                message
            ]).catch(error => {

                console.error(
                    "MathJax error:",
                    error
                );

            });

        }


        return message;

    }


    /* =====================================================
       LOADING MESSAGE
    ===================================================== */

    function addLoading() {

        const loading =
            document.createElement("div");


        loading.className =
            "message ai";


        loading.innerHTML =
            "<p>Thinking...</p>";


        messages.appendChild(
            loading
        );


        messages.scrollTop =
            messages.scrollHeight;


        return loading;

    }


    /* =====================================================
       CHAT SUBMIT
    ===================================================== */

    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const userMessage =
                input.value.trim();


            if (!userMessage) {
                return;
            }


            /* user message */

            addMessage(
                userMessage,
                "user"
            );


            input.value = "";

            input.disabled = true;

            sendButton.disabled = true;


            const loading =
                addLoading();


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


                const raw =
                    await response.text();


                let data;


                try {

                    data =
                        JSON.parse(raw);

                } catch {

                    throw new Error(
                        `Worker returned invalid response (${response.status}).`
                    );

                }


                if (!response.ok) {

                    throw new Error(
                        data.error ||
                        `Worker error (${response.status}).`
                    );

                }


                if (
                    !data.answer
                ) {

                    throw new Error(
                        "The AI returned an empty answer."
                    );

                }


                loading.remove();


                addMessage(
                    data.answer,
                    "ai",
                    true
                );


            } catch (error) {

                console.error(
                    "PHYSICA error:",
                    error
                );


                loading.remove();


                addMessage(
                    `Connection error: ${error.message || "Unknown error."}`,
                    "ai"
                );

            }


            input.disabled = false;

            sendButton.disabled = false;

            input.focus();

        }
    );


    /* =====================================================
       INITIAL FOCUS
    ===================================================== */

    if (input) {
        input.focus();
    }

});
