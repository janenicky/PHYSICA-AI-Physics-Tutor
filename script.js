document.addEventListener("DOMContentLoaded", function () {

    const startButton =
        document.querySelector(
            'a[href="#topics"]'
        );


    const topics =
        document.getElementById("topics");


    if (startButton && topics) {

        startButton.addEventListener(
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
                event.clientX /
                window.innerWidth -
                0.5;


            const y =
                event.clientY /
                window.innerHeight -
                0.5;


            targetX =
                x * 9;


            targetY =
                y * -9;

        }
    );


    function animate() {

        currentX +=
            (targetX - currentX) * 0.05;


        currentY +=
            (targetY - currentY) * 0.05;


        physicsCard.style.setProperty(
            "--mouse-x",
            `${currentX}deg`
        );


        physicsCard.style.setProperty(
            "--mouse-y",
            `${currentY}deg`
        );


        requestAnimationFrame(
            animate
        );

    }


    animate();

});

const navbar =
    document.querySelector(".navbar");


if (navbar) {

    window.addEventListener(
        "scroll",
        function () {

            if (window.scrollY > 20) {

                navbar.style.background =
                    "rgba(7, 9, 15, .82)";

                navbar.style.borderBottomColor =
                    "rgba(255,255,255,.10)";

                navbar.style.boxShadow =
                    "0 10px 35px rgba(0,0,0,.12)";

            } else {

                navbar.style.background =
                    "rgba(7, 9, 15, .68)";

                navbar.style.borderBottomColor =
                    "rgba(255,255,255,.07)";

                navbar.style.boxShadow =
                    "none";

            }

        }
    );

}
