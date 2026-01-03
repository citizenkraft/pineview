(function() {
    
    "use strict";
    
    //===== Prealoder

    window.onload = function() {
        window.setTimeout(fadeout, 500);
    }

    function fadeout() {
        document.querySelector('.preloader').style.opacity = '0';
        document.querySelector('.preloader').style.display = 'none';
    }

    
    /*=====================================
    Sticky
    ======================================= */
    window.onscroll = function () {
        var header_navbar = document.getElementById("header_navbar");
        var logo = document.querySelector("img#logo");
        var sticky = header_navbar.offsetTop;

        if (window.pageYOffset > sticky) {
            header_navbar.classList.add("sticky");
            logo.setAttribute("src", "./images/logo-black.png")
        } else {
            header_navbar.classList.remove("sticky");
            logo.setAttribute("src", "./images/logo-white.png")
        }



        // show or hide the back-top-top button
        var backToTo = document.querySelector(".back-to-top");
        if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
            backToTo.style.display = "block";
        } else {
            backToTo.style.display = "none";
        }
    };

    // Get the navbar


    // for menu scroll 
    var pageLink = document.querySelectorAll('.page-scroll');
    
    pageLink.forEach(elem => {
        elem.addEventListener('click', e => {
            e.preventDefault();
            document.querySelector(elem.getAttribute('href')).scrollIntoView({
                behavior: 'smooth',
                offsetTop: 1 - 60,
            });
        });
    });

    // section menu active
    function onScroll(event) {
        var sections = document.querySelectorAll('.page-scroll');
        var scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

        for (var i = 0; i < sections.length; i++) {lao
            var currLink = sections[i];
            var val = currLink.getAttribute('href');
            var refElement = document.querySelector(val);
            var scrollTopMinus = scrollPos + 73;

            if (refElement != null && (refElement.offsetTop <= scrollTopMinus && (refElement.offsetTop + refElement.offsetHeight > scrollTopMinus))) {
                document.querySelector('.page-scroll').classList.remove('active');
                currLink.classList.add('active');
            } else {
                currLink.classList.remove('active');
            }
        }
    };

    window.document.addEventListener('scroll', onScroll);


    //===== close navbar-collapse when a  clicked
    let navbarToggler = document.querySelector(".navbar-toggler");    
    var navbarCollapse = document.querySelector(".navbar-collapse");

    navbarToggler.addEventListener('click', () => {
        navbarToggler.classList.toggle('active')
    })

    document.querySelectorAll(".page-scroll").forEach(e =>
        e.addEventListener("click", () => {
            navbarToggler.classList.remove("active");
            navbarCollapse.classList.remove('show')
        })
    );


   
    //WOW Scroll Spy
    var wow = new WOW({
        //disabled for mobile
        mobile: false
    });
    wow.init();


        // ====== scroll top js
    function scrollTo(element, to = 0, duration= 1000) {

        const start = element.scrollTop;
        const change = to - start;
        const increment = 20;
        let currentTime = 0;

        const animateScroll = (() => {

            currentTime += increment;

            const val = Math.easeInOutQuad(currentTime, start, change, duration);

            element.scrollTop = val;

            if (currentTime < duration) {
                setTimeout(animateScroll, increment);
            }
        });

        animateScroll();
    };

    Math.easeInOutQuad = function (t, b, c, d) {

        t /= d/2;
        if (t < 1) return c/2*t*t + b;
        t--;
        return -c/2 * (t*(t-2) - 1) + b;
    };

    document.querySelector('.back-to-top').onclick = function () {
        scrollTo(document.documentElement); 
    }

    
})();


(() => {
  const root = document.getElementById("homeCarousel");
  if (!root) return;

  // Update this list to match exactly what you want in the carousel.
  // All paths are relative to the page.
  const images = [
    "images/home/living2.jpg",
    "images/home/kitchen1.jpg",
    "images/home/dining2.jpg",
	"images/home/exterior2.jpg",
    "images/home/deck4.jpg",
  ];

  const track = root.querySelector(".carousel__track");
  const dotsWrap = root.querySelector(".carousel__dots");
  const btnPrev = root.querySelector(".carousel__btn--prev");
  const btnNext = root.querySelector(".carousel__btn--next");

  let index = 0;
  let autoTimer = null;

  // Build slides + dots
  const slides = images.map((src, i) => {
    const slide = document.createElement("div");
    slide.className = "carousel__slide";
    slide.setAttribute("role", "group");
    slide.setAttribute("aria-roledescription", "slide");
    slide.setAttribute("aria-label", `${i + 1} of ${images.length}`);

    const img = document.createElement("img");
    img.className = "carousel__img";
    img.src = src;
    img.alt = ""; // Decorative. If you want, put alt text per image.
    img.loading = i === 0 ? "eager" : "lazy";
    img.decoding = "async";

    slide.appendChild(img);
    track.appendChild(slide);

    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel__dot";
    dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
    dot.addEventListener("click", () => goTo(i, true));
    dotsWrap.appendChild(dot);

    return slide;
  });

  const dots = Array.from(dotsWrap.querySelectorAll(".carousel__dot"));

  function updateUI() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
  }

  function clamp(n) {
    const max = images.length - 1;
    if (n < 0) return max;
    if (n > max) return 0;
    return n;
  }

  function goTo(i, userInitiated = false) {
    index = clamp(i);
    updateUI();
    if (userInitiated) resetAuto();
  }

  function next(userInitiated = false) { goTo(index + 1, userInitiated); }
  function prev(userInitiated = false) { goTo(index - 1, userInitiated); }

  btnNext.addEventListener("click", () => next(true));
  btnPrev.addEventListener("click", () => prev(true));

  // Keyboard support when carousel is focused/active
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") next(true);
    if (e.key === "ArrowLeft") prev(true);
  });
  root.tabIndex = 0; // Make root focusable for keyboard

  // Touch swipe
  let startX = 0;
  let isTouching = false;

  root.addEventListener("touchstart", (e) => {
    if (!e.touches || e.touches.length === 0) return;
    isTouching = true;
    startX = e.touches[0].clientX;
  }, { passive: true });

  root.addEventListener("touchend", (e) => {
    if (!isTouching) return;
    isTouching = false;

    const endX = (e.changedTouches && e.changedTouches[0])
      ? e.changedTouches[0].clientX
      : startX;

    const dx = endX - startX;
    const threshold = 40; // px
    if (dx > threshold) prev(true);
    else if (dx < -threshold) next(true);
  });

  // Optional auto-rotate
  const AUTO_MS = 6000; // set to 0 to disable
  function startAuto() {
    if (!AUTO_MS) return;
    stopAuto();
    autoTimer = setInterval(() => next(false), AUTO_MS);
  }
  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = null;
  }
  function resetAuto() {
    if (!AUTO_MS) return;
    startAuto();
  }

  // Pause on hover (desktop)
  root.addEventListener("mouseenter", stopAuto);
  root.addEventListener("mouseleave", startAuto);

  // Init
  updateUI();
  startAuto();
})();


document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("gcGallery");
  const lightbox = root.querySelector(".gc-lightbox");
  const lbImg = root.querySelector(".gc-lightbox__img");
  const lbCap = root.querySelector(".gc-lightbox__caption");
  const lbPrev = root.querySelector(".gc-lightbox__nav--prev");
  const lbNext = root.querySelector(".gc-lightbox__nav--next");

  if (!root) return;

  // 1) DEFINE YOUR GALLERIES HERE
  const ALBUMS = {
    kitchen: [
      { src: "images/home/kitchen1.jpg", alt: "Kitchen overview with island and updated appliances" },
      { src: "images/home/kitchen2.jpg", alt: "Kitchen details and prep space" },
      { src: "images/home/kitchen3.jpg", alt: "Kitchen seating and adjacent dining area" },
	  { src: "images/home/kitchen4.jpg", alt: "Kitchen seating and adjacent dining area" },
	  { src: "images/home/kitchen5.jpg", alt: "Kitchen seating and adjacent dining area" },
	  { src: "images/home/kitchen6.jpg", alt: "Kitchen seating and adjacent dining area" },
	  { src: "images/home/kitchen7.jpg", alt: "Kitchen seating and adjacent dining area" },
	  { src: "images/home/kitchen8.jpg", alt: "Kitchen seating and adjacent dining area" },
	  { src: "images/home/kitchen9.jpg", alt: "Kitchen seating and adjacent dining area" },
    ],
	living: [
      { src: "images/home/living1.jpg", alt: "Dining area with table seating" },
      { src: "images/home/living2.jpg", alt: "Dining area with table seating" },
	  { src: "images/home/living3.jpg", alt: "Dining area with table seating" },
	  { src: "images/home/living4.jpg", alt: "Dining area with table seating" },
	  { src: "images/home/living5.jpg", alt: "Dining area with table seating" },
	  { src: "images/home/living6.jpg", alt: "Dining area with table seating" },
	  { src: "images/home/living7.jpg", alt: "Dining area with table seating" },
	  { src: "images/home/living8.jpg", alt: "Dining area with table seating" },
	  { src: "images/home/living9.jpg", alt: "Dining area with table seating" },
	  { src: "images/home/living10.jpg", alt: "Dining area with table seating" },
	  { src: "images/home/living11.jpg", alt: "Dining area with table seating" },
    ],
    dining: [
      { src: "images/home/dining1.jpg", alt: "Dining area with table seating" },
      { src: "images/home/dining2.jpg", alt: "Dining space with open layout into living area" },
	  { src: "images/home/dining3.jpg", alt: "Dining space with open layout into living area" },
    ],
    bedrooms: [
      { src: "images/home/master1.jpg", alt: "Primary bedroom with comfortable bedding" },
      { src: "images/home/master2.jpg", alt: "Bedroom with natural light and closet storage" },
      { src: "images/home/master3.jpg", alt: "Additional bedroom setup for guests" },
    ],
	bathrooms: [
      { src: "images/home/mainbath1.jpg", alt: "Main floor full bathroom" },
      { src: "images/home/downbath1.jpg", alt: "Downstairs shared full bath." },
      { src: "images/home/upbath1.jpg", alt: "Upstairs shared full bath" },
	  { src: "images/home/master7.jpg", alt: "Master ensuite full bath" },
	  { src: "images/home/downking4.jpg", alt: "Lower Level king bedroom ensuite full bath" },
    ],
	exterior: [
      { src: "images/home/exterior1.jpg", alt: "Primary bedroom with comfortable bedding" },
      { src: "images/home/exterior2.jpg", alt: "Primary bedroom with comfortable bedding" },
      { src: "images/home/exterior3.jpg", alt: "Primary bedroom with comfortable bedding" },
	  { src: "images/home/exterior4.jpg", alt: "Primary bedroom with comfortable bedding" },
	  { src: "images/home/exterior5.jpg", alt: "Primary bedroom with comfortable bedding" },
	  { src: "images/home/exterior6.jpg", alt: "Primary bedroom with comfortable bedding" },
	  { src: "images/home/deck1.jpg", alt: "Primary bedroom with comfortable bedding" },
	  { src: "images/home/deck2.jpg", alt: "Primary bedroom with comfortable bedding" },
	  { src: "images/home/deck3.jpg", alt: "Primary bedroom with comfortable bedding" },
	  { src: "images/home/deck4.jpg", alt: "Primary bedroom with comfortable bedding" },
    ],
	aerial: [
		{ src: "images/home/aerial1.jpg", alt: "Primary bedroom with comfortable bedding" },
		{ src: "images/home/aerial2.jpg", alt: "Primary bedroom with comfortable bedding" },
		{ src: "images/home/aerial3.jpg", alt: "Primary bedroom with comfortable bedding" },
		{ src: "images/home/aerial4.jpg", alt: "Primary bedroom with comfortable bedding" },
	]
  };

  function openLightbox() {
    const item = slides[index];
    if (!item) return;

    lbImg.src = item.src;     // same file, just displayed larger
    lbImg.alt = item.alt;
    lbCap.textContent = item.alt;

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lbImg.src = "";
  }

  function syncLightbox() {
    if (!lightbox.classList.contains("is-open")) return;
    const item = slides[index];
    if (!item) return;

    lbImg.src = item.src;
    lbImg.alt = item.alt;
    lbCap.textContent = item.alt;
  }

  // 2) Carousel wiring (no dependencies)
  const track = root.querySelector(".gc-track");
  const dotsWrap = root.querySelector(".gc-dots");
  const caption = root.querySelector(".gc-caption");
  const prevBtn = root.querySelector(".gc-btn--prev");
  const nextBtn = root.querySelector(".gc-btn--next");
  const tabs = Array.from(root.querySelectorAll(".gc-tab"));

  let activeAlbumKey = null;
  let slides = [];
  let index = 0;

  function setCaption() {
    const item = slides[index];
    caption.textContent = item ? item.alt : "";
  }

  function updateUI() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dotsWrap.querySelectorAll(".gc-dot").forEach((d, i) => {
      d.classList.toggle("is-active", i === index);
    });
    setCaption();
    syncLightbox();
  }

  function clamp(n) {
    const max = slides.length - 1;
    if (n < 0) return max;
    if (n > max) return 0;
    return n;
  }

  function goTo(i) {
    index = clamp(i);
    updateUI();
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  function build(albumKey) {
    const items = ALBUMS[albumKey] || [];
    activeAlbumKey = albumKey;
    slides = items;
    index = 0;

    // Clear
    track.innerHTML = "";
    dotsWrap.innerHTML = "";

    if (!items.length) {
      caption.textContent = "No photos in this gallery yet.";
      return;
    }

    // Build slides and dots
    items.forEach((item, i) => {
      const slide = document.createElement("div");
      slide.className = "gc-slide";

      const img = document.createElement("img");
      img.className = "gc-img";
      img.src = item.src;
      img.alt = item.alt; // actual accessibility alt
      img.loading = i === 0 ? "eager" : "lazy";
      img.decoding = "async";

	  img.style.cursor = "zoom-in";
      img.addEventListener("click", openLightbox);

      slide.appendChild(img);
      track.appendChild(slide);

      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "gc-dot";
      dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
      dot.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    updateUI();
  }

  // Buttons
  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);

  // Keyboard arrows when focused
  root.tabIndex = 0;
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });

  // Touch swipe
  let startX = 0;
  let touching = false;

  root.addEventListener("touchstart", (e) => {
    if (!e.touches || !e.touches.length) return;
    touching = true;
    startX = e.touches[0].clientX;
  }, { passive: true });

  root.addEventListener("touchend", (e) => {
    if (!touching) return;
    touching = false;

    const endX = (e.changedTouches && e.changedTouches[0])
      ? e.changedTouches[0].clientX
      : startX;

    const dx = endX - startX;
    const threshold = 40;
    if (dx > threshold) prev();
    else if (dx < -threshold) next();
  });

  root.querySelectorAll("[data-gc-close]").forEach((el) => {
    el.addEventListener("click", closeLightbox);
  });

  lbNext.addEventListener("click", () => { next(); });
  lbPrev.addEventListener("click", () => { prev(); });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;

    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });

  // Tabs
  tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      const albumKey = btn.dataset.gcAlbum;

      tabs.forEach(t => t.classList.remove("is-active"));
      btn.classList.add("is-active");

      if (albumKey !== activeAlbumKey) build(albumKey);
    });
  });

  // Initial load (first tab)
  const first = tabs[0];
  if (first) build(first.dataset.gcAlbum);
});