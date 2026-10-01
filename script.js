document.addEventListener("DOMContentLoaded", function () {

    const startLearning =
        document.getElementById("start-learning");

    const topicsSection =
        document.getElementById("topics");

    const tryTutor =
        document.getElementById("try-tutor");

    const tutorSection =
        document.getElementById("tutor");

    const topicCards =
        document.querySelectorAll(".topic-card");

    const selectedTopic =
        document.getElementById("selected-topic");

    const topicInfo =
        document.getElementById("topic-info");

    const topicTitle =
        document.getElementById("topic-title");

    const topicDescription =
        document.getElementById("topic-description");

    const topicStart =
        document.getElementById("topic-start");

    const chatForm =
        document.getElementById("chat-form");

    const chatMessage =
        document.getElementById("chat-message");

    const chatButton =
        document.getElementById("chat-demo-button");

    const messagesContainer =
        document.getElementById("messages");

    const topics = {

        Mechanics: {
            title: "Mechanics",
            description:
                "Explore motion, forces, energy and momentum — and understand why objects move the way they do."
        },

        Electricity: {
            title: "Electricity",
            description:
                "Discover electric fields, circuits, voltage and current, and see how they connect."
        },

        Waves: {
            title: "Waves",
            description:
                "Explore oscillations, sound, light and interference through the language of waves."
        },

        Thermodynamics: {
            title: "Thermodynamics",
            description:
                "Understand heat, temperature, energy transfer and the laws that govern physical systems."
        }

    };

    if (startLearning && topicsSection) {

        startLearning.addEventListener(
            "click",
            function () {

                topicsSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    }


    if (tryTutor && tutorSection) {

        tryTutor.addEventListener(
            "click",
            function () {

                tutorSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    }

    function selectTopic(card) {

        if (!card) {
            return;
        }

        topicCards.forEach(
            function (otherCard) {

                otherCard.classList.remove(
                    "selected"
                );

            }
        );


        card.classList.add("selected");


        const topicName =
            card.dataset.topic;


        const topic =
            topics[topicName];


        if (!topic) {
            return;
        }


        if (selectedTopic) {

            selectedTopic.textContent =
                "Selected topic: " + topicName;

        }


        if (topicTitle) {

            topicTitle.textContent =
                topic.title;

        }


        if (topicDescription) {

            topicDescription.textContent =
                topic.description;

        }


        if (topicInfo) {

            topicInfo.classList.add("visible");

        }

    }


    topicCards.forEach(
        function (card) {


            card.addEventListener(
                "click",
                function () {

                    selectTopic(card);

                }
            );


            card.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {

                        event.preventDefault();

                        selectTopic(card);

                    }

                }
            );


        }
    );

    if (topicStart && tutorSection) {

        topicStart.addEventListener(
            "click",
            function () {

                tutorSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                if (chatMessage) {
                    chatMessage.focus();
                }

            }
        );

    }

    function addMessage(text, type) {

        if (!messagesContainer) {
            return null;
        }


        const messageElement =
            document.createElement("div");


        messageElement.classList.add(
            "message",
            type
        );


        messageElement.textContent =
            text;


        messagesContainer.appendChild(
            messageElement
        );


        messagesContainer.scrollTop =
            messagesContainer.scrollHeight;


        return messageElement;

    }


    function addLoadingMessage() {

        return addMessage(
            "PHYSICA is thinking...",
            "ai"
        );

    }

    const WORKER_URL =
        "https://soft-frost-e73a.nikjena09-09.workers.dev/";


    if (chatForm && chatMessage && chatButton) {

        chatForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const message =
                    chatMessage.value.trim();


                if (!message) {
                    return;
                }

                const selectedCard =
                    document.querySelector(
                        ".topic-card.selected"
                    );


                const topic =
                    selectedCard
                        ? selectedCard.dataset.topic
                        : "General Physics";


                addMessage(
                    message,
                    "user"
                );

                chatMessage.value = "";

                chatMessage.disabled = true;
                chatButton.disabled = true;

                const loadingMessage =
                    addLoadingMessage();


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

                                body: JSON.stringify({
                                    message: message,
                                    topic: topic
                                })
                            }
                        );

                    const data =
                        await response.json();

                    if (!response.ok) {

                        throw new Error(
                            data.error ||
                            "PHYSICA could not process the request."
                        );

                    }

                    if (loadingMessage) {

                        loadingMessage.remove();

                    }

                    addMessage(
                        data.answer ||
                        "PHYSICA did not return an answer.",
                        "ai"
                    );


                } catch (error) {

                    console.error(
                        "PHYSICA error:",
                        error
                    );


                    if (loadingMessage) {

                        loadingMessage.remove();

                    }


                    addMessage(
                        "Something went wrong while connecting to PHYSICA. Please try again.",
                        "ai"
                    );


                } finally {

                    chatMessage.disabled = false;

                    chatButton.disabled = false;

                    chatMessage.focus();

                }

            }
        );

    }

});
