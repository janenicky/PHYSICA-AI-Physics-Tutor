document.addEventListener("DOMContentLoaded", function () {

    const startLearning =
        document.querySelector(
            'a[href="#topics"]'
        );


    const topics =
        document.getElementById("topics");


    if (
        startLearning &&
        topics
    ) {

        startLearning.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                topics.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    }

});
