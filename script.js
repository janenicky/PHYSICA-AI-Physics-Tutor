document.addEventListener("DOMContentLoaded", function () {

    const startLearning =
        document.getElementById("start-learning");

    const topicsSection =
        document.getElementById("topics");

    const tryTutor =
        document.getElementById("try-tutor");

    const tutorSection =
        document.getElementById("tutor");

    startLearning.addEventListener("click", function () {

        topicsSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

    tryTutor.addEventListener("click", function () {

        tutorSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

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

    function selectTopic(card) {

        topicCards.forEach(function (otherCard) {

            otherCard.classList.remove("selected");

        });

        card.classList.add("selected");

        const topicName =
            card.dataset.topic;

        const topic =
            topics[topicName];

        selectedTopic.textContent =
            "Selected topic: " + topicName;

        topicTitle.textContent =
            topic.title;

        topicDescription.textContent =
            topic.description;

        topicInfo.classList.add("visible");

    }
    
    topicCards.forEach(function (card) {

        card.addEventListener("click", function () {

            selectTopic(card);

        });

        card.addEventListener("keydown", function (event) {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                selectTopic(card);

            }

        });

    });


    topicStart.addEventListener("click", function () {

        tutorSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

const chatForm =
    document.getElementById("chat-form");

const chatMessage =
    document.getElementById("chat-message");

const chatDemoButton =
    document.getElementById("chat-demo-button");

const messagesContainer =
    document.querySelector(".messages");


function addMessage(text, type) {

    const messageElement =
        document.createElement("div");

    messageElement.classList.add(
        "message",
        type
    );

    messageElement.textContent = text;

    messagesContainer.appendChild(
        messageElement
    );

    messagesContainer.scrollTop =
        messagesContainer.scrollHeight;

}


function addLoadingMessage() {

    const loadingElement =
        document.createElement("div");

    loadingElement.classList.add(
        "message",
        "ai",
        "loading-message"
    );

    loadingElement.textContent =
        "PHYSICA is thinking...";

    messagesContainer.appendChild(
        loadingElement
    );

    messagesContainer.scrollTop =
        messagesContainer.scrollHeight;

    return loadingElement;

}


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
        chatDemoButton.disabled = true;


        const loadingMessage =
            addLoadingMessage();


        try {

            const response =
                await fetch(
                    "https://soft-frost-e73a.nikjena09-09.workers.dev/",
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
                    "Something went wrong."
                );

            }


            loadingMessage.remove();


            addMessage(
                data.answer,
                "ai"
            );


        } catch (error) {

            console.error(
                "PHYSICA error:",
                error
            );


            loadingMessage.remove();


            addMessage(
                "I couldn't connect to PHYSICA right now. Please try again.",
                "ai"
            );


        } finally {

            chatMessage.disabled = false;
            chatDemoButton.disabled = false;

            chatMessage.focus();

        }

    }
);
