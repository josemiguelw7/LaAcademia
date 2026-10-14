/*--------------------------------------------------
    Default Page Trigger Options
---------------------------------------------------*/

    const pageTriggerOptions = {
        fadeOutSecondaryCaptions: function() {
			shuffleText(".next-hero-subtitle .word-wrapper span", { mode: 'animation', width: 'lock', duration: 0.6, fadeOut: true });
        },
        fadeOutAllCaptions: function() {
            gsap.to("#page-nav .word-wrapper span", { duration: 0.3, opacity: 0, yPercent: 100, ease: "power2.in" });
        }
    };

    const projectTriggerOptions = {
        fadeOutSecondaryCaptions: function() {
			shuffleText(".next-hero-subtitle .word-wrapper span", { mode: 'animation', duration: 0.6, fadeOut: true });
        },
        fadeOutAllCaptions: function() {
            gsap.to("#project-nav .word-wrapper span", { duration: 0.3, opacity: 0, ease: "power2.in" });
        }
    };


/*--------------------------------------------------
	First Load 
---------------------------------------------------*/

	document.addEventListener("DOMContentLoaded", function() {
		
		"use strict";
		
		initViewportEnvironment();
		initVideoBackground();

		window.onPreloaderComplete = function () {		
			window.dispatchEvent(new Event('preloaderComplete'));		

			HeroCaptionAnimation();
			HeroMediaAnimation();		

			preloaderDone = true;		
		}

		ScrollEngine();
		ScrollActions();
		ScrollEffects();

		ShowcasePortfolio();
		ShowcaseParallax();
		ShowcaseCarousel();
		ShowcaseLists();
		
		PageHeroSection();
		PageContentLayout();
		
		TextAnimations();
		TextElements();
		ComponentsLibrary();		
		
		PageNavSection();
		PageFooterEffects();
		PageHeaderOptions();	
		PageResizer();
		PageReady();
		
		ClaPatMenu();
		CursorSetup();

		LinkTriggerEvent();	
		PageTriggerEvent(pageTriggerOptions);
		ThumbTriggerEvent();
		ProjectTriggerEvent(projectTriggerOptions);
		AjaxCore();
		
		CustomFunction();
		Hayler();
		
	}); // End First Load


	
/*--------------------------------------------------
	Custom Function
---------------------------------------------------*/

	window.CustomFunction = function() {
		
		// Add your own functions here
		
	}; // End Custom Function


	
/*--------------------------------------------------
	Hero Caption Animation
---------------------------------------------------*/

	window.HeroCaptionAnimation = function() {

		const preloaderDelay = (preloaderDisabled || preloaderDone) ? 0 : 0.6;

		return new Promise((resolve) => {
			gsap.delayedCall(preloaderDelay, () => {

				const heroTitle = document.querySelector(".hero-title");
				const heroTitleLines = getTextLines(".hero-title", {
					selector: ".word-wrapper",
					also: ".hero-infotitle .word-wrapper"
				});

				const heroSubtitleSpans = document.querySelectorAll(".hero-subtitle .word-wrapper span");
				wrapText(heroSubtitleSpans, { sentence: false, words: true });

				const heroSubtitleLines = getTextLines(".hero-subtitle", {
					selector: ".span-word > span",
				});

				const heroInfoTitleSpans = document.querySelectorAll(".hero-infotitle .word-wrapper span");

				const heroFlipPlaceholder = document.querySelector(".flip-placeholder");
				const heroClone = document.getElementById("hero-clone");
				const projectCloneHero = document.getElementById("project-clone-hero");

				const captionTimeline = gsap.timeline();

				// ── Helpers ───────────────────────────────────────────────
				function animateSubtitleLines(baseDelay) {
					gsap.set(heroSubtitleSpans, { opacity: 1 });
					heroSubtitleLines.forEach((spans, index) => {
						const stagger = 0.05;
						const lineDuration = 1.5 - index * stagger * 2;
						const lineDelay = baseDelay + index * stagger;
						gsap.set(spans, { yPercent: 100, opacity: 0 });
						captionTimeline.to(spans, {
							duration: lineDuration,
							yPercent: 0,
							opacity: 1,
							ease: "expo.out",
						}, lineDelay);
					});
				}

				function hasFlipClass(element, titleClass, captionClass) {
					return element && element.classList.contains(titleClass) && element.classList.contains(captionClass);
				}
				// ─────────────────────────────────────────────────────────

				// ── No flip clone present ─────────────────────────────────
				const hasNoClone = !heroClone && !projectCloneHero;

				if (hasNoClone) {
					heroTitleLines.forEach((spans, index) => {
						const stagger = 0.1;
						const lineDuration = 1.5 - index * stagger * 2;
						const lineDelay = index * stagger;
						gsap.set(spans, { yPercent: 100, opacity: 0 });
						captionTimeline.to(spans, {
							duration: lineDuration,
							yPercent: 0,
							opacity: 1,
							ease: "expo.out",
						}, lineDelay);
					});
					animateSubtitleLines(0.1);
				}

				// ── Flip title only (caption animates separately) ─────────
				const flipTitleOnly =
					(heroClone && heroClone.classList.contains("flip-title-onload") && !heroClone.classList.contains("flip-caption-onload")) ||
					(projectCloneHero && projectCloneHero.classList.contains("flip-title-onload") && !projectCloneHero.classList.contains("flip-caption-onload"));

				if (flipTitleOnly) {					
					animateSubtitleLines(0.3);

					gsap.set(heroInfoTitleSpans, { yPercent: 100, opacity: 0 });
					captionTimeline.to(heroInfoTitleSpans, {
						duration: 1,
						yPercent: 0,
						opacity: 1,
						ease: "expo.out",
					}, "<");
				}

				// ── Flip title + caption (caption handled by flip itself) ──
				const flipTitleAndCaption =
					(heroClone && heroClone.classList.contains("flip-title-onload") && heroClone.classList.contains("flip-caption-onload")) ||
					(projectCloneHero && projectCloneHero.classList.contains("flip-title-onload") && projectCloneHero.classList.contains("flip-caption-onload"));

				if (flipTitleAndCaption) {
					captionTimeline.add(() => {}, "+=0.3");
				}

				// ── Footer & content ──────────────────────────────────────
				captionTimeline.to("#hero-footer", {
					duration: 0.6,
					y: 0,
					opacity: 1,
					ease: "sine.out",
					onStart: function() {
						const heroFooter = document.querySelector("#hero-footer");
						if (heroFooter && heroFooter.classList.contains("has-border")) {
							heroFooter.classList.add("visible");
						}
					}
				}, "<20%");

				captionTimeline.to("#main-page-content", {
					duration: 0.5,
					opacity: 1,
					ease: "power2.inOut",
					onComplete: function() {
						gsap.set("#main-page-content", { clearProps: "y" });
					}
				}, "<");

				if (heroFlipPlaceholder) {
					captionTimeline.add(initFlipHeroElement, '-=0.75');
				}

				captionTimeline.eventCallback("onComplete", () => {
					resolve();
				});

			});
		});

	}; // End HeroCaptionAnimation
	
	
	
/*--------------------------------------------------
	Hero Media Animation
---------------------------------------------------*/

	window.HeroMediaAnimation = function() {
		const heroSection = document.getElementById('hero');
		const heroMediaSection = document.getElementById('hero-media');
		if (!heroSection || !heroSection.classList.contains('has-media') || !heroMediaSection) return;

		const heroMediaWrapper = heroMediaSection.querySelector('#hero-media-wrapper');
		if (heroMediaWrapper) {
			gsap.set(heroMediaWrapper, { scale: 1.1, opacity: 0 });
			gsap.to(heroMediaWrapper, { duration: 1, scale: 1, opacity: 1, delay: 0.3, ease: 'sine.out' });
		}

		const videoElement = heroMediaSection.querySelector('video');
		if (videoElement) {
			videoElement.play();
		}

		const mainPageContent = document.querySelector('#main-page-content');
		if (mainPageContent) {
			gsap.to(mainPageContent, { duration: 0.5, opacity: 1, ease: 'power2.out' });
		}

		const isHeroBelow = document.body.classList.contains('hero-below-caption');
		if (isHeroBelow) return;

		if (!heroMediaSection.classList.contains('change-header-color')) return;

		const pageContent    = document.querySelector('#clapat-page-content');
		const isDarkContent  = pageContent && pageContent.classList.contains('dark-content');
		const isLightContent = pageContent && pageContent.classList.contains('light-content');

		const logoBlack = document.querySelector('#clapat-logo img.black-logo');
		const logoWhite = document.querySelector('#clapat-logo img.white-logo');

		const cssLightInvertedColor = rootStyles.getPropertyValue('--light-content-header-elements-inverted-color').trim();
		const cssLightBlackOpacity  = rootStyles.getPropertyValue('--light-content-header-logo-white-opacity').trim();
		const cssLightWhiteOpacity  = rootStyles.getPropertyValue('--light-content-header-logo-black-opacity').trim();

		const cssDarkInvertedColor  = rootStyles.getPropertyValue('--dark-content-header-elements-inverted-color').trim();
		const cssDarkBlackOpacity   = rootStyles.getPropertyValue('--dark-content-header-logo-white-opacity').trim();
		const cssDarkWhiteOpacity   = rootStyles.getPropertyValue('--dark-content-header-logo-black-opacity').trim();

		const dur   = 0.3;
		const delay = 0.3;
		const ease  = 'power2.inOut';

		const colorElements = ['.clapat-nav', '#burger-button', '.header-element-color', '.has-media'];

		if (isDarkContent) {
			const blackOpacity = cssDarkBlackOpacity !== '' ? parseFloat(cssDarkBlackOpacity) : 0;
			const whiteOpacity = cssDarkWhiteOpacity !== '' ? parseFloat(cssDarkWhiteOpacity) : 1;
			const color        = cssDarkInvertedColor !== '' ? cssDarkInvertedColor : '#fff';

			gsap.to(logoBlack,      { duration: dur, delay: delay, opacity: blackOpacity, ease: ease });
			gsap.to(logoWhite,      { duration: dur, delay: delay, opacity: whiteOpacity, ease: ease });
			gsap.to(colorElements,  { duration: dur, delay: delay, color: color, ease: ease });
		} else if (isLightContent) {
			const blackOpacity = cssLightBlackOpacity !== '' ? parseFloat(cssLightBlackOpacity) : 1;
			const whiteOpacity = cssLightWhiteOpacity !== '' ? parseFloat(cssLightWhiteOpacity) : 0;
			const color        = cssLightInvertedColor !== '' ? cssLightInvertedColor : '#000';

			gsap.to(logoBlack,      { duration: dur, delay: delay, opacity: blackOpacity, ease: ease });
			gsap.to(logoWhite,      { duration: dur, delay: delay, opacity: whiteOpacity, ease: ease });
			gsap.to(colorElements,  { duration: dur, delay: delay, color: color, ease: ease });
		}

	}; // End HeroMediaAnimation



/*--------------------------------------------------
	Showcase Portfolio
---------------------------------------------------*/	
	
	window.ShowcasePortfolio = function() {	
		
		const portfolio = document.querySelector('.showcase-portfolio');
		if (!portfolio) return;
		
		/*--- Portfolio Options ---*/
		
		PortfolioSortThumbs();
		PortfolioChangeLayout({ ThumbsImagesFollower: true });
		PortfolioPlayPauseVideo('.showcase-portfolio', '.item-content');
		
		
		/*--- Portfolio Thumbs Stripes ---*/
		
		function PortfolioThumbsStripes() {
			const thumbs = document.querySelectorAll(".showcase-portfolio .clapat-item .item-content");

			thumbs.forEach(function(thumb) {
				const windowWidth = window.innerWidth;
				const thumbWidth = thumb.offsetWidth;
				const widthPercent = (thumbWidth / windowWidth) * 100;
				let stripesCount;

				if (windowWidth < 767) {
					stripesCount = 3;
				} else if (widthPercent > 50) {
					stripesCount = 5;
				} else if (widthPercent > 40) {
					stripesCount = 4;
				} else if (widthPercent > 30) {
					stripesCount = 3;
				} else {
					stripesCount = 2;
				}

				const overlay = document.createElement('div');
				overlay.className = 'reveal-overlay';
				let spans = '';
				for (let i = 0; i < stripesCount; i++) {
					spans += '<span></span>';
				}
				overlay.innerHTML = spans;
				thumb.appendChild(overlay);

				// prevents visible gaps between stripes in flex layouts
				gsap.set(overlay.querySelectorAll('span'), { scaleX: 1.01, scaleY: 1 });
			});
		}
		PortfolioThumbsStripes();

		
		/*--- Portfolio Thumbs Animation ---*/

		function PortfolioThumbsAnimation() {
			const thumbs = gsap.utils.toArray('.clapat-item');
			if (!thumbs.length) return;

			const layoutOptions = document.querySelectorAll('.layout-option');
			const filterOptions = document.querySelectorAll('.filter-option');

			// ── Helper: apply final state ─────────────────────────
			function applyFinalState() {
				thumbs.forEach(function(thumb) {
					const thumbRevealStripes = thumb.querySelectorAll('.reveal-overlay span');
					const thumbEffects = thumb.querySelector('.item-effects .item-media');
					const thumbCaption = thumb.querySelectorAll('.item-caption');
					const revealOverlay = thumb.querySelector('.reveal-overlay');

					gsap.set(thumbRevealStripes, { scaleY: 0 });
					gsap.set(thumbEffects, { scale: 1 });
					gsap.set(thumbCaption, { opacity: 1, y: 0 });
					thumbCaption.forEach(function(element) {
						element.removeAttribute('style');
					});
					thumb.classList.add('animated');

					// remove reveal overlay
					if (revealOverlay) {
						revealOverlay.remove();
					}
				});
			}

			// ── Options click handler ─────────────────────────────
			function handleOptionsClick() {
				// kill all portfolio ScrollTriggers
				ScrollTrigger.getAll().forEach(function(trigger) {
					const triggerElement = trigger.vars.trigger;
					if (triggerElement && typeof triggerElement !== 'string') {
						if (triggerElement.closest('.clapat-item')) {
							trigger.kill();
						}
					}
				});

				// apply final state immediately
				applyFinalState();

				// remove listeners from both sets (one-time only)
				layoutOptions.forEach(function(button) {
					button.removeEventListener('click', handleOptionsClick);
				});
				filterOptions.forEach(function(button) {
					button.removeEventListener('click', handleOptionsClick);
				});
			}

			// ── Row grouping logic ────────────────────────────────
			// Group thumbs by visual rows based on their vertical position.
			// Thumbs within 5px tolerance are considered on the same row.
			// This allows staggered animation per row instead of per thumb.
			const rows = [];
			thumbs.forEach(function(thumb) {
				const thumbTop = Math.round(thumb.getBoundingClientRect().top);
				let existingRow = rows.find(function(row) {
					return Math.abs(row.top - thumbTop) < 5;
				});
				if (!existingRow) {
					existingRow = { top: thumbTop, thumbs: [] };
					rows.push(existingRow);
				}
				existingRow.thumbs.push(thumb);
			});

			// ── Animation per row ─────────────────────────────────
			rows.forEach(function(row) {
				row.thumbs.forEach(function(thumb, index) {
					const thumbTrigger = thumb.querySelector('.item-content');
					const thumbRevealStripes = thumb.querySelectorAll('.reveal-overlay span');
					const thumbEffects = thumb.querySelector('.item-effects .item-media');
					const thumbCaption = thumb.querySelectorAll('.item-caption');
					const revealOverlay = thumb.querySelector('.reveal-overlay');

					gsap.set(thumbEffects, { scale: 1.3 });
					gsap.set(thumbCaption, { opacity: 0, y: 10 });

					gsap.to(thumbRevealStripes, {
						scrollTrigger: {
							trigger: thumbTrigger,
							start: 'top 85%',
						},
						duration: 0.75,
						scaleY: 0,
						ease: 'expo.out',
						delay: index * 0.1,
						stagger: {
							each: 0.15,
							from: 'random'
						},
						onComplete: function() {
							thumb.classList.add('animated');
							// remove reveal overlay after animation
							if (revealOverlay) {
								revealOverlay.remove();
							}
						}
					});

					gsap.to(thumbEffects, {
						scrollTrigger: {
							trigger: thumbTrigger,
							start: 'top 85%',
						},
						duration: 1.25,
						scale: 1,
						ease: 'expo.out',
						delay: index * 0.1,
					});

					gsap.to(thumbCaption, {
						scrollTrigger: {
							trigger: thumbTrigger,
							start: 'top 85%',
						},
						duration: 0.75,
						opacity: 1,
						y: 0,
						delay: 0.6 + index * 0.1,
						ease: 'expo.out',
						onComplete: function() {
							thumbCaption.forEach(function(element) {
								element.removeAttribute('style');
							});
						}
					});
				});
			});

			// ── Attach listeners ───────────────────────────────────
			if (layoutOptions.length) {
				layoutOptions.forEach(function(button) {
					button.addEventListener('click', handleOptionsClick);
				});
			}
			if (filterOptions.length) {
				filterOptions.forEach(function(button) {
					button.addEventListener('click', handleOptionsClick);
				});
			}
		}
		PortfolioThumbsAnimation();
				
		
		/*--- Portfolio Filters UI ---*/

		function PortfolioFiltersUI() {
			const filtersWrapper = document.querySelector('.filters-wrapper');
			if (!filtersWrapper) return;

			const pageContent = document.getElementById('clapat-page-content');

			// ── Helper: refresh scroll ────────────────────────────
			function refreshScroll() {
				ScrollTrigger.refresh();
				if (document.body.classList.contains('enable-lenis') && lenis) {
					lenis.resize();
				}
			}

			// ── Filters wrapper styling ───────────────────────────
			const bgColor = pageContent ? pageContent.getAttribute('data-bgcolor') : null;

			if (bgColor) {
				filtersWrapper.style.backgroundColor = bgColor;
				filtersWrapper.style.maskImage = 'linear-gradient(to bottom, ' + bgColor + ' 0%, ' + bgColor + ' 30%, transparent 100%)';
			}

			// ── Auto-close ScrollTrigger ──────────────────────────
			ScrollTrigger.create({
				trigger: '#filters-wrapper',
				start: 'top 95%',
				end: 'bottom 40%',
				onLeave: function() {
					const closeFilters = document.getElementById('close-filters');
					if (closeFilters) closeFilters.click();
				},
				onLeaveBack: function() {
					const closeFilters = document.getElementById('close-filters');
					if (closeFilters) closeFilters.click();
				}
			});

			// ── Toggle filters UI ─────────────────────────────────
			if (pageContent) {
				pageContent.addEventListener('click', function(e) {
					const hasCloseFilters = document.getElementById('close-filters');

					if (
						e.target.closest('.show-filters') ||
						(hasCloseFilters && e.target.closest('#hero')) ||
						e.target.id === 'close-filters'
					) {
						const showFilters = document.querySelector('.show-filters');
						if (!showFilters) return;

						const span = showFilters.querySelector('.button-text span');
						const icon = showFilters.querySelector('.button-icon i');
						if (!span || !icon) return;

						// toggle button text and icon
						if (span.getAttribute('data-temp') === 'Close') {
							span.setAttribute('data-temp', 'Categories');
							span.setAttribute('data-hover', 'Categories');
							span.textContent = 'Categories';
							icon.classList.remove('fa-xmark');
							icon.classList.add('fa-sort');
						} else {
							span.setAttribute('data-temp', 'Close');
							span.setAttribute('data-hover', 'Close');
							span.textContent = 'Close';
							icon.classList.remove('fa-sort');
							icon.classList.add('fa-xmark');
						}

						// toggle close filters div
						let closeFiltersDiv = document.getElementById('close-filters');
						if (!closeFiltersDiv) {
							closeFiltersDiv = document.createElement('div');
							closeFiltersDiv.id = 'close-filters';
							const host = document.getElementById('main-page-content');
							if (host) host.appendChild(closeFiltersDiv);
						} else {
							closeFiltersDiv.parentNode.removeChild(closeFiltersDiv);
						}

						filtersWrapper.classList.toggle('open-filters');

						// animate filters wrapper and thumbs
						if (filtersWrapper.classList.contains('open-filters')) {
							gsap.to(filtersWrapper, {
								duration: 0.6,
								opacity: 1,
								height: 'auto',
								ease: 'power3.out',
								onComplete: function() {
									refreshScroll();
								}
							});
							gsap.set(document.querySelectorAll('#filters li a'), { y: 100, opacity: 0 });
							gsap.to(document.querySelectorAll('#filters li a'), {
								duration: 0.5,
								y: 0,
								opacity: 1,
								delay: 0.4,
								stagger: 0.05,
								ease: 'power2.out'
							});
						} else {
							gsap.to(filtersWrapper, {
								duration: 0.6,
								opacity: 0,
								height: '0px',
								delay: 0.4,
								ease: 'power3.out',
								onComplete: function() {
									refreshScroll();
								}
							});
							gsap.to(document.querySelectorAll('#filters li a'), {
								duration: 0.3,
								y: -100,
								opacity: 0,
								delay: 0,
								stagger: 0.03,
								ease: 'power2.in'
							});
						}
					}
				});
			}

			shuffleText('.filter-option', { mode: 'hover' });
		}
		PortfolioFiltersUI();
		
		
		/*--- Portfolio Thumbs Click ---*/

		function PortfolioThumbsClick() {
			const thumbs = document.querySelectorAll('.clapat-item');
			if (!thumbs.length) return;

			thumbs.forEach(function(thumb) {
				thumb.addEventListener('click', function() {

					const isListView = portfolio.classList.contains('switch-layout') && portfolio.classList.contains('portfolio-list-view');
					if (!isListView) return;

					if (isMobile()) {
						const itemEffects = thumb.querySelector('.item-effects');
						if (itemEffects) {
							gsap.to(itemEffects, { duration:0.5, delay:0.5, opacity: 1 });
						}
					} else {
						const link = thumb.querySelector('.trigger-item-link');
						if (link) {
							link.click();
						}
					}

				});
			});
		}
		PortfolioThumbsClick();
	
	}; // End Showcase Portfolio



/*--------------------------------------------------
    Showcase Fullscreen Parallax
---------------------------------------------------*/

	window.ShowcaseParallax = function() {

		const sliderParallax = document.querySelector('.showcase-slider-parallax');
		if (!sliderParallax) return;

		const slideElements = document.querySelectorAll('.clapat-slide');
		const clapatSliderCaption = document.querySelector('.clapat-slider-caption');
		const pageContent = document.querySelector('#clapat-page-content');

		// ── Helpers ───────────────────────────────────────────────────────────────

		function processSlideElement(slideElement, selector, externalContainer, slideIndex) {
			const element = slideElement.querySelector(selector);
			if (!element) return;

			element.setAttribute('data-caption', slideIndex);
			if (slideElement.classList.contains('change-header')) element.classList.add('change-header');
			if (slideIndex === 1) element.classList.add('active');

			const itemDate = element.querySelector('.item-date');
			const itemCat = element.querySelector('.item-cat');

			if (itemDate || itemCat) {
				const wrapper = document.createElement('div');
				wrapper.classList.add('item-role');
				if (itemDate) wrapper.appendChild(itemDate);
				if (itemCat) wrapper.appendChild(itemCat);
				element.appendChild(wrapper);
			}

			externalContainer.appendChild(element);
		}

		slideElements.forEach(function(slideElement, index) {
			const slideIndex = index + 1;
			slideElement.setAttribute('data-slide', slideIndex);
			processSlideElement(slideElement, '.item-caption', clapatSliderCaption, slideIndex);
		});

		// ── Header color update ───────────────────────────────────────────────────

		function updateHeader(isChangeHeader) {
			const isDark = pageContent.classList.contains('dark-content');
			const dur = 0.3;
			const ease = 'power2.inOut';

			if (isChangeHeader) {
				gsap.to('#clapat-logo img.black-logo', { duration: dur, opacity: 1, ease: ease });
				gsap.to('#clapat-logo img.white-logo', { duration: dur, opacity: 0, ease: ease });
				gsap.to('.header-element-color', { duration: dur, color: '#000', ease: ease });
				gsap.to('.clapat-slider-footer', { duration: dur, color: '#000', ease: ease });
				gsap.to('.clapat-nav', { duration: dur, color: '#000', ease: ease });
				gsap.to('#burger-button', { duration: dur, color: '#000', ease: ease });
				gsap.to('.clapat-slider-progress', { duration: dur, filter: isDark ? 'invert(0)' : 'invert(1)', ease: ease });
			} else {
				gsap.to('#clapat-logo img.black-logo', { duration: dur, opacity: 0, ease: ease });
				gsap.to('#clapat-logo img.white-logo', { duration: dur, opacity: 1, ease: ease });
				gsap.to('.header-element-color', { duration: dur, color: '#fff', ease: ease });
				gsap.to('.clapat-slider-footer', { duration: dur, color: '#fff', ease: ease });
				gsap.to('.clapat-nav', { duration: dur, color: '#fff', ease: ease });
				gsap.to('#burger-button', { duration: dur, color: '#fff', ease: ease });
				gsap.to('.clapat-slider-progress', { duration: dur, filter: isDark ? 'invert(1)' : 'invert(0)', ease: ease });
			}
		}

		// ── Slide animations ──────────────────────────────────────────────────────

		function animateSlides(slider, arrElements, durationMultiplier) {
			durationMultiplier = durationMultiplier !== undefined ? durationMultiplier : 1;

			const slideDuration = (1 / arrElements.length) * durationMultiplier;
			const transitionDuration = slideDuration / 3;
			const staticDuration = slideDuration / 3;
			const stagger = -0.01;

			arrElements.forEach(function(element, index) {
				const spans = element.querySelectorAll('.span-word');
				const staggerTotal = (spans.length - 1) * stagger;
				const adjTransition = transitionDuration - staggerTotal;

				if (index === 0) {
					slider.tl
						.to(spans, {
							yPercent: 0,
							opacity: 1,
							duration: staticDuration * 0.5
						}, 0)
						.to(spans, {
							yPercent: -100,
							opacity: 0,
							duration: adjTransition,
							ease: 'circ.in',
							stagger: { each: stagger, from: 'start' }
						}, '>');
				} else {
					gsap.set(spans, { yPercent: 100, opacity: 0 });
					slider.tl
						.to(spans, {
							yPercent: 0,
							opacity: 1,
							duration: adjTransition,
							ease: 'circ.out',
							stagger: { each: stagger, from: 'start' }
						}, '>')
						.to(spans, {
							yPercent: 0,
							opacity: 1,
							duration: staticDuration
						}, '>')
						.to(spans, {
							yPercent: -100,
							opacity: 0,
							duration: adjTransition,
							ease: 'circ.in',
							stagger: { each: stagger, from: 'start' }
						}, '>');
				}
			});

			const firstSpans = arrElements[0].querySelectorAll('.span-word');
			const firstStaggerTotal = (firstSpans.length - 1) * stagger;
			const firstAdjTransition = transitionDuration - firstStaggerTotal;

			slider.tl
				.fromTo(firstSpans, {
					yPercent: 100,
					opacity: 0
				}, {
					yPercent: 0,
					opacity: 1,
					duration: firstAdjTransition,
					ease: 'circ.out',
					stagger: { each: stagger, from: 'start' }
				}, '>')
				.to(firstSpans, {
					yPercent: 0,
					opacity: 1,
					duration: staticDuration * 0.5
				}, '>');

			gsap.set(firstSpans, { yPercent: 0, opacity: 1 });
		}

		function animateSlidesOpacity(slider, arrElements, durationMultiplier) {
			durationMultiplier = durationMultiplier !== undefined ? durationMultiplier : 1;

			const totalDuration = slider.tl.duration();
			const slideDuration = totalDuration / arrElements.length;
			const transitionDuration = slideDuration / 3;
			const staticDuration = slideDuration / 3;

			arrElements.forEach(function(element, index) {
				const slideStart = slideDuration * index;

				if (index === 0) {
					gsap.set(element, { opacity: 1 });
					slider.tl
						.to(element, { opacity: 1, duration: staticDuration * 0.5 }, slideStart)
						.to(element, { opacity: 0, duration: transitionDuration }, slideStart + staticDuration * 0.5);
				} else {
					gsap.set(element, { opacity: 0 });
					slider.tl
						.to(element, { opacity: 1, duration: transitionDuration }, slideStart - transitionDuration)
						.to(element, { opacity: 1, duration: staticDuration }, slideStart)
						.to(element, { opacity: 0, duration: transitionDuration }, slideStart + staticDuration);
				}
			});

			const wrapStart = totalDuration;
			slider.tl
				.fromTo(arrElements[0], { opacity: 0 }, { opacity: 1, duration: transitionDuration }, wrapStart - transitionDuration)
				.to(arrElements[0], { opacity: 1, duration: staticDuration * 0.5 }, wrapStart);
			gsap.set(arrElements[0], { opacity: 1 });
		}

		// ── Caption events ────────────────────────────────────────────────────────

		function bindCaptionEvents() {
			document.querySelectorAll('.clapat-slider-caption .item-caption .item-title').forEach(function(titleElement) {				
				titleElement.addEventListener('mouseenter', () => {
					autoplayClapatSlider({ pause: '.showcase-slider-parallax' });					
				});

				titleElement.addEventListener('mouseleave', () => {
					autoplayClapatSlider({ play: '.showcase-slider-parallax' });
				});
				
				titleElement.addEventListener('click', function() {
					autoplayClapatSlider({ pause: '.showcase-slider-parallax' });

					const dataCaption = this.closest('.item-caption').getAttribute('data-caption');
					const parentSlide = document.querySelector('.clapat-slide.clapat-slide-active[data-slide="' + dataCaption + '"]');

					if (parentSlide) {
						parentSlide.classList.add('above');
						setTimeout(function() {
							const link = parentSlide.querySelector('.trigger-item-link');
							if (link) link.click();
						}, 50);
					}

					gsap.to('.clapat-slide.clapat-slide-active', { duration: 0.5, opacity: 1, ease: 'power2.inOut' });
					gsap.to('.clapat-caption-wrapper', { duration: 0.5, opacity: 0, filter: 'blur(3px)', ease: 'power4.inOut' });
					gsap.to('.fade-slide-element', { duration: 0.5, opacity: 0, ease: 'power4.inOut' });
				});
			});
		}

		// ── Slider init ───────────────────────────────────────────────────────────

		const slider = new ClapatSlider(sliderParallax, {
			ease: 0.065,
			direction: 'horizontal',
			mousewheel: true,
			snap: true,
			autoplay: { speed: 8000, paused: isMobile(), progress: 'bullet' }, // ← disabled on mobile
			outer: '.clapat-slider',
			inner: '.clapat-slider-viewport',
			pagination: true,
			renderBullet: function(index, className) {
				return '<div class="bullet-number-wrapper"><div class="bullet-number" data-ball="highlight"></div></div>';
			},
			navigation: {
				nextEl: '.cp-button-next',
				prevEl: '.cp-button-prev'
			},
			parallax: [{ element: '.item-effects', margin: 50 }],
			on: {
				init: function(slide) {
					initVideoBackground(this.el);
					gsap.set('.showcase-slider-parallax .clapat-slider-viewport', { scale: 1.1 });
					gsap.set('.clapat-slider-caption .item-caption:first-child .item-title span', { yPercent: 100 });
					gsap.set('.fade-slide-element', { y: 10, opacity: 0 });

					gsap.to(sliderParallax, { duration: 0.5, opacity: 1, ease: 'power2.inOut' });

					function initCaption() {
						gsap.to('.showcase-slider-parallax .clapat-slider-viewport', {
							duration: 1,
							scale: 1,
							ease: 'sine.out',
							onComplete: function() {
								gsap.set('.showcase-slider-parallax .clapat-slider-viewport', { clearProps: 'transform' });
							}
						});

						gsap.to('.clapat-slider-caption .item-caption:first-child .item-title span', { duration: 1.5, yPercent: 0, delay: 0.1, ease: 'expo.out' });
						gsap.to('.fade-slide-element', { duration: 0.6, y: 0, opacity: 1, delay: 0.6, ease: 'sine.out' });

						shuffleText('.clapat-slider-caption .item-caption:first-child .item-date span', { mode: 'animation', fadeIn: true, duration: 0.4, delay: 0.6 });
						shuffleText('.clapat-slider-caption .item-caption:first-child .item-cat span', { mode: 'animation', fadeIn: true, duration: 0.4, delay: 0.6 });

						gsap.to('.showcase-slider-parallax .clapat-caption-wrapper', {
							duration: 0.3,
							opacity: 1,
							onComplete: function() {
								setTimeout(function() {
									const sliderEl = document.querySelector('.showcase-slider-parallax');
									if (!sliderEl) return;

									const observer = new IntersectionObserver(function(entries) {
										entries.forEach(function(entry) {
											if (entry.isIntersecting) {
												if (!isMobile()) autoplayClapatSlider({ play: '.showcase-slider-parallax' }); // ← disabled on mobile
											} else {
												autoplayClapatSlider({ pause: '.showcase-slider-parallax' });
												CursorReset();
											}
										});
									}, { threshold: 0.75 });

									observer.observe(sliderEl);
								}, 1000);
							}
						});
					}

					if (preloaderDone || preloaderDisabled) {
						initCaption();
					} else {
						window.addEventListener('preloaderComplete', function() {
							gsap.delayedCall(0.5, initCaption);
						});
					}

					const firstSlide = document.querySelector('.clapat-slide');
					firstSlide.querySelectorAll('video').forEach(function(video) { video.play(); });
					updateHeader(firstSlide.classList.contains('change-header'));
				},
				activeSlideChanged: function(activeSlide, prevSlide, nextSlide) {
					const isChangeHeader = activeSlide.classList.contains('change-header');
					const activeIndex = activeSlide.getAttribute('data-slide');
					updateHeader(isChangeHeader);

					const isDragging = document.body.classList.contains('clapat-slider-is-dragging');
					if (isDragging) {
						const theme = isChangeHeader ? 'light' : 'dark';
						const prefix = '--cursor-drag-' + theme;
						gsap.to('#ball', {
							duration: 0.2,
							color: rootStyles.getPropertyValue(prefix + '-info-color').trim(),
							backgroundColor: rootStyles.getPropertyValue(prefix + '-bg-color').trim(),
							borderColor: rootStyles.getPropertyValue(prefix + '-border-color').trim(),
							ease: 'power2.inOut'
						});
					}

					if (prevSlide.querySelector('video')) prevSlide.querySelector('video').pause();
					if (activeSlide.querySelector('video')) activeSlide.querySelector('video').play();
					if (nextSlide.querySelector('video')) nextSlide.querySelector('video').pause();

					document.querySelectorAll('.clapat-slider-caption [data-caption]').forEach(function(element) {
						element.classList.toggle('active', element.getAttribute('data-caption') === activeIndex);
					});

					shuffleText(document.querySelectorAll('.clapat-slider-caption [data-caption="' + activeIndex + '"] .item-cat span'), { mode: 'animation', duration: 0.3 });
					shuffleText(document.querySelector('.clapat-slider-caption [data-caption="' + activeIndex + '"] .item-date span'), { mode: 'animation', duration: 0.3 });
				}
			}
		});

		// ── Timeline & caption animations ─────────────────────────────────────────

		const slideTitlesSpans = clapatSliderCaption.querySelectorAll('.item-title span');
		wrapText(slideTitlesSpans, { sentence: true, words: true });

		slider.tl
			.fromTo('.progress-info-fill', { backgroundSize: '0% 100%' }, { backgroundSize: '100% 100%' }, 0)
			.fromTo('.progress-info-empty', { backgroundSize: '100% 100%' }, { backgroundSize: '0% 100%', duration: 0.3, ease: 'power3' }, 0);

		animateSlides(slider, Array.from(document.querySelectorAll('.clapat-caption-wrapper .item-title')));
		animateSlidesOpacity(slider, Array.from(document.querySelectorAll('.clapat-caption-wrapper .item-date')));
		animateSlidesOpacity(slider, Array.from(document.querySelectorAll('.clapat-caption-wrapper .item-cat')));

		bindCaptionEvents();

	}; // End ShowcaseParallax



/*--------------------------------------------------
    Showcase Carousel
---------------------------------------------------*/

	window.ShowcaseCarousel = function() {

		const sliderCarouselWrapper = document.querySelector('.showcase-slider-carousel-horizontal');
		if (!sliderCarouselWrapper) return;

		const clapatSliderFooter = document.querySelector('.clapat-slider-footer');
		const slideElements = document.querySelectorAll('.clapat-slide');
		const snapOnMobile = isMobile();

		// ── Helpers ───────────────────────────────────────────────────────────────

		function processSlideElement(slideElement, selector, externalContainer, slideIndex) {
			const element = slideElement.querySelector(selector);
			if (!element) return;

			// clone goes to external container — without .item-date
			const clone = element.cloneNode(true);
			clone.setAttribute('data-caption', slideIndex);
			if (slideIndex === 1) clone.classList.add('active');
			const clonedDate = clone.querySelector('.item-date');
			if (clonedDate) clonedDate.remove();
			externalContainer.appendChild(clone);

			// original stays in slide — remove .item-title and .item-cat, keep only .item-date
			const originalTitle = element.querySelector('.item-title');
			const originalCat = element.querySelector('.item-cat');
			if (originalTitle) originalTitle.remove();
			if (originalCat) originalCat.remove();
		}

		// ── Slide setup ───────────────────────────────────────────────────────────

		slideElements.forEach(function(slideElement, index) {
			const slideIndex = index + 1;
			slideElement.setAttribute('data-slide', slideIndex);
			slideElement.style.setProperty('--slide-index', '"' + (slideIndex < 10 ? '0' + slideIndex : slideIndex) + '"');
		});

		// ── Desktop only ──────────────────────────────────────────────────────────

		if (!isMobile()) {

			const clapatSliderCaption = document.querySelector('.clapat-carousel-caption');
			const captionWrapper = document.querySelector('.clapat-carousel-caption-wrapper');

			slideElements.forEach(function(slideElement, index) {
				processSlideElement(slideElement, '.item-caption', clapatSliderCaption, index + 1);
			});

			// ── Caption animations ────────────────────────────────────────────────

			function captionIn() {
				const titleSpans = clapatSliderCaption.querySelectorAll('.item-title span');
				const catSpans = clapatSliderCaption.querySelectorAll('.item-cat span');
				gsap.set(titleSpans, { yPercent: 100 });
				gsap.set(catSpans, { yPercent: 100 });
				gsap.to(titleSpans, { duration: 0.3, yPercent: 0, ease: 'power2.out' });
				gsap.to(catSpans, { duration: 0.2, delay: 0.1, yPercent: 0, ease: 'power2.out' });
			}

			function captionOut() {
				const titleSpans = clapatSliderCaption.querySelectorAll('.item-title span');
				const catSpans = clapatSliderCaption.querySelectorAll('.item-cat span');
				gsap.to(titleSpans, { duration: 0.2, yPercent: -100, ease: 'power2.in' });
				gsap.to(catSpans, { duration: 0.2, yPercent: -100, ease: 'power2.in' });
			}

			// ── Caption hover ─────────────────────────────────────────────────────
			// delegation on the container to catch both originals and clones

			let currentSlideIndex = null;

			sliderCarouselWrapper.addEventListener('mouseover', function(event) {
				const slide = event.target.closest('.clapat-slide');
				if (!slide) return;
				const slideIndex = slide.getAttribute('data-slide');
				if (!slideIndex) return;
				const allCaptions = clapatSliderCaption.querySelectorAll('[data-caption]');
				allCaptions.forEach(function(caption) {
					caption.classList.toggle('active', caption.getAttribute('data-caption') === slideIndex);
				});
				captionWrapper.classList.add('visible-caption');
				sliderCarouselWrapper.classList.add('visible-caption');
				if (currentSlideIndex === null) captionIn();
				currentSlideIndex = slideIndex;
			});

			sliderCarouselWrapper.addEventListener('mouseout', function(event) {
				const slide = event.target.closest('.clapat-slide');
				if (!slide) return;
				if (slide.contains(event.relatedTarget)) return;
				const nextSlide = event.relatedTarget ? event.relatedTarget.closest('.clapat-slide') : null;
				if (nextSlide) return;
				currentSlideIndex = null;
				captionWrapper.classList.remove('visible-caption');
				sliderCarouselWrapper.classList.remove('visible-caption');
				captionOut();
			});

			// ── Caption mousemove ─────────────────────────────────────────────────

			const captionMouse = { x: captionWrapper.offsetWidth / 2 };
			const captionPos = { x: 0 };
			const captionRatio = 0.65;

			sliderCarouselWrapper.addEventListener('mousemove', function(event) {
				const wrapperRect = captionWrapper.getBoundingClientRect();
				captionMouse.x = event.clientX - wrapperRect.left;
			});

			function updateCaptionPosition() {
				const wrapperWidth = captionWrapper.offsetWidth;
				const normalizedX = (captionMouse.x / wrapperWidth) - 0.5;
				const targetX = normalizedX * wrapperWidth;
				captionPos.x += (targetX - captionPos.x) * captionRatio;
				gsap.to(clapatSliderCaption, { duration: 0.4, x: captionPos.x, overwrite: 'auto' });
			}

			// cleanup needed: gsap.ticker.add(updateCaptionPosition) runs every frame — no remove registered
			gsap.ticker.add(updateCaptionPosition);
		}

		// ── Slider init ───────────────────────────────────────────────────────────

		const slider = new ClapatSlider(sliderCarouselWrapper, {
			ease: 0.075,
			speed: 3,
			direction: 'horizontal',
			snap: snapOnMobile,
			navigation: {
				nextEl: '.cp-button-next',
				prevEl: '.cp-button-prev'
			},
			on: {
				init: function() {
					initVideoBackground(this.el);
					PortfolioPlayPauseVideo('.showcase-slider-carousel-horizontal', '.item-content');
					gsap.set('.fade-slide-element', { y: 20, opacity: 0 });

					function initCaption() {
						gsap.to(sliderCarouselWrapper, { duration: 0.1, opacity: 1, ease: 'none' });

						const visibleSlides = Array.from(document.querySelectorAll('.clapat-slide-visible .item-effects'));
						const itemCaptions = document.querySelectorAll('.showcase-slider-carousel-horizontal .item-caption');
						const fadeElements = document.querySelectorAll('.fade-slide-element');

						gsap.set(visibleSlides, { y: 80, opacity: 0 });
						gsap.set(itemCaptions, { y: 10, opacity: 0 });

						visibleSlides.sort(function(a, b) {
							const ra = a.getBoundingClientRect();
							const rb = b.getBoundingClientRect();
							if (ra.top !== rb.top) return ra.top - rb.top;
							return ra.left - rb.left;
						});

						const entryTimeline = gsap.timeline();

						visibleSlides.forEach(function(element, index) {
							const delay = 0.2 + index * 0.05;
							entryTimeline.to(element, {
								duration: 1.5,
								opacity: 1,
								y: 0,
								ease: 'expo.out',
							}, delay);
							entryTimeline.to(itemCaptions, {
								duration: 1.5,
								delay: 0.3,
								opacity: 1,
								y: 0,
								ease: 'expo.out',
							}, delay);
						});

						entryTimeline.to(fadeElements, {
							duration: 1,
							opacity: 1,
							y: 0,
							ease: 'expo.out',
							onStart: function() {
								clapatSliderFooter.classList.add('visible');
							}
						}, '<');
					}

					if (preloaderDone || preloaderDisabled) {
						initCaption();
					} else {
						window.addEventListener('preloaderComplete', function() {
							gsap.delayedCall(0.5, initCaption);
						});
					}
				}
			}
		});

		slider.tl
			.fromTo('.progress-info-fill', { backgroundSize: '0% 100%' }, { backgroundSize: '100% 100%' }, 0)
			.fromTo('.progress-info-empty', { backgroundSize: '100% 100%' }, { backgroundSize: '0% 100%', duration: 0.3, ease: 'power3.out' }, 0);

	}; // End ShowcaseCarousel



/*--------------------------------------------------
    Showcase Lists
---------------------------------------------------*/

	window.ShowcaseLists = function() {
		const sliderLists = document.querySelector('.showcase-slider-lists');
		if (!sliderLists) return;

		gsap.to('.header-gradient', { duration: 0.3, opacity: 0, ease: 'power2.inOut' });

		const slideElements = document.querySelectorAll('.showcase-slider-lists .clapat-slide');
		const clapatListsCaption = document.querySelector('.clapat-lists-caption');
		const snapOnMobile = isMobile();

		// ── Helpers ───────────────────────────────────────────────────────────────

		function processSlideElement(slideElement, slideIndex) {
			const caption = slideElement.querySelector('.item-caption');
			if (!caption) return;

			if (clapatListsCaption) {
				// clone .item-cat and .item-date into external container
				const itemCat = caption.querySelector('.item-cat');
				const itemDate = caption.querySelector('.item-date');

				const wrapper = document.createElement('div');
				wrapper.classList.add('item-caption');
				wrapper.setAttribute('data-caption', slideIndex);
				if (slideIndex === 1) wrapper.classList.add('active');

				if (itemCat) wrapper.appendChild(itemCat.cloneNode(true));
				if (itemDate) wrapper.appendChild(itemDate.cloneNode(true));

				clapatListsCaption.appendChild(wrapper);
			}

			// original keeps only .item-title — remove .item-cat and .item-date
			const originalCat = caption.querySelector('.item-cat');
			const originalDate = caption.querySelector('.item-date');
			if (originalCat) originalCat.remove();
			if (originalDate) originalDate.remove();
		}

		// ── Slide setup ───────────────────────────────────────────────────────────

		slideElements.forEach(function(slideElement, index) {
			const slideIndex = index + 1;
			slideElement.setAttribute('data-slide', slideIndex);
			slideElement.style.setProperty('--slide-index', '"' + (slideIndex < 10 ? '0' + slideIndex : slideIndex) + '"');
			processSlideElement(slideElement, slideIndex);
		});
		
		// ── Caption hover ─────────────────────────────────────────────────────────

		if (clapatListsCaption) {
			sliderLists.addEventListener('mouseover', function(event) {
				const itemContent = event.target.closest('.item-content');
				if (!itemContent) return;
				const slide = itemContent.closest('.clapat-slide');
				if (!slide) return;
				const slideIndex = slide.getAttribute('data-slide');
				if (!slideIndex) return;
				clapatListsCaption.querySelectorAll('[data-caption]').forEach(function(caption) {
					caption.classList.toggle('active', caption.getAttribute('data-caption') === slideIndex);
				});
			});
		}

		// ── Bind title click events ───────────────────────────────────────────────

		function bindTitleEvents() {
			document.querySelectorAll('.showcase-slider-lists .clapat-slide .item-caption .item-title').forEach(function(title) {
				title.addEventListener('click', function() {
					const parentSlide = this.closest('.item-content');
					if (parentSlide) {
						const link = parentSlide.querySelector('.trigger-item-link');
						if (link) link.click();
					}
					gsap.to('.showcase-slider-lists .clapat-slider', {
						'--mask-fade-top': '0%',
						'--mask-visible-top': '0%',
						'--mask-visible-bottom': '100%',
						'--mask-fade-bottom': '100%',
						duration: 0.3,
						delay: 0.2,
						ease: 'power2.inOut'
					});
					gsap.to('.fade-slide-element', {
						duration: 0.3,
						delay: 0.2,
						y: 10,
						opacity: 0,
						ease: 'power2.inOut'
					});
				});
			});
		}

		// ── Slider init ───────────────────────────────────────────────────────────

		const slider = new ClapatSlider('.showcase-slider-lists', {
			ease: 0.075,
			speed: 3,
			direction: 'vertical',
			snap: snapOnMobile,
			mediaCursorFollow: {
				element: '.item-content',
			},
			outer: '.clapat-slider',
			inner: '.clapat-slider-viewport',
			pagination: true,
			renderBullet: function(index, className) {
				return '' +
					'<div class="parallax-wrap get-this-color 1x">' +
						'<div class="parallax-element">' +
							'<div class="bullet-number secondary"></div>' +
						'</div>' +
					'</div>';
			},
			navigation: {
				nextEl: '.cp-button-next',
				prevEl: '.cp-button-prev'
			},
			on: {
				init: function(slide) {
					ThumbsImagesFollower('.showcase-slider-lists', '.item-content');
					initVideoBackground(this.el);
					PortfolioPlayPauseVideo('.showcase-slider-lists', '.item-content');
					gsap.set('.fade-slide-element', { y: 20, opacity: 0 });

					function initCaption() {
						gsap.to('.showcase-slider-lists', { duration: 0.1, opacity: 1, ease: 'none' });
						const visibleTitles = Array.from(document.querySelectorAll('.clapat-slide-visible .item-title span'));
						gsap.set(visibleTitles, { yPercent: 100, opacity: 0 });
						gsap.set('.clapat-slide-active .item-effects', { opacity: 0 });
						visibleTitles.sort(function(a, b) {
							const ra = a.getBoundingClientRect();
							const rb = b.getBoundingClientRect();
							if (ra.top !== rb.top) return ra.top - rb.top;
							return ra.left - rb.left;
						});
						const captionTimeline = gsap.timeline();
						visibleTitles.forEach(function(title, index) {
							captionTimeline.to(title, {
								duration: 1,
								delay: 0.2,
								yPercent: 0,
								opacity: 1,
								ease: 'expo.out',
							}, index * 0.05);
							captionTimeline.to('.fade-slide-element', {
								duration: 1,
								delay: 0.2,
								y: 0,
								opacity: 1,
								ease: 'expo.out'
							}, '<50%');
							if (isMobile()) {
								captionTimeline.to('.clapat-slide-active .item-effects', { 
									opacity: 1,
									onComplete: function() {
										gsap.set('.item-effects', { clearProps: "opacity" });
									}
							}, '<');
							}
						});
					}

					if (preloaderDone || preloaderDisabled) {
						initCaption();
					} else {
						window.addEventListener('preloaderComplete', function() {
							gsap.delayedCall(0.5, initCaption);
						});
					}
					
					if (!isMobile()) return;					
					const firstSlide = document.querySelector('.clapat-slide');
					firstSlide.querySelectorAll('video').forEach(function(video) { video.play(); });
				},
				
				activeSlideChanged: function(activeSlide, prevSlide, nextSlide) {
					if (!isMobile()) return;
					if (!clapatListsCaption) return;

					const slideIndex = activeSlide.getAttribute('data-slide');
					if (!slideIndex) return;

					clapatListsCaption.querySelectorAll('[data-caption]').forEach(function(caption) {
						caption.classList.toggle('active', caption.getAttribute('data-caption') === slideIndex);
					});
					
					if (prevSlide.querySelector('video')) prevSlide.querySelector('video').pause();
					if (activeSlide.querySelector('video')) activeSlide.querySelector('video').play();
					if (nextSlide.querySelector('video')) nextSlide.querySelector('video').pause();
				}
			}
		});

		slider.tl
			.fromTo('.progress-info-fill', { backgroundSize: '0% 100%' }, { backgroundSize: '100% 100%' }, 0)
			.fromTo('.progress-info-empty', { backgroundSize: '100% 100%' }, { backgroundSize: '0% 100%', duration: 0.3, ease: 'power3' }, 0);

		bindTitleEvents();

	}; // End ShowcaseLists



/*--------------------------------------------------
	Hayler Function
---------------------------------------------------*/

	window.Hayler = function() {
		
		/* --- Star Rotate --- */
		
		function initStarRotate() {
			const stars = document.querySelectorAll(".scroll-rotate .star");

			if (!stars.length) return;

			stars.forEach((star) => {
				const tl = gsap.timeline({ repeat: -1, paused: true })
					.to(star, {
						duration: 0.5,
						ease: "none"
					})
					.to(star, {
						rotation: "+=90",
						duration: 0.5,
						ease: "power2.inOut"
					})
					.to(star, {
						duration: 0.5,
						ease: "none"
					});

				ScrollTrigger.create({
					trigger: star.closest(".scroll-rotate"),
					start: "top bottom",
					end: "bottom top",
					onEnter: () => tl.play(),
					onLeave: () => tl.pause(),
					onEnterBack: () => tl.play(),
					onLeaveBack: () => tl.pause(),
				});
			});
		}
		initStarRotate();
		
		
		/* --- Clients Slider --- */
		
		function initClientsSlider() {
		
		
		if (document.querySelector('.clients-table-slider')) {

				const slider = document.querySelector('.clients-table-slider');
				if (!slider) return;

				const tables = slider.querySelectorAll('.clients-table');
				const prevBtn = slider.querySelector('.clients-button-prev');
				const nextBtn = slider.querySelector('.clients-button-next');

				if (!tables.length) return;

				function getActiveIndex() {
					return Array.from(tables).findIndex(t => t.classList.contains('active'));
				}

				function goTo(index) {
					tables.forEach(t => t.classList.remove('active'));
					tables[index].classList.add('active');
				}

				if (prevBtn) {
					prevBtn.addEventListener('click', function () {
						let current = getActiveIndex();
						let prev = (current - 1 + tables.length) % tables.length;
						goTo(prev);
					});
				}

				if (nextBtn) {
					nextBtn.addEventListener('click', function () {
						let current = getActiveIndex();
						let next = (current + 1) % tables.length;
						goTo(next);
					});
				}
			}
		}
		initClientsSlider();
		
		
		/*--- Nav Intro Stretch ---*/
		
		function initNavIntroStretch() {
			const wrapper = document.querySelector('.nav-intro-wrapper');
			if (!wrapper) return;

			if (wrapper.dataset.navIntroInit) return;
			wrapper.dataset.navIntroInit = 'true';

			const textElement = wrapper.querySelector('.nav-intro-text');
			if (!textElement) return;

			// CSS hint needed: add will-change: flex-grow to .nav-intro-text .span-word
			wrapText(textElement, { sentence: true, words: true });
			const textSpans = textElement.querySelectorAll(".span-word");

			textSpans.forEach(function(spanWord) {
				const innerSpan = spanWord.querySelector('span');
				if (!innerSpan) return;
				innerSpan.dataset.hover = innerSpan.textContent.trim();
			});

			let spansToAnimate;
			if (textSpans.length >= 3) {
				spansToAnimate = Array.from(textSpans);
			} else {
				spansToAnimate = Array.from(textSpans).slice(0, -1);
			}
			
			const nextAjaxLink = document.querySelector('.next-ajax-link-page');
			if (nextAjaxLink) {
				const innerSpans = Array.from(textSpans).map(function(spanWord) {
					return spanWord.querySelector('span');
				}).filter(function(innerSpan) {
					return innerSpan !== null;
				});

				let hoverTween = null;

				const hoverDuration = 0.5;
				const hoverStagger = 0.1;

				nextAjaxLink.addEventListener('mouseenter', function() {
					if (hoverTween) hoverTween.kill();
					hoverTween = gsap.timeline();
					innerSpans.forEach(function(span, index) {
						hoverTween.to(span, {
							yPercent: -100,
							duration: Math.max(0.1, hoverDuration - index * hoverStagger),
							ease: 'power2.inOut',
						}, index * hoverStagger);
					});
				});

				nextAjaxLink.addEventListener('mouseleave', function() {
					if (hoverTween) hoverTween.kill();
					hoverTween = null;
					gsap.set(innerSpans, { yPercent: 0 });
				});
			}

			const stretchTimeline = gsap.timeline({ paused: true });

			stretchTimeline.to(spansToAnimate, {
				flexGrow: 1 / spansToAnimate.length,
				duration: 1,
				ease: 'none',
			});

			ScrollTrigger.create({
				trigger: wrapper,
				start: function() {
					const wrapperPaddingTop = parseInt(getComputedStyle(wrapper).paddingTop);
					return 'top +=' + (window.innerHeight - wrapperPaddingTop);
				},
				end: function() {
					const gap = parseInt(window.rootStyles.getPropertyValue('--gap')) || 0;
					const wrapperPaddingTop = parseInt(getComputedStyle(wrapper).paddingTop);
					return '+=' + (window.innerHeight - wrapperPaddingTop - gap);
				},
				scrub: true,
				invalidateOnRefresh: true,
				onUpdate: function(self) {
					stretchTimeline.progress(self.progress);
				}
			});
		}
		initNavIntroStretch();
		
		
		/*--- Nav Snap ---*/
		
		function initNavSnap(isCleanup) {
			if (isCleanup) {
				if (initNavSnap._scrollHandler) {
					window.removeEventListener('scroll', initNavSnap._scrollHandler);
					initNavSnap._scrollHandler = null;
				}
				if (initNavSnap._timer) {
					clearTimeout(initNavSnap._timer);
					initNavSnap._timer = null;
				}
				initNavSnap._disabled = false;
				return;
			}

			const pageNavSection = document.getElementById('page-nav');
			if (!pageNavSection) return;

			const scrollStopDelay = 200;
			const snapDuration = 1.5;
			const snapThreshold = 0.5;
			const snapTolerance = 2;
			let isSnapping = false;
			let snapSafetyTimer = null;

			// ── Disable on nav link click ─────────────────────────────
			const nextPageLink = document.querySelector('.next-ajax-link-page');
			if (nextPageLink) {
				nextPageLink.addEventListener('click', function() {
					initNavSnap._disabled = true;
					isSnapping = false;
					if (snapSafetyTimer) {
						clearTimeout(snapSafetyTimer);
						snapSafetyTimer = null;
					}
					if (initNavSnap._timer) {
						clearTimeout(initNavSnap._timer);
						initNavSnap._timer = null;
					}
				});
			}

			function getVisibilityPercent(element) {
				const rect = element.getBoundingClientRect();
				const viewportHeight = window.innerHeight;
				const visibleTop = Math.max(rect.top, 0);
				const visibleBottom = Math.min(rect.bottom, viewportHeight);
				const visibleHeight = Math.max(0, visibleBottom - visibleTop);
				return visibleHeight / element.offsetHeight;
			}

			function easeExpoInOut(t) {
				if (t === 0) return 0;
				if (t === 1) return 1;
				if (t < 0.5) return Math.pow(2, 20 * t - 10) / 2;
				return (2 - Math.pow(2, -20 * t + 10)) / 2;
			}

			function snapToTop() {
				const rect = pageNavSection.getBoundingClientRect();
				if (rect.top < 0) return;
				if (Math.abs(rect.top) < snapTolerance) return;

				const gap = parseInt(window.rootStyles.getPropertyValue('--gap')) || 0;

				isSnapping = true;
				snapSafetyTimer = setTimeout(function() {
					isSnapping = false;
					snapSafetyTimer = null;
				}, (snapDuration + 0.5) * 1000);

				const targetY = window.scrollY + rect.top - gap;

				function onComplete() {
					clearTimeout(snapSafetyTimer);
					snapSafetyTimer = null;
					isSnapping = false;
				}

				if (window.lenis) {
					window.lenis.scrollTo(targetY, {
						duration: snapDuration,
						easing: easeExpoInOut,
						onComplete: onComplete
					});
				} else {
					gsap.to(window, {
						scrollTo: targetY,
						duration: snapDuration,
						ease: 'expo.inOut',
						onComplete: onComplete
					});
				}
			}

			function onScroll() {
				if (isSnapping || initNavSnap._disabled) return;
				clearTimeout(initNavSnap._timer);
				initNavSnap._timer = setTimeout(function() {
					if (initNavSnap._disabled) return;
					if (getVisibilityPercent(pageNavSection) > snapThreshold) {
						snapToTop();
					}
				}, scrollStopDelay);
			}

			initNavSnap._scrollHandler = onScroll;
			window.addEventListener('scroll', onScroll);
			pageRegistry.cleanup.push(initNavSnap);
		}
		initNavSnap();
		
		
		/*--- 404HoverEffect ---*/
		
		function init404HoverEffect() {
			const titleElement = document.querySelector('.error-caption .hero-title');
			if (!titleElement) return;

			const backHomeButton = document.querySelector('#back-home');
			
			let isAnimating = false;

			function animateTitle() {
				if (isAnimating) return;
				isAnimating = true;

				const spans = titleElement.querySelectorAll('.word-wrapper > span');

				gsap.to(spans, {
					yPercent: -100,
					duration: 0.5,
					ease: 'power2.inOut',
					stagger: 0.05,
					onComplete: function() {
						gsap.set(spans, { yPercent: 0 });
						isAnimating = false;
					}
				});
			}

			titleElement.addEventListener('pointerenter', animateTitle);

			if (backHomeButton) {
				backHomeButton.addEventListener('pointerenter', animateTitle);
			}
		}
		init404HoverEffect();
		
	}; // End Hayler Function



/*--------------------------------------------------
	Load Via Ajax
---------------------------------------------------*/

	window.LoadViaAjax = function() {			

		CleanupAfterAjax();
		initVideoBackground();
		
		ScrollEngine();
		ScrollActions();
		ScrollEffects();
		
		ShowcaseParallax();
		ShowcasePortfolio();
		ShowcaseCarousel();
		ShowcaseLists();
		
		PageHeroSection();
		PageContentLayout();
		
		TextAnimations();
		TextElements();
		ComponentsLibrary();
		
		
		PageFooterEffects();
		PageHeaderOptions();	
		PageResizer();
		PageReady();
		PageNavSection();
		
		LinkTriggerEvent();		
		PageTriggerEvent(pageTriggerOptions);
		ThumbTriggerEvent();
		ProjectTriggerEvent(projectTriggerOptions);
		
		AjaxTransitionComplete();	
		ClaPatMenu();
		CursorSetup();
		CustomFunction();
		
		Hayler();

	}; // End Load Via Ajax
	
	
	
