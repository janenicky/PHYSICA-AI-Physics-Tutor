const startLearning = document.getElementById("start-learning");
const topicsSection = document.getElementById("topics");
const selectedTopic = document.getElementById("selected-topic");

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

});
