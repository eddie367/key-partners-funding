/* Key Partners Funding: embedded Get Terms form (rehab-loans, new-construction, dscr).
   Usage: <div class="gt-embed" data-loan-type="fix_flip" data-source="rehab-loans"></div>
          <script src="/gt-form.js" defer></script>
   Posts to the DealHub loan intake (insert-only database function submit_loan_intake:
   honeypot, 5 per connection per hour, length limits; it cannot read anything).
   Same fields and validation as /get-terms. Prefills name/email/phone from the URL. */
(function () {
  var SB = "https://sqfdrrqodxxztvyskhgb.supabase.co", ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxZmRycnFvZHh4enR2eXNraGdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExMDE0NjAsImV4cCI6MjA5NjY3NzQ2MH0.-YWajsZHg8j0PzITkvNKuAQBx3eiWhz1AfpdZS5ybZY";
  var CSS = `
  .gt-embed .gt-sec { margin: 18px 0 6px; font-size: 13px; letter-spacing: 1.6px; text-transform: uppercase; font-weight: 700; color: var(--gold-deep, #A07A2C); }
  .gt-embed .gt-sec:first-of-type { margin-top: 4px; }
  .gt-embed .gt-hint { font-size: 13.5px; color: var(--ink-muted, #6B7280); line-height: 1.5; margin: 0 0 12px; }
  .gt-embed .gt-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 12px; }
  .gt-embed .gt-grid-3 { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 0 10px; }
  .gt-embed .gt-full { grid-column: 1 / -1; }
  .gt-embed .gt-field { margin-bottom: 12px; }
  .gt-embed .gt-field label, .gt-embed .gt-q { display: block; font-size: 12.5px; font-weight: 600; color: var(--navy, #0D1B2A); margin-bottom: 5px; }
  .gt-embed .gt-field input, .gt-embed .gt-field select, .gt-embed .gt-field textarea { width: 100%; box-sizing: border-box; padding: 11px 12px; border: 1px solid var(--rule, #E5E0D5); border-radius: 9px; font: inherit; font-size: 16px; color: var(--ink, #1F2937); background: var(--paper, #FBF9F5); }
  .gt-embed .gt-field input:focus, .gt-embed .gt-field select:focus, .gt-embed .gt-field textarea:focus { outline: none; border-color: var(--gold, #C89B3C); background: #fff; }
  .gt-embed .gt-help { font-size: 12px; color: var(--ink-soft, #9CA3AF); margin-top: 3px; }
  .gt-embed .gt-yn { display: flex; border: 1px solid var(--rule, #E5E0D5); border-radius: 9px; overflow: hidden; background: #fff; }
  .gt-embed .gt-yn button { flex: 1; padding: 11px 8px; font: inherit; font-size: 15px; font-weight: 600; border: 0; background: #fff; color: var(--navy, #0D1B2A); cursor: pointer; }
  .gt-embed .gt-yn button + button { border-left: 1px solid var(--rule, #E5E0D5); }
  .gt-embed .gt-yn button[aria-pressed="true"] { background: var(--navy, #0D1B2A); color: var(--cream, #F8F4ED); }
  .gt-embed .gt-err { display: none; background: #FEF2F2; border-left: 4px solid #B91C1C; color: #991B1B; padding: 11px 13px; border-radius: 9px; font-size: 14px; margin: 6px 0 12px; }
  .gt-embed .gt-fine { font-size: 12px; color: var(--ink-soft, #9CA3AF); text-align: center; line-height: 1.5; margin-top: 10px; }
  .gt-embed .gt-hp { position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden; }
  .gt-embed .gt-done h3 { font-family: var(--display, Georgia, serif); font-weight: 600; font-size: 26px; color: var(--navy, #0D1B2A); margin: 6px 0 8px; }
  .gt-embed .gt-done ol { padding-left: 20px; line-height: 1.6; margin: 10px 0 0; }
  @media (max-width: 560px) { .gt-embed .gt-grid, .gt-embed .gt-grid-3 { grid-template-columns: minmax(0, 1fr); } }`;
  var STATES = `<option value="">Choose</option><option value="AL">AL</option><option value="AK">AK</option><option value="AZ">AZ</option><option value="AR">AR</option><option value="CA">CA</option><option value="CO">CO</option><option value="CT">CT</option><option value="DE">DE</option><option value="DC">DC</option><option value="FL">FL</option><option value="GA">GA</option><option value="HI">HI</option><option value="ID">ID</option><option value="IL">IL</option><option value="IN">IN</option><option value="IA">IA</option><option value="KS">KS</option><option value="KY">KY</option><option value="LA">LA</option><option value="ME">ME</option><option value="MD">MD</option><option value="MA">MA</option><option value="MI">MI</option><option value="MN">MN</option><option value="MS">MS</option><option value="MO">MO</option><option value="MT">MT</option><option value="NE">NE</option><option value="NV">NV</option><option value="NH">NH</option><option value="NJ">NJ</option><option value="NM">NM</option><option value="NY">NY</option><option value="NC">NC</option><option value="ND">ND</option><option value="OH">OH</option><option value="OK">OK</option><option value="OR">OR</option><option value="PA">PA</option><option value="RI">RI</option><option value="SC">SC</option><option value="SD">SD</option><option value="TN">TN</option><option value="TX">TX</option><option value="UT">UT</option><option value="VT">VT</option><option value="VA">VA</option><option value="WA">WA</option><option value="WV">WV</option><option value="WI">WI</option><option value="WY">WY</option>`;
  function properName(name) {
    var s = String(name == null ? "" : name).trim().replace(/\s+/g, " ");
    if (!s || /^(zz|demo)\b/i.test(s)) return s;
    return s.split(" ").map(function (part) {
      if (/^\p{Lu}/u.test(part) && /\p{Ll}/u.test(part)) return part;
      return part.toLowerCase().replace(/(^|[-'’])(\p{L})/gu, function (_, sep, ch) { return sep + ch.toUpperCase(); });
    }).join(" ");
  }
  function esc(s) { return String(s || "").replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function f(label, inner, cls) { return '<div class="gt-field' + (cls ? " " + cls : "") + '"><label>' + label + "</label>" + inner + "</div>"; }
  function yn(name, q) {
    return '<div class="gt-field"><span class="gt-q">' + q + '</span><div class="gt-yn" data-name="' + name + '" role="group" aria-label="' + esc(q) + '">'
      + '<button type="button" data-v="yes" aria-pressed="false">Yes</button><button type="button" data-v="no" aria-pressed="false">No</button></div></div>';
  }
  function formHtml(type) {
    var opt = function (v, l) { return '<option value="' + v + '"' + (v === type ? " selected" : "") + ">" + l + "</option>"; };
    return '<form novalidate>'
      + '<div class="gt-hp" aria-hidden="true"><label>Website <input name="website" tabindex="-1" autocomplete="off"></label></div>'
      + '<div class="gt-sec">About you</div><div class="gt-grid">'
      + f("Full name *", '<input name="name" autocomplete="name" maxlength="200">')
      + f("Email *", '<input name="email" type="email" autocomplete="email" maxlength="200">')
      + f("Phone", '<input name="phone" type="tel" autocomplete="tel" maxlength="40">')
      + f("Entity name (LLC)", '<input name="entity" maxlength="200">')
      + '</div><div class="gt-sec">The deal</div><p class="gt-hint">Your best estimates are fine. We confirm everything before terms are final.</p><div class="gt-grid">'
      + f("Loan type *", '<select name="loan_type"><option value="">Choose</option>' + opt("fix_flip", "Fix and flip") + opt("ground_up", "Ground up") + opt("dscr", "DSCR") + "</select>", "gt-full")
      + f("Street address *", '<input name="property_address" autocomplete="address-line1" maxlength="300">', "gt-full")
      + '</div><div class="gt-grid-3">'
      + f("City *", '<input name="city" autocomplete="address-level2" maxlength="100">')
      + f("State *", '<select name="state" autocomplete="address-level1">' + STATES + "</select>")
      + f("ZIP *", '<input name="zip" inputmode="numeric" autocomplete="postal-code" maxlength="5">')
      + '</div><div class="gt-grid">'
      + f("Estimated close date *", '<input name="close_date" type="date">')
      + f("Purchase price *", '<input name="purchase_price" inputmode="decimal" maxlength="20" placeholder="$">')
      + f((type === "ground_up" ? "Construction" : "Rehab") + ' budget *', '<input name="rehab_amount" inputmode="decimal" maxlength="20" placeholder="$"><div class="gt-help">Enter 0 if there is none.</div>')
      + f((type === "dscr" ? "Property value" : "After repair value (ARV)") + " *", '<input name="arv" inputmode="decimal" maxlength="20" placeholder="$">')
      + f("Estimated credit score *", '<select name="credit_band"><option value="">Choose</option><option value="780+">780+</option><option value="740-779">740 to 779</option><option value="700-739">700 to 739</option><option value="660-699">660 to 699</option><option value="&lt;660">Below 660</option></select>')
      + f("Exit plan", '<select name="exit"><option value="">Choose</option><option value="sell"' + (type === "fix_flip" ? " selected" : "") + '>Sell</option><option value="rent"' + (type === "dscr" ? " selected" : "") + ">Rent</option></select>")
      + f("Anything else we should know?", '<textarea name="notes" rows="3" maxlength="2000"></textarea>', "gt-full")
      + '</div><div class="gt-sec">Your experience</div><p class="gt-hint">Your experience sets your rate and leverage. Count only properties you personally owned or controlled through your company.</p><div class="gt-grid">'
      + f("Rentals bought and held at least 1 year *", '<input name="rentals_held_1yr" type="number" min="0" inputmode="numeric" placeholder="0">')
      + f("Flips completed and sold in the last 36 months *", '<input name="flips_sold_36mo" type="number" min="0" inputmode="numeric" placeholder="0">')
      + "</div>"
      + yn("has_had_mortgage", "Have you ever had a mortgage, including on your personal residence? *")
      + yn("lives_in_property_state", "Do you live in the same state as the investment property? *")
      + '<div class="gt-err"></div>'
      + '<button type="submit" class="form-submit">Send for terms →</button>'
      + '<p class="gt-fine">Business purpose loans for investment properties only. Submitting does not pull your credit and is not a commitment to lend.</p>'
      + "</form>";
  }
  var ERR = {
    rate_limited: "We received several submissions from this connection in the last hour. Please try again later or call 615-979-6260.",
    missing_required: "Please fill in every field marked with an asterisk: loan type, the full property address with a 5 digit ZIP, the numbers, the close date, your credit score, and all four experience questions.",
    invalid: "Something in the form looks off. Please check the numbers and dates and try again."
  };
  function mount(box) {
    var type = box.getAttribute("data-loan-type") || "", page = box.getAttribute("data-source") || "website";
    box.innerHTML = formHtml(type);
    var form = box.querySelector("form"), err = box.querySelector(".gt-err"), btn = form.querySelector('button[type="submit"]');
    var q = new URLSearchParams(window.location.search);
    var full = q.get("name") || [q.get("first_name"), q.get("last_name")].filter(Boolean).join(" ");
    if (full) form.elements.name.value = full;
    if (q.get("email")) form.elements.email.value = q.get("email");
    if (q.get("phone")) form.elements.phone.value = q.get("phone");
    form.elements.zip.addEventListener("input", function () { form.elements.zip.value = form.elements.zip.value.replace(/\D/g, "").slice(0, 5); });
    var ynv = {};
    box.querySelectorAll(".gt-yn").forEach(function (g) {
      g.querySelectorAll("button").forEach(function (b) {
        b.addEventListener("click", function () {
          ynv[g.getAttribute("data-name")] = b.getAttribute("data-v");
          g.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        });
      });
    });
    function showErr(m) { err.textContent = m; err.style.display = "block"; err.scrollIntoView({ behavior: "smooth", block: "center" }); }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      err.style.display = "none";
      var p = { source: "website: " + page };
      ["website", "name", "email", "phone", "entity", "loan_type", "property_address", "city", "state", "zip", "close_date", "purchase_price", "rehab_amount", "arv", "credit_band", "exit", "notes", "rentals_held_1yr", "flips_sold_36mo"]
        .forEach(function (k) { var el = form.elements[k]; p[k] = el ? el.value : ""; });
      p.has_had_mortgage = ynv.has_had_mortgage || "";
      p.lives_in_property_state = ynv.lives_in_property_state || "";
      var money = function (v) { return String(v).replace(/[^0-9.]/g, ""); };
      if (!p.name.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(p.email) || !p.loan_type || p.property_address.trim().length < 3
          || !p.city.trim() || !/^[A-Z]{2}$/.test(p.state) || !/^\d{5}$/.test(p.zip.trim()) || !p.close_date || !p.credit_band
          || !(Number(money(p.purchase_price)) > 0) || money(p.rehab_amount) === "" || !(Number(money(p.arv)) > 0)
          || p.rentals_held_1yr === "" || p.flips_sold_36mo === "" || !p.has_had_mortgage || !p.lives_in_property_state) { showErr(ERR.missing_required); return; }
      btn.disabled = true; btn.style.opacity = 0.6;
      fetch(SB + "/rest/v1/rpc/submit_loan_intake", {
        method: "POST",
        headers: { "apikey": ANON, "Authorization": "Bearer " + ANON, "Content-Type": "application/json" },
        body: JSON.stringify({ p: p })
      }).then(function (r) { return r.text().then(function (t) { return { ok: r.ok, t: t }; }); })
        .then(function (res) {
          btn.disabled = false; btn.style.opacity = 1;
          if (!res.ok) {
            var k = Object.keys(ERR).find(function (x) { return res.t.indexOf(x) >= 0; });
            showErr(ERR[k] || "Something went wrong. Please try again or call 615-979-6260.");
            return;
          }
          box.innerHTML = '<div class="gt-done"><div class="form-success-mark">✓</div><h3>Thanks, ' + esc(properName(p.name.trim().split(/\s+/)[0]))
            + '. We have your deal.</h3><p>We are reviewing ' + esc(p.property_address.trim() + ", " + p.city.trim())
            + ' now. You will hear from us within one business day with your terms or any questions.</p><ol><li>We review your deal and experience.</li>'
            + '<li>We email you a term sheet you can review and accept online.</li><li>Once you accept, we collect a few documents and coordinate with the lender through closing.</li></ol>'
            + '<p style="margin-top:14px">Questions? Call or text <a href="tel:6159796260">615-979-6260</a>.</p></div>';
          box.scrollIntoView({ behavior: "smooth", block: "start" });
        })
        .catch(function () { btn.disabled = false; btn.style.opacity = 1; showErr("We couldn't reach our server. Please try again or call 615-979-6260."); });
    });
  }
  function init() {
    if (!document.getElementById("gt-embed-css")) { var st = document.createElement("style"); st.id = "gt-embed-css"; st.textContent = CSS; document.head.appendChild(st); }
    document.querySelectorAll(".gt-embed").forEach(mount);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
