"use strict";

///////////////////////////////////////
//Elements
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn-close-modal");
const btnsOpenModal = document.querySelectorAll(".btn-show-modal");
const btnScrollTo = document.querySelector(".btn-scroll-to");
const section1 = document.getElementById("section-1");
const tabs = document.querySelectorAll(".values-tab");
const tabsContainer = document.querySelector(".values-tab-container");
const tabsContent = document.querySelectorAll(".values-content");
const navLinks = document.querySelectorAll(".nav-link");
const linksContainer = document.querySelector(".nav-links");
const header = document.querySelector(".header");
const nav = document.querySelector(".nav");

///////////////////////////////////////////////////////////////
// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));
btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

///////////////////////////////////////////////////////////////
// Smooth scrolling to a section
btnScrollTo.addEventListener("click", function (e) {
  //modern smooth scrolling
  section1.scrollIntoView({ behavior: "smooth" });
});

///////////////////////////////////////////////////////////////
// Page navigation
//Event delegation requires 2 important steps to follow:
// 1. Add event listener to common parent element
// 2. Determine what element originated the event
document.querySelector(".nav-links").addEventListener("click", function (e) {
  e.preventDefault();
  //e.target (nav-link): the element where the click happens
  // Matching strategy
  if (e.target.classList.contains("nav-link")) {
    const id = e.target.getAttribute("href"); //#section-1 ...
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

///////////////////////////////////////////////////////////////
// Tabbed component

tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".values-tab");

  //guard clause
  if (!clicked) return;

  //activate tab
  tabs.forEach((tab) => tab.classList.remove("values-tab-active"));
  clicked.classList.add("values-tab-active");

  //activate content
  tabsContent.forEach((content) =>
    content.classList.remove("values-content-active")
  );
  document
    .querySelector(`.values-content-${clicked.dataset.tab}`)
    .classList.add("values-content-active");
});

///////////////////////////////////////////////////////////////
// Navbar links fade out hover effect

const hoverHandler = function (e) {
  if (e.target.classList.contains("nav-link")) {
    const link = e.target;
    navLinks.forEach((l) => {
      if (l != link) {
        l.style.opacity = this;
      }
    });
  }
};
//Passing arguments to event handlers functions
linksContainer.addEventListener("mouseover", hoverHandler.bind(0.5));
linksContainer.addEventListener("mouseout", hoverHandler.bind(1));

///////////////////////////////////////////////////////////////
// Sticky navbar

/*we want our navbar to be sticky when the header moves completly 
out of view, so we're goig to observe the header element*/
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries; //destructuring
  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};
const options = {
  root: null,
  rootMargin: `${-navHeight}px`,
  treshold: 0,
};
//create an Intersection Observer API
const observer = new IntersectionObserver(stickyNav, options);
//observe the target element
observer.observe(header);

///////////////////////////////////////////////////////////////
// Reveal sections

const allSections = document.querySelectorAll(".section");
const revealSection = function (entries, observer) {
  const [entry] = entries;

  //guard clause
  if (!entry.isIntersecting) return;

  entry.target.classList.remove("section-hidden");
  //for better performace stop observing
  observer.unobserve(entry.target);
};
//craete the section's intersection observer
const sectionsObserver = new IntersectionObserver(revealSection, {
  root: null,
  treshold: 0.3,
});
//observe the sections
allSections.forEach((section) => {
  sectionsObserver.observe(section);
  section.classList.add("section-hidden");
});

///////////////////////////////////////////////////////////////
// Lazy loading images
const servicesImages = document.querySelectorAll(".services-img");
const lazyLoading = function (entries, observer) {
  const [entry] = entries;
  const observedImg = entry.target;

  if (!entry.isIntersecting) return;
  //replace src with data-src attribute
  observedImg.src = observedImg.dataset.src;
  //remove the blury effect after image loading
  observedImg.addEventListener("load", function () {
    observedImg.classList.remove("lazy-img");
  });
  observer.unobserve(observedImg);
};
const imgObserver = new IntersectionObserver(lazyLoading, {
  root: null,
  treshold: 0,
  //start loading imgs before reaching them
  rootMargin: "200px",
});
servicesImages.forEach((img) => {
  imgObserver.observe(img);
});

///////////////////////////////////////////////////////////////
// Slider component

const slider = function () {
  const slides = document.querySelectorAll(".slide");
  const sliderLeftBtn = document.querySelector(".slider-btn-left");
  const sliderRightBtn = document.querySelector(".slider-btn-right");
  let currentSlide = 0;
  const maxSlide = slides.length - 1;
  const dotsContainer = document.querySelector(".dots");

  const createDots = function () {
    slides.forEach((_, i) =>
      dotsContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots-dot" data-slide=${i}></button>`
      )
    );
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll(".dots-dot")
      .forEach((dot) => dot.classList.remove("dots-dot-active"));
    //select the dot we want to activate using the dot data attribute
    document
      .querySelector(`.dots-dot[data-slide="${slide}"]`)
      .classList.add("dots-dot-active");
  };

  //slide 0 : 0% 100% 200% 300%
  const goToSlide = function (currSlide) {
    slides.forEach((slide, index) => {
      slide.style.transform = `translateX(${(index - currSlide) * 100}%)`;
    });
  };

  //initialize the slider
  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  //move to the next slide
  //slide 1 : -100% 0% 100% 200%
  const nextSlide = function () {
    if (currentSlide === maxSlide) currentSlide = 0;
    else currentSlide++;
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };
  sliderRightBtn.addEventListener("click", nextSlide);

  //move to the previous slide
  const previousSlide = function () {
    if (currentSlide === 0) currentSlide = maxSlide;
    else currentSlide--;
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };
  sliderLeftBtn.addEventListener("click", previousSlide);

  //move to right/left using left/right arrrows
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") nextSlide();
    if (e.key === "ArrowLeft") previousSlide();
  });

  //Move to right/left when clicking on dots (event delegation)
  dotsContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots-dot")) {
      const slide = e.target.dataset.slide;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
