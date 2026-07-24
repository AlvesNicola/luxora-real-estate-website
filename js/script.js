/* LUXORA ESTATES — Vanilla JS */
(function () {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  // Year
  const y = $("#year"); if (y) y.textContent = new Date().getFullYear();

  // Header scroll
  const header = $("#header");
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
    const top = $("#toTop");
    if (window.scrollY > 500) top.classList.add("show");
    else top.classList.remove("show");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
  const hamb = $("#hamburger");
  const nav = $("#nav");
  hamb.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    hamb.classList.toggle("open", open);
    hamb.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
  });
  $$(".nav-link").forEach(l =>
    l.addEventListener("click", () => {
      nav.classList.remove("open");
      hamb.classList.remove("open");
      document.body.style.overflow = "";
    })
  );

  // Back to top
  $("#toTop").addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );

  // Reveal on scroll
  const io = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );
  $$(".reveal").forEach(el => io.observe(el));

  // Counters
  const animateCounter = el => {
    const target = +el.dataset.target;
    const dur = 1800;
    const start = performance.now();
    const step = t => {
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString();
    };
    requestAnimationFrame(step);
  };
  const cio = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          cio.unobserve(e.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  $$(".counter").forEach(el => cio.observe(el));

  // Property filter
  const filterBtns = $$(".filter");
  const cards = $$(".property-card");
  filterBtns.forEach(btn =>
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      cards.forEach(c => {
        const match = f === "all" || c.dataset.type === f;
        c.style.display = match ? "" : "none";
      });
    })
  );

  // Lightbox
  const lb = $("#lightbox");
  const lbImg = $("#lbImg");
  const galleryImgs = $$("#gallery img");
  let lbIndex = 0;
  const openLB = i => {
    lbIndex = i;
    lbImg.src = galleryImgs[i].src;
    lbImg.alt = galleryImgs[i].alt;
    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };
  const closeLB = () => {
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };
  const navLB = d => {
    lbIndex = (lbIndex + d + galleryImgs.length) % galleryImgs.length;
    lbImg.src = galleryImgs[lbIndex].src;
    lbImg.alt = galleryImgs[lbIndex].alt;
  };
  galleryImgs.forEach((img, i) => img.parentElement.addEventListener("click", () => openLB(i)));
  $("#lbClose").addEventListener("click", closeLB);
  $("#lbPrev").addEventListener("click", () => navLB(-1));
  $("#lbNext").addEventListener("click", () => navLB(1));
  lb.addEventListener("click", e => { if (e.target === lb) closeLB(); });
  document.addEventListener("keydown", e => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") closeLB();
    if (e.key === "ArrowRight") navLB(1);
    if (e.key === "ArrowLeft") navLB(-1);
  });

  // Contact form
  const form = $("#contactForm");
  const status = $("#formStatus");
  form.addEventListener("submit", e => {
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get("name") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();
    const msg = (data.get("message") || "").toString().trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!name || !emailOk || !msg) {
      status.style.color = "#e57373";
      status.textContent = "Please fill in your name, a valid email, and a message.";
      return;
    }
    status.style.color = "";
    status.textContent = "Thank you — a private advisor will contact you within 24 hours.";
    form.reset();
  });
})();
