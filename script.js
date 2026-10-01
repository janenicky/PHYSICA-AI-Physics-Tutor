document.addEventListener("DOMContentLoaded", function () {
    
    const startLearning =
        document.querySelector(
            'a[href="#topics"]'
        );


    const topics =
        document.getElementById("topics");


    if (startLearning && topics) {

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

    const physicsCard =
        document.getElementById("physics-card");


    if (!physicsCard) {
        return;
    }


    let targetX = 0;
    let targetY = 0;

    let currentX = 0;
    let currentY = 0;


    document.addEventListener(
        "mousemove",
        function (event) {

            const x =
                (event.clientX / window.innerWidth) - 0.5;

            const y =
                (event.clientY / window.innerHeight) - 0.5;


            targetX =
                x * 12;

            targetY =
                y * -12;

        }
    );


    function animatePhysics() {

        currentX +=
            (targetX - currentX) * 0.05;

        currentY +=
            (targetY - currentY) * 0.05;


        physicsCard.style.transform =
            `
            rotateX(${currentY}deg)
            rotateY(${currentX}deg)
            `;


        requestAnimationFrame(
            animatePhysics
        );

    }


    animatePhysics();


});
