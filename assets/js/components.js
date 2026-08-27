(async function () {
  const D = await (window.HOB_READY || Promise.resolve(window.HOB_DATA));
  const page = document.body.dataset.page || "";

  const nav = [
    ["index.html", "Home", "home"],
    ["about-us.html", "About Us", "about"],
    ["next-steps.html", "Next Steps", "next"],
    ["calendar.html", "Calendar", "calendar"],
    ["giving.html", "Giving", "giving"],
    ["staff-leaders.html", "Staff & Leaders", "staff"],
    ["contact-us.html", "Contact Us", "contact"]
  ];

  const sundayText = D.schedule?.sunday?.displayText || "Sunday mornings at 10:30 a.m.";

  function header() {
    const links = nav.map(([href, label, key]) => `<a href="${href}" class="${page === key ? "active" : ""}">${label}</a>`).join("");
    return `<a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header">
      <div class="container nav-wrap">
        <a class="brand" href="index.html" aria-label="House of Bread Ministries home">
          <img class="header-logo" src="assets/images/hob-logo.png?v=transparent-2" alt="House of Bread Ministries">
        </a>
        <button class="menu-btn" aria-expanded="false" aria-label="Open menu">☰</button>
        <nav class="nav-links" aria-label="Primary">${links}<a class="nav-cta js-action" data-action="planVisit" href="#">Plan a Visit</a></nav>
      </div>
    </header>`;
  }

  function footer() {
    const s = D.site;
    return `<section class="footer-cta section-sm">
      <div class="container footer-cta-inner">
        <div><p class="eyebrow" style="color:#e2c8b5">Join us this Sunday</p><h2>There’s a place for you here.</h2><p style="color:rgba(255,255,255,.78);margin:0">${sundayText} Come worship, grow, and connect with the House of Bread family.</p></div>
        <div class="actions"><a class="btn btn-light js-action" data-action="planVisit" href="#">Plan a Visit</a><a class="btn btn-outline-light" href="next-steps.html">Take Your Next Step</a></div>
      </div>
    </section>
    <footer class="site-footer">
      <div class="container footer-grid">
        <div><div class="brand"><span class="brand-logo-shell footer-logo-shell"><img class="brand-logo" src="assets/images/hob-logo.png?v=transparent-2" alt=""></span><span class="brand-copy"><strong>${s.name}</strong><small>${s.tagline}</small></span></div><p>${s.nonprofit}</p></div>
        <div><strong>Contact</strong><p><a href="mailto:${s.email}">${s.email}</a><br><a href="tel:${s.phoneLink}">${s.phoneDisplay}</a><br>${s.address1}<br>${s.cityStateZip}</p></div>
        <div><strong>Connect</strong><p><a class="js-action" data-action="prayerHub" href="#">Prayer</a><br><a class="js-action" data-action="planVisit" href="#">Plan a Visit</a><br><a href="${s.instagram}" target="_blank" rel="noopener">Instagram</a><br><a href="${s.youtube}" target="_blank" rel="noopener">YouTube</a></p></div>
      </div>
      <div class="container footer-bottom"><small>© <span id="year"></span> ${s.name}. All Rights Reserved.</small><small>A welcoming church family in Mount Vernon, New York.</small></div>
    </footer>`;
  }

  function modalMarkup() {
    return `<div class="modal" id="nativeModal" aria-hidden="true">
      <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <div class="modal-head"><div><p class="eyebrow">House of Bread Ministries</p><h2 id="modalTitle">Connect with us</h2></div><button class="modal-close" aria-label="Close">×</button></div>
        <p id="modalIntro" class="form-note"></p>
        <form id="nativeForm">
          <input type="hidden" id="formType" name="request_type" value="General">
          <div class="form-grid">
            <div class="field"><label for="name">Name</label><input id="name" name="name" required></div>
            <div class="field"><label for="email">Email</label><input id="email" name="email" type="email" required></div>
            <div class="field"><label for="phone">Phone</label><input id="phone" name="phone" type="tel"></div>
            <div class="field"><label for="visitDate">Preferred date</label><input id="visitDate" name="preferred_date" type="date"></div>
            <div class="field full"><label for="message">Message</label><textarea id="message" name="message" required></textarea></div>
            <div class="field full"><button class="btn btn-primary" type="submit">Send</button><div class="form-note">This form opens your email app until a form service is configured.</div></div>
          </div>
        </form>
      </div>
    </div>`;
  }

  document.getElementById("siteHeader").innerHTML = header();
  document.getElementById("siteFooter").innerHTML = footer();
  document.body.insertAdjacentHTML("beforeend", modalMarkup());
  document.getElementById("year").textContent = new Date().getFullYear();

  function getPath(path) {
    return path.split(".").reduce((value, key) => value == null ? undefined : value[key], D);
  }

  document.querySelectorAll("[data-bind]").forEach(el => {
    const value = getPath(el.dataset.bind);
    if (value !== undefined && value !== null) el.textContent = value;
  });
  document.querySelectorAll("[data-bind-href]").forEach(el => {
    const value = getPath(el.dataset.bindHref);
    if (value) el.href = value;
  });
  document.querySelectorAll("[data-bind-mail]").forEach(el => {
    const value = getPath(el.dataset.bindMail);
    if (value) el.href = `mailto:${value}`;
  });
  document.querySelectorAll("[data-bind-tel]").forEach(el => {
    const value = getPath(el.dataset.bindTel);
    if (value) el.href = `tel:${value}`;
  });
  document.querySelectorAll("[data-img-key]").forEach(img => {
    const key = img.dataset.imgKey;
    if (D.images?.[key]) img.src = D.images[key];
  });

  const menu = document.querySelector(".menu-btn");
  const links = document.querySelector(".nav-links");
  menu?.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    menu.setAttribute("aria-expanded", String(open));
  });

  const modal = document.getElementById("nativeModal");
  const title = document.getElementById("modalTitle");
  const intro = document.getElementById("modalIntro");
  const formType = document.getElementById("formType");
  const message = document.getElementById("message");

  const nativeCopy = {
    planVisit: ["Plan a Visit", "Tell us when you plan to visit and how we can help make your first Sunday feel welcoming.", "Plan a Visit"],
    sayHello: ["Say Hello", "Send a message to House of Bread Ministries.", "Say Hello"],
    prayerRequest: ["Prayer Request", "Share how our church family can pray with you.", "Prayer Request"],
    prayerHub: ["Prayer", "Send a prayer request to our ministry team.", "Prayer Request"],
    bibleStudy: ["Bible Study", "Let us know you would like details about Wednesday Bible Study.", "Bible Study"],
    youthService: ["Youth Service", "Let us know you would like more information about Friday Youth Service.", "Youth Service"],
    zelleInfo: ["Give via Zelle", `Use ${D.site.email} in Zelle. If this is your first time giving, include your name and contact information for receipting.`, "Giving Question"],
    inPersonGiving: ["Give In Person", "Tithes and offerings can be given during worship services. Envelopes are available.", "Giving Question"]
  };

  function openNative(action) {
    const copy = nativeCopy[action] || nativeCopy.sayHello;
    title.textContent = copy[0]; intro.textContent = copy[1]; formType.value = copy[2]; message.value = "";
    modal.classList.add("open"); modal.setAttribute("aria-hidden", "false");
  }

  function doAction(action) {
    if (D.interactiveMode === "nucleus" && D.launchers?.[action]) {
      window.open(D.launchers[action], "_blank", "noopener,noreferrer");
    } else {
      openNative(action);
    }
  }

  document.addEventListener("click", e => {
    const actionEl = e.target.closest(".js-action");
    if (actionEl) { e.preventDefault(); doAction(actionEl.dataset.action); }
    if (e.target.matches(".modal-close") || e.target === modal) { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); }
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); }
  });

  document.getElementById("nativeForm").addEventListener("submit", e => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const subject = encodeURIComponent(`[HOB Website] ${fd.get("request_type")}`);
    const body = encodeURIComponent(`Name: ${fd.get("name")}\nEmail: ${fd.get("email")}\nPhone: ${fd.get("phone")}\nPreferred date: ${fd.get("preferred_date")}\n\n${fd.get("message")}`);
    window.location.href = `mailto:${D.site.email}?subject=${subject}&body=${body}`;
  });
})();
