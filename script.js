const startLearning = document.getElementById("start-learning");
const topicsSection = document.getElementById("topics");

startLearning.addEventListener("click", function () {
    topicsSection.scrollIntoView({
        behavior: "smooth"
    });
});


