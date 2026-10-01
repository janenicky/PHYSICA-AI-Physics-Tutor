document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       SMOOTH SCROLL
    ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", event => {

            const targetId =
                link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target =
                document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });


    /* =====================================================
       HERO PHYSICS PARALLAX
    ===================================================== */

    const physicsCard =
        document.getElementById("physics-card");


    if (physicsCard) {

        document.addEventListener(
            "mousemove",
            event => {

                const x =
                    (event.clientX / window.innerWidth - 0.5)
                    * 5;

                const y =
                    (event.clientY / window.innerHeight - 0.5)
                    * -5;


                physicsCard.style.setProperty(
                    "--mouse-x",
                    `${x}deg`
                );

                physicsCard.style.setProperty(
                    "--mouse-y",
                    `${y}deg`
                );

            }
        );

    }


    /* =====================================================
       NAVBAR
    ===================================================== */

    const navbar =
        document.querySelector(".navbar");


    if (navbar) {

        window.addEventListener(
            "scroll",
            () => {

                if (window.scrollY > 20) {

                    navbar.style.background =
                        "rgba(7,9,15,.88)";

                } else {

                    navbar.style.background =
                        "rgba(7,9,15,.72)";

                }

            },
            { passive: true }
        );

    }

});
