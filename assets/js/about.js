(async function () {
  const D = await (window.HOB_READY || Promise.resolve(window.HOB_DATA));
  const values = document.getElementById("valuesGrid");
  const beliefs = document.getElementById("beliefsAccordion");
  if (values) values.innerHTML = D.values.map((v,i)=>`<article class="value"><span class="value-num">${String(i+1).padStart(2,"0")}</span><h3>${v.title}</h3><p>${v.text}</p></article>`).join("");
  if (beliefs) {
    beliefs.innerHTML = D.beliefs.map(b=>`<article class="accordion-item"><button class="accordion-btn" aria-expanded="false"><span>${b.title}</span><span>+</span></button><div class="accordion-panel"><div class="accordion-panel-inner">${b.text}<span class="scripture-refs">${b.refs || ""}</span></div></div></article>`).join("");
    document.querySelectorAll(".accordion-btn").forEach(btn=>btn.addEventListener("click",()=>{const panel=btn.nextElementSibling;const open=btn.getAttribute("aria-expanded")==="true";btn.setAttribute("aria-expanded",String(!open));btn.lastElementChild.textContent=open?"+":"−";panel.style.maxHeight=open?null:panel.scrollHeight+"px";}));
  }
})();
