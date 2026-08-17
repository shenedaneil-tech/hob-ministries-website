(async function () {
  const D = await (window.HOB_READY || Promise.resolve(window.HOB_DATA));
  function initials(n){return n.split(" ").map(x=>x[0]).join("").slice(0,2)}
  function card(x) {
    const photo = x.photo ? `<img class="leader-photo-img" src="${x.photo}" alt="${x.name}">` : `<div class="leader-photo">${initials(x.name)}</div>`;
    return `<article class="leader-card">${photo}<div class="leader-body"><h3>${x.name}</h3><p>${x.role || "Support Staff"}</p></div></article>`;
  }
  document.getElementById("leaderGrid").innerHTML = D.leaders.map(card).join("");
  document.getElementById("supportGrid").innerHTML = D.supportStaff.map(card).join("");
})();
