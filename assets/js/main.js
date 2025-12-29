/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		$main_articles = $main.children('article');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Fix: Flexbox min-height bug on IE.
		if (browser.name == 'ie') {

			var flexboxFixTimeoutId;

			$window.on('resize.flexbox-fix', function() {

				clearTimeout(flexboxFixTimeoutId);

				flexboxFixTimeoutId = setTimeout(function() {

					if ($wrapper.prop('scrollHeight') > $window.height())
						$wrapper.css('height', 'auto');
					else
						$wrapper.css('height', '100vh');

				}, 250);

			}).triggerHandler('resize.flexbox-fix');

		}

	// Nav.
		var $nav = $header.children('nav'),
			$nav_li = $nav.find('li');

		// Add "middle" alignment classes if we're dealing with an even number of items.
			if ($nav_li.length % 2 == 0) {

				$nav.addClass('use-middle');
				$nav_li.eq( ($nav_li.length / 2) ).addClass('is-middle');

			}

	// Main.
		var	delay = 325,
			locked = false;

		// Methods.
			$main._show = function(id, initial) {

				var $article = $main_articles.filter('#' + id);

				// No such article? Bail.
					if ($article.length == 0)
						return;

				// Handle lock.

					// Already locked? Speed through "show" steps w/o delays.
						if (locked || (typeof initial != 'undefined' && initial === true)) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Mark as visible.
								$body.addClass('is-article-visible');

							// Deactivate all articles (just in case one's already active).
								$main_articles.removeClass('active');

							// Hide header, footer.
								$header.hide();
								$footer.hide();

							// Show main, article.
								$main.show();
								$article.show();

							// Activate article.
								$article.addClass('active');

							// Unlock.
								locked = false;

							// Unmark as switching.
								setTimeout(function() {
									$body.removeClass('is-switching');
								}, (initial ? 1000 : 0));

							return;

						}

					// Lock.
						locked = true;

				// Article already visible? Just swap articles.
					if ($body.hasClass('is-article-visible')) {

						// Deactivate current article.
							var $currentArticle = $main_articles.filter('.active');

							$currentArticle.removeClass('active');

						// Show article.
							setTimeout(function() {

								// Hide current article.
									$currentArticle.hide();

								// Show article.
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

				// Otherwise, handle as normal.
					else {

						// Mark as visible.
							$body
								.addClass('is-article-visible');

						// Show article.
							setTimeout(function() {

								// Hide header, footer.
									$header.hide();
									$footer.hide();

								// Show main, article.
									$main.show();
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

			};

			$main._hide = function(addState) {

				var $article = $main_articles.filter('.active');

				// Article not visible? Bail.
					if (!$body.hasClass('is-article-visible'))
						return;

				// Add state?
					if (typeof addState != 'undefined'
					&&	addState === true)
						history.pushState(null, null, '#');

				// Handle lock.

					// Already locked? Speed through "hide" steps w/o delays.
						if (locked) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Deactivate article.
								$article.removeClass('active');

							// Hide article, main.
								$article.hide();
								$main.hide();

							// Show footer, header.
								$footer.show();
								$header.show();

							// Unmark as visible.
								$body.removeClass('is-article-visible');

							// Unlock.
								locked = false;

							// Unmark as switching.
								$body.removeClass('is-switching');

							// Window stuff.
								$window
									.scrollTop(0)
									.triggerHandler('resize.flexbox-fix');

							return;

						}

					// Lock.
						locked = true;

				// Deactivate article.
					$article.removeClass('active');

				// Hide article.
					setTimeout(function() {

						// Hide article, main.
							$article.hide();
							$main.hide();

						// Show footer, header.
							$footer.show();
							$header.show();

						// Unmark as visible.
							setTimeout(function() {

								$body.removeClass('is-article-visible');

								// Window stuff.
									$window
										.scrollTop(0)
										.triggerHandler('resize.flexbox-fix');

								// Unlock.
									setTimeout(function() {
										locked = false;
									}, delay);

							}, 25);

					}, delay);


			};

		// Articles.
			$main_articles.each(function() {

				var $this = $(this);

				// Close.
					$('<div class="close">Close</div>')
						.appendTo($this)
						.on('click', function() {
							location.hash = '';
						});

				// Prevent clicks from inside article from bubbling.
					$this.on('click', function(event) {
						event.stopPropagation();
					});

			});

		// Events.
			$body.on('click', function(event) {

				// Article visible? Hide.
					if ($body.hasClass('is-article-visible'))
						$main._hide(true);

			});

			$window.on('keyup', function(event) {

				switch (event.keyCode) {

					case 27:

						// Article visible? Hide.
							if ($body.hasClass('is-article-visible'))
								$main._hide(true);

						break;

					default:
						break;

				}

			});

			$window.on('hashchange', function(event) {

				// Empty hash?
					if (location.hash == ''
					||	location.hash == '#') {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Hide.
							$main._hide();

					}

				// Otherwise, check for a matching article.
					else if ($main_articles.filter(location.hash).length > 0) {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Show article.
							$main._show(location.hash.substr(1));

					}

			});

		// Scroll restoration.
		// This prevents the page from scrolling back to the top on a hashchange.
			if ('scrollRestoration' in history)
				history.scrollRestoration = 'manual';
			else {

				var	oldScrollPos = 0,
					scrollPos = 0,
					$htmlbody = $('html,body');

				$window
					.on('scroll', function() {

						oldScrollPos = scrollPos;
						scrollPos = $htmlbody.scrollTop();

					})
					.on('hashchange', function() {
						$window.scrollTop(oldScrollPos);
					});

			}

		// Initialize.

			// Hide main, articles.
				$main.hide();
				$main_articles.hide();

			// Initial article.
				if (location.hash != ''
				&&	location.hash != '#')
					$window.on('load', function() {
						$main._show(location.hash.substr(1), true);
					});

})(jQuery);

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

    // If you want to include some or all of these, add them too:
    // "images/home/signal-2025-12-27-095049.jpeg",
    // "images/home/signal-2025-12-27-095049_007.jpeg",
    // "images/home/signal-2025-12-27-095049_008.jpeg",
    // ...
    // "images/home/signal-2025-12-27-095049_032.jpeg",
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