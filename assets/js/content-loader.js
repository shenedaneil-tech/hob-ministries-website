(function () {
  const fallback = window.HOB_DATA || {};
  const files = {
    site: "content/site.json",
    home: "content/home.json",
    about: "content/about.json",
    events: "content/events.json",
    team: "content/team.json",
    giving: "content/giving.json",
    contact: "content/contact.json"
  };

  async function getJSON(path) {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) throw new Error(`${path}: ${response.status}`);
    return response.json();
  }

  window.HOB_READY = (async function () {
    const loaded = {};
    await Promise.all(Object.entries(files).map(async ([key, path]) => {
      try { loaded[key] = await getJSON(path); }
      catch (error) { console.warn("Using fallback content for", key, error); }
    }));

    const site = loaded.site || {};
    const about = loaded.about || {};
    const events = loaded.events || {};
    const team = loaded.team || {};
    const home = loaded.home || {};
    const giving = loaded.giving || {};
    const contact = loaded.contact || {};

    window.HOB_DATA = {
      ...fallback,
      site: { ...(fallback.site || {}), ...site },
      interactiveMode: site.interactiveMode || fallback.interactiveMode || "native",
      launchers: { ...(fallback.launchers || {}), ...(site.launchers || {}) },
      home,
      about,
      giving,
      contact,
      recurringEvents: events.recurringEvents || fallback.recurringEvents || [],
      events: events.events || fallback.events || [],
      leaders: team.leaders || fallback.leaders || [],
      supportStaff: team.supportStaff || fallback.supportStaff || [],
      values: about.values || fallback.values || [],
      beliefs: about.beliefs || fallback.beliefs || [],
      images: {
        ...(fallback.images || {}),
        homeHero: home.hero?.image || fallback.images?.homeHero,
        welcome: home.online?.image || fallback.images?.welcome,
        nextSteps: home.nextStep?.image || fallback.images?.nextSteps,
        about1: home.welcome?.image || about.storyImage || fallback.images?.about1,
        about2: about.missionImage || fallback.images?.about2,
        giving: giving.image || fallback.images?.giving,
        contact: contact.image || fallback.images?.contact
      }
    };

    const schedule = {};
    for (const item of window.HOB_DATA.recurringEvents) {
      if (item.key) schedule[item.key] = item;
    }
    window.HOB_DATA.schedule = schedule;
    return window.HOB_DATA;
  })();
})();
