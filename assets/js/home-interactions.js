(function () {
  const track = document.querySelector("[data-carousel]");
  const previous = document.querySelector("[data-carousel-prev]");
  const next = document.querySelector("[data-carousel-next]");

  if (!track) return;

  function cardDistance() {
    const card = track.querySelector(".explore-card");
    if (!card) return 380;
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 20;
    return card.getBoundingClientRect().width + gap;
  }

  previous?.addEventListener("click", function () {
    track.scrollBy({ left: -cardDistance(), behavior: "smooth" });
  });

  next?.addEventListener("click", function () {
    track.scrollBy({ left: cardDistance(), behavior: "smooth" });
  });

  track.addEventListener("keydown", function (event) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    track.scrollBy({
      left: event.key === "ArrowRight" ? cardDistance() : -cardDistance(),
      behavior: "smooth"
    });
  });
})();
