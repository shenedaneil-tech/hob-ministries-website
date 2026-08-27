(function () {
  const panels = Array.from(document.querySelectorAll("[data-journey-panel]"));
  if (!panels.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      entry.target.classList.toggle("is-current", entry.isIntersecting);
    });
  }, {
    rootMargin: "-18% 0px -42% 0px",
    threshold: 0.25
  });

  panels.forEach(function (panel) {
    observer.observe(panel);
  });
})();
