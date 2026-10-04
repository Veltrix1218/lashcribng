/* ==========================================================================
   LASH CRIB NG — SITE SCRIPT
   ========================================================================== */

const WHATSAPP_NUMBER = "2348154801762";

document.addEventListener("DOMContentLoaded", function () {

  /* ========================================================================
     MOBILE NAVIGATION
     ======================================================================== */
  const hamburger = document.getElementById("hamburger");
  const menuClose = document.getElementById("menuclose");
  const mobileNav = document.getElementById("mobileNav");

  if (hamburger && menuClose && mobileNav) {
    hamburger.addEventListener("click", function () {
      mobileNav.classList.add("active");
      hamburger.classList.add("active");
      document.body.classList.add("menu-open");
    });
    menuClose.addEventListener("click", closeMobileNav);
    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMobileNav);
    });
    function closeMobileNav() {
      mobileNav.classList.remove("active");
      hamburger.classList.remove("active");
      document.body.classList.remove("menu-open");
    }
  } else {
    console.warn("Mobile nav: expected #hamburger, #menuclose, #mobileNav — check none of them were renamed.");
  }

  /* ========================================================================
     STICKY HEADER SHADOW
     ======================================================================== */
  const header = document.getElementById("header");
  if (header) {
    window.addEventListener("scroll", function () {
      header.classList.toggle("scrolled", window.scrollY > 10);
    }, { passive: true });
  }

  /* ========================================================================
     HERO SLIDER — crossfade, changes every 5 seconds as requested.
     Opacity transition (set in CSS, 1.2s ease) is the "fade movement"
     that plays each time .active moves to the next slide.
     ======================================================================== */
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".hero-dot");
  const prevBtn = document.getElementById("heroperv");
  const nextBtn = document.getElementById("hero-next");
  let current = 0;
  let slideTimer = null;
  const SLIDE_DURATION = 5000; // 5 seconds, as requested

  function goToSlide(index) {
    if (!slides.length) return;
    slides.forEach(function (s) { s.classList.remove("active"); });
    dots.forEach(function (d) { d.classList.remove("active"); });
    slides[index].classList.add("active");
    if (dots[index]) dots[index].classList.add("active");
    current = index;
  }
  function nextSlide() { goToSlide((current + 1) % slides.length); }
  function prevSlide() { goToSlide((current - 1 + slides.length) % slides.length); }
  function startAutoplay() { stopAutoplay(); slideTimer = setInterval(nextSlide, SLIDE_DURATION); }
  function stopAutoplay() { if (slideTimer) clearInterval(slideTimer); }

  if (slides.length) {
    startAutoplay();
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () { goToSlide(i); startAutoplay(); });
    });
    if (nextBtn) nextBtn.addEventListener("click", function () { nextSlide(); startAutoplay(); });
    if (prevBtn) prevBtn.addEventListener("click", function () { prevSlide(); startAutoplay(); });

    const heroEl = document.querySelector(".home");
    if (heroEl) {
      heroEl.addEventListener("mouseenter", stopAutoplay);
      heroEl.addEventListener("mouseleave", startAutoplay);
      let touchStartX = 0;
      heroEl.addEventListener("touchstart", function (e) { touchStartX = e.changedTouches[0].screenX; stopAutoplay(); }, { passive: true });
      heroEl.addEventListener("touchend", function (e) {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 40) { diff > 0 ? nextSlide() : prevSlide(); }
        startAutoplay();
      }, { passive: true });
    }
  }

  /* ========================================================================
     QUOTE FORM -> VALIDATE -> SHOW SUCCESS CARD -> REDIRECT TO WHATSAPP
     ======================================================================== */
  const quoteForm = document.getElementById("quote-form");
  const quoteSuccess = document.getElementById("quote-success");

  if (quoteForm) {
    quoteForm.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!quoteForm.checkValidity()) {
        quoteForm.reportValidity();
        return;
      }

      const data = Object.fromEntries(new FormData(quoteForm).entries());

      const lines = [
        "Hello Lash Crib Ng, I'd like to book an appointment:",
        "",
        `Name: ${data.fullName || "-"}`,
        `Phone: ${data.phone || "-"}`,
        `Email: ${data.email || "-"}`,
        `Service Needed: ${data.service || "-"}`,
        `Preferred Date: ${data.preferred_date || "-"}`,
        `Preferred Time: ${data.preferred_time || "-"}`,
        `Additional Requirements: ${data.message || "-"}`
      ];
      const message = encodeURIComponent(lines.join("\n"));
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

      if (quoteSuccess) {
        quoteSuccess.classList.add("active");
        document.body.classList.add("menu-open");
      }

      quoteForm.reset();

      setTimeout(function () {
        window.open(whatsappUrl, "_blank");
      }, 1400);
    });
  } else {
    console.warn('Quote form: no element with id="quote-form" found — WhatsApp redirect will not run.');
  }

  if (quoteSuccess) {
    quoteSuccess.addEventListener("click", function (e) {
      if (e.target === quoteSuccess) {
        quoteSuccess.classList.remove("active");
        document.body.classList.remove("menu-open");
      }
    });
  }

  /* ========================================================================
     MARVO BADGE — collapses to just the logo when the X is clicked,
     remembers the choice for future visits via localStorage.
     ======================================================================== */
  const marvoBadge = document.getElementById("marvoBadge");
  const marvoBadgeClose = document.getElementById("marvoBadgeClose");

  if (marvoBadge && marvoBadgeClose) {
    if (localStorage.getItem("marvoBadgeCollapsed") === "true") {
      marvoBadge.classList.add("collapsed");
    }
    marvoBadgeClose.addEventListener("click", function (e) {
      e.preventDefault();
      marvoBadge.classList.add("collapsed");
      localStorage.setItem("marvoBadgeCollapsed", "true");
    });
    marvoBadge.querySelector("a").addEventListener("click", function (e) {
      if (marvoBadge.classList.contains("collapsed")) {
        e.preventDefault();
        marvoBadge.classList.remove("collapsed");
        localStorage.setItem("marvoBadgeCollapsed", "false");
      }
    });
  }

  /* ========================================================================
     SCROLL REVEAL
     ======================================================================== */
  const revealTargets = document.querySelectorAll(".service-card, .review-card, .why-card");
  if (revealTargets.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(function (el) { observer.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("in"); });
  }

});
