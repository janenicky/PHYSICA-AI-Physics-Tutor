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


        source = source.replace(
            /\\\[[\s\S]*?\\\]/g,
            saveMath
        );


        source = source.replace(
            /\$\$[\s\S]*?\$\$/g,
            saveMath
        );

        source = source
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

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

        for (let line of lines) {

            const trimmed =
                line.trim();

            if (!trimmed) {

                closeList();

                html +=
                    '<div class="response-space"></div>';

                continue;

            }

            if (
                /^@@MATHBLOCK\d+@@$/.test(
                    trimmed
                )
            ) {

                closeList();


                const match =
                    trimmed.match(
                        /\d+/
                    );


                const index =
                    Number(
                        match[0]
                    );


                html +=
                    `<div class="math-block">
                        ${mathBlocks[index]}
                    </div>`;


                continue;

            }

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

            closeList();


            html +=
                `<p>${trimmed}</p>`;

        }


        closeList();


        return html;

    }

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

            const paragraph =
                document.createElement("p");


            paragraph.textContent =
                text;


            message.appendChild(
                paragraph
            );

        }


        messages.appendChild(
            message
        );


        if (
            type === "ai" &&
            window.MathJax &&
            window.MathJax.typesetPromise
        ) {

            window.MathJax
                .typesetPromise([message])
                .catch(function (error) {

                    console.error(
                        "MathJax error:",
                        error
                    );

                });

        }

        requestAnimationFrame(
            function () {

                messages.scrollTo({

                    top:
                        messages.scrollHeight,

                    behavior:
                        "smooth"

                });

            }
        );


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

                                method:
                                    "POST",

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
