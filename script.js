let swiper;

function initSwiper() {
  if (swiper) swiper.destroy(true, true);

  swiper = new Swiper(".mySwiper", {
    effect: window.innerWidth < 786 ? "slide" : "cube",
    direction: window.innerWidth < 786 ? "vertical" : "horizontal",
    allowTouchMove: window.innerWidth < 786 ? true : false,
    grabCursor: false,
    cubeEffect: {
      shadow: true,
      slideShadows: true,
      shadowOffset: 20,
      shadowScale: 0.94,
    },
    mousewheel: true,
  });

  swiper.on('slideChange', function () {
    console.log('Slide index: ', swiper.activeIndex);
    document.querySelectorAll(".Links li").forEach((li, idx) => {
      li.classList.toggle("activeLink", idx === swiper.activeIndex);
    });
  });
}

window.addEventListener("DOMContentLoaded", () => {
  initSwiper();

  document.querySelectorAll(".Links li").forEach((li, idx) => {
    li.addEventListener("click", () => Navigate(idx));
  });

  const form = document.getElementById("contactForm");
  const inputs = form.querySelectorAll("input, textarea");
  let scrollY = 0;

  inputs.forEach(input => {
    input.addEventListener("focus", () => {
      scrollY = window.scrollY;
      document.body.classList.add("input-focused");
      document.body.style.top = `-${scrollY}px`;
      swiper.disable();
      swiper.slideTo(4, 0);
      if (window.innerWidth < 786) {
        setTimeout(() => {
          input.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 300);
      }
    });

    input.addEventListener("blur", () => {
      document.body.classList.remove("input-focused");
      document.body.style.position = "";
      document.body.style.top = "";
      window.scrollTo(0, scrollY);
      swiper.enable();
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const form = e.target;
    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { "Accept": "application/json" }
    })
      .then(response => {
        if (response.ok) {
          form.reset();
          alert("Thank you! Your message has been sent.");
        } else {
          alert("Oops! Something went wrong.");
        }
      })
      .catch(() => {
        alert("Network error. Please try again later.");
      });
  });
});

window.addEventListener("resize", () => {
  if (document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
    initSwiper();
  } else {
    swiper.disable();
    swiper.slideTo(4, 0);
    if (window.innerWidth < 786) {
      document.activeElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
});

function Navigate(index) {
  document.querySelectorAll(".Links li").forEach(i => i.classList.remove("activeLink"));
  document.querySelectorAll(".Links li")[index].classList.add("activeLink");
  swiper.slideTo(index, 1000, true);
}