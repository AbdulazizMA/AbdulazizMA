(() => {
  "use strict";

  // Mobile menu
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  // Conversion tracking (only if GA4 is configured)
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-track]");
    if (a && typeof window.gtag === "function") {
      window.gtag("event", "generate_lead", { method: a.dataset.track, page_path: location.pathname });
    }
  });

  // ------------------------------------------------------------------------
  // Investor brief form → WhatsApp (+ optional Formspree email copy)
  // ------------------------------------------------------------------------
  const form = document.getElementById("brief");
  if (form) {
    const ar = form.dataset.lang === "ar";
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      if (fd.get("_gotcha")) return; // bot
      let ok = true;
      for (const el of form.querySelectorAll("[required]")) {
        const valid = el.type === "radio" ? form.querySelector(`[name="${el.name}"]:checked`) : el.value.trim();
        const target = el.type === "radio" ? el.closest("fieldset") : el;
        target.classList.toggle("invalid", !valid);
        if (!valid && ok) { target.scrollIntoView({ behavior: "smooth", block: "center" }); ok = false; }
      }
      if (!ok) return;

      const types = fd.getAll("type").join("، ") || "—";
      const L = ar
        ? ["طلب استثماري جديد من الموقع", "الاسم", "الجوال", "الهدف", "نوع العقار", "الميزانية", "طريقة الشراء", "التوقيت", "الأحياء", "ملاحظات"]
        : ["New investment brief from website", "Name", "Mobile", "Goal", "Property type", "Budget", "Payment", "Timing", "Areas", "Notes"];
      const lines = [
        `*${L[0]}*`,
        `${L[1]}: ${fd.get("name")}`,
        `${L[2]}: ${fd.get("phone")}`,
        `${L[3]}: ${fd.get("goal") || "—"}`,
        `${L[4]}: ${types}`,
        `${L[5]}: ${fd.get("budget")}`,
        `${L[6]}: ${fd.get("pay") || "—"}`,
        `${L[7]}: ${fd.get("when")}`,
      ];
      if (fd.get("areas")) lines.push(`${L[8]}: ${fd.get("areas")}`);
      if (fd.get("notes")) lines.push(`${L[9]}: ${fd.get("notes")}`);
      const text = lines.join("\n");

      const endpoint = form.dataset.endpoint;
      if (endpoint) {
        // Fire-and-forget email copy so no lead is ever lost
        fetch(endpoint, { method: "POST", headers: { Accept: "application/json" }, body: fd }).catch(() => {});
      }
      if (typeof window.gtag === "function") window.gtag("event", "generate_lead", { method: "brief_form" });

      window.open(`https://wa.me/${form.dataset.wa}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
      const status = form.querySelector(".form-status");
      status.textContent = status.dataset.sent;
    });
    form.addEventListener("input", (e) => {
      e.target.classList.remove("invalid");
      e.target.closest("fieldset")?.classList.remove("invalid");
    });
  }

  // ------------------------------------------------------------------------
  // ROI calculator
  // ------------------------------------------------------------------------
  const calc = document.getElementById("roi");
  if (calc) {
    const ar = calc.dataset.lang === "ar";
    const labels = JSON.parse(calc.dataset.labels);
    const f = calc.querySelector("form");
    const outs = Object.fromEntries([...calc.querySelectorAll("output")].map((o) => [o.dataset.k, o]));
    const finBox = calc.querySelector(".fin-only");
    const send = document.getElementById("roi-send");
    const sar = (n) => `${Math.round(n).toLocaleString("en-US")} ${ar ? "ر.س" : "SAR"}`;
    const pct = (n) => (isFinite(n) ? `${n.toFixed(2)}%` : "—");
    const val = (name) => Math.max(0, parseFloat(f.elements[name].value) || 0);

    const run = () => {
      const price = val("price");
      const rett = f.elements.rett.checked ? price * 0.05 : 0;
      const brok = price * (val("brokerage") / 100);
      const vat = f.elements.vat.checked ? brok * 0.15 : 0;
      const total = price + rett + brok + vat + val("other");

      const rent = val("rent");
      const noi = rent * (1 - val("vacancy") / 100) - rent * (val("opex") / 100);

      const loan = price * (Math.min(val("ltv"), 100) / 100);
      const r = val("rate") / 100 / 12;
      const n = Math.max(1, val("term")) * 12;
      const monthly = loan === 0 ? 0 : r === 0 ? loan / n : (loan * r) / (1 - Math.pow(1 + r, -n));
      const debt = monthly * 12;
      const cash = total - loan;
      const cf = noi - debt;

      const res = {
        total: sar(total),
        gross: pct((rent / price) * 100),
        noi: sar(noi),
        net: pct((noi / total) * 100),
        debt: sar(debt),
        cash: sar(cash),
        cf: sar(cf),
        coc: pct((cf / cash) * 100),
        payback: cf > 0 ? `${(cash / cf).toFixed(1)} ${labels.years}` : "—",
      };
      for (const [k, v] of Object.entries(res)) if (outs[k]) outs[k].value = v;
      finBox.hidden = loan === 0;
      calc.querySelectorAll("[data-mirror]").forEach((m) => (m.textContent = res[m.dataset.mirror]));

      const keys = loan === 0 ? ["total", "gross", "noi", "net", "payback"] : ["total", "gross", "noi", "net", "debt", "cash", "cf", "coc", "payback"];
      const head = ar
        ? `السلام عليكم، حسبت عقارًا في حاسبة موقعك وأبغى رأيك:\nالسعر: ${sar(price)}\nالإيجار السنوي: ${sar(rent)}`
        : `Hello, I ran a property through your calculator and would like your view:\nPrice: ${sar(price)}\nAnnual rent: ${sar(rent)}`;
      send.href = `https://wa.me/${calc.dataset.wa}?text=${encodeURIComponent(head + "\n" + keys.map((k) => `${labels[k]}: ${res[k]}`).join("\n"))}`;
    };
    f.addEventListener("input", run);
    run();
  }
})();
