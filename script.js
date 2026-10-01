const startLearning = document.getElementById("start-learning");
const topicsSection = document.getElementById("topics");
const selectedTopic = document.getElementById("selected-topic");
const topicTitle = 
    document.getElementById("topic-title");

const topicDescription =
    document.getElementById("topic-description");

const topicStart =
    document.getElementById("topic-start");

startLearning.addEventListener("click", function () {
    topicsSection.scrollIntoView({
        behavior: "smooth"
    });
});

const tryTutor = document.getElementById("try-tutor");
const tutorSection = document.getElementById("tutor");

tryTutor.addEventListener("click", function () {
    tutorSection.scrollIntoView({
        behavior: "smooth"
    });
});

const topicCards = document.querySelectorAll(".topic-card");

topicCards.forEach(function (card) {

    card.addEventListener("click", function () {

        topicCards.forEach(function (otherCard) {
            otherCard.classList.remove("selected");
        });

        card.classList.add("selected");

        selectedTopic.textContent =
    "Selected topic: " + card.dataset.topic;
    });
        const topic =
    topics[card.dataset.topic];

topicTitle.textContent =
    topic.title;

topicDescription.textContent =
    topic.description;

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
