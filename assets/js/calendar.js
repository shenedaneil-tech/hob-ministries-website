(async function () {
  if (!document.getElementById("calendarWeek")) return;
  const D = await (window.HOB_READY || Promise.resolve(window.HOB_DATA));
  let anchor = new Date();
  anchor.setHours(12,0,0,0);

  function startOfWeek(d) {
    const x = new Date(d); x.setDate(x.getDate() - x.getDay()); x.setHours(12,0,0,0); return x;
  }
  function ymd(d) {
    const y = d.getFullYear(); const m = String(d.getMonth()+1).padStart(2,"0"); const day = String(d.getDate()).padStart(2,"0");
    return `${y}-${m}-${day}`;
  }
  function fmtTime(s) {
    const [h,m] = s.split(":").map(Number); const d = new Date(); d.setHours(h,m); return d.toLocaleTimeString([], {hour:"numeric",minute:"2-digit"});
  }
  function eventsFor(d) {
    const recurring = D.recurringEvents.filter(e => Number(e.weekday) === d.getDay()).map(e => ({...e, date: ymd(d)}));
    const oneOff = D.events.filter(e => e.date === ymd(d));
    return [...recurring, ...oneOff].sort((a,b) => (a.start || "").localeCompare(b.start || ""));
  }
  function eventMarkup(e) {
    const body = `<div class="event-pill"><strong>${e.title}</strong><span>${e.start ? fmtTime(e.start) : ""}${e.end ? ` – ${fmtTime(e.end)}` : ""}</span>${e.description ? `<div>${e.description}</div>` : ""}</div>`;
    return e.link ? `<a href="${e.link}" target="_blank" rel="noopener" aria-label="${e.title}">${body}</a>` : body;
  }
  function render() {
    const start = startOfWeek(anchor);
    const end = new Date(start); end.setDate(end.getDate()+6);
    document.getElementById("weekLabel").textContent = `${start.toLocaleDateString([], {month:"long",day:"numeric",year:"numeric"})} – ${end.toLocaleDateString([], {month:"long",day:"numeric",year:"numeric"})}`;
    document.getElementById("calendarWeek").innerHTML = Array.from({length:7}, (_,i) => {
      const d = new Date(start); d.setDate(start.getDate()+i);
      const evs = eventsFor(d);
      return `<div class="day-column"><div class="day-head"><strong>${d.toLocaleDateString([], {weekday:"short"})}</strong><span>${d.toLocaleDateString([], {month:"short",day:"numeric"})}</span></div>${evs.length ? evs.map(eventMarkup).join("") : `<span style="color:#8c8985;font-size:.86rem">No events</span>`}</div>`;
    }).join("");
  }
  document.getElementById("prevWeek").addEventListener("click", () => { anchor.setDate(anchor.getDate()-7); render(); });
  document.getElementById("nextWeek").addEventListener("click", () => { anchor.setDate(anchor.getDate()+7); render(); });
  document.getElementById("todayWeek").addEventListener("click", () => { anchor = new Date(); anchor.setHours(12,0,0,0); render(); });
  render();
})();
