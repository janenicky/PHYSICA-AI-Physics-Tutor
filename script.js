document.addEventListener("DOMContentLoaded", () => {
  const topics = document.getElementById("topics");
  const startButton = document.querySelector('a[href="#topics"]');
  const physicsCard = document.getElementById("physics-card");
  const navbar = document.querySelector(".navbar");

  if (startButton && topics) {
    startButton.addEventListener("click", (event) => {
      event.preventDefault();
      topics.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  if (physicsCard) {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener("mousemove", (event) => {
      targetX = (event.clientX / window.innerWidth - 0.5) * 7;
      targetY = (event.clientY / window.innerHeight - 0.5) * -7;
    });

    const animate = () => {
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      physicsCard.style.setProperty("--mouse-x", `${currentX}deg`);
      physicsCard.style.setProperty("--mouse-y", `${currentY}deg`);

      requestAnimationFrame(animate);
    };

    animate();
  }

  if (navbar) {
    const updateNavbar = () => {
      navbar.classList.toggle("scrolled", window.scrollY > 20);
    };

    updateNavbar();
    window.addEventListener("scroll", updateNavbar, { passive: true });
  }
});
