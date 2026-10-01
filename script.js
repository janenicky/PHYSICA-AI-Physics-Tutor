const startLearning = document.getElementById("start-learning");
const topicsSection = document.getElementById("topics");

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
