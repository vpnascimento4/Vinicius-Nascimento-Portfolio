document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  updateCurrentYear();
  setupCarousels();
  setupContactForm();
});

function setupNavigation() {
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");
  if (!navToggle || !siteNav) return;

  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (siteNav.classList.contains("open")) {
        siteNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  });
}

function updateCurrentYear() {
  const yearSpan = document.getElementById("current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

function setupCarousels() {
  const carouselElements = document.querySelectorAll("[data-carousel]");
  carouselElements.forEach((carousel) => {
    const track = carousel.querySelector("[data-carousel-track]");
    const slides = Array.from(carousel.querySelectorAll("[data-carousel-slide]"));
    const prevBtn = carousel.querySelector("[data-carousel-prev]");
    const nextBtn = carousel.querySelector("[data-carousel-next]");
    const dotsContainer = carousel.parentElement?.querySelector("[data-carousel-dots]");

    if (!track || slides.length === 0 || !dotsContainer) return;

    let currentIndex = 0;

    const dots = slides.map((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
      dot.setAttribute("role", "tab");
      dot.addEventListener("click", () => goToSlide(index));
      dotsContainer.appendChild(dot);
      return dot;
    });

    function goToSlide(index) {
      currentIndex = (index + slides.length) % slides.length;
      const offset = currentIndex * -100;
      track.style.transform = `translateX(${offset}%)`;
      updateDots();
    }

    function updateDots() {
      dots.forEach((dot, index) => {
        const isActive = index === currentIndex;
        dot.setAttribute("aria-selected", String(isActive));
        dot.toggleAttribute("disabled", isActive);
      });
    }

    prevBtn?.addEventListener("click", () => goToSlide(currentIndex - 1));
    nextBtn?.addEventListener("click", () => goToSlide(currentIndex + 1));

    // Initialize
    goToSlide(0);

    // Allow keyboard navigation on track
    track.setAttribute("tabindex", "0");
    track.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goToSlide(currentIndex + 1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToSlide(currentIndex - 1);
      }
    });
  });
}

function setupContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const successMessage = form.querySelector(".form-success");
  const fields = {
    name: form.querySelector("#name"),
    email: form.querySelector("#email"),
    subject: form.querySelector("#subject"),
    message: form.querySelector("#message"),
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let isValid = true;

    clearErrors();

    if (!fields.name.value.trim()) {
      showError("name", "Please enter your full name.");
      isValid = false;
    }

    if (!validateEmail(fields.email.value)) {
      showError("email", "Please provide a valid email address.");
      isValid = false;
    }

    if (!fields.subject.value.trim()) {
      showError("subject", "Let me know what you'd like to discuss.");
      isValid = false;
    }

    if (fields.message.value.trim().length < 10) {
      showError("message", "Message should be at least 10 characters long.");
      isValid = false;
    }

    if (isValid) {
      if (successMessage) {
        successMessage.hidden = false;
      }
      form.reset();
      Object.values(fields).forEach((field) => field.removeAttribute("aria-invalid"));
    } else if (successMessage) {
      successMessage.hidden = true;
    }
  });

  function validateEmail(value) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value.trim());
  }

  function showError(fieldName, message) {
    const field = fields[fieldName];
    const errorEl = form.querySelector(`#${fieldName}-error`);
    if (!field || !errorEl) return;
    errorEl.textContent = message;
    field.setAttribute("aria-invalid", "true");
  }

  function clearErrors() {
    Object.keys(fields).forEach((fieldName) => {
      const errorEl = form.querySelector(`#${fieldName}-error`);
      if (errorEl) {
        errorEl.textContent = "";
      }
    });
  }
}
