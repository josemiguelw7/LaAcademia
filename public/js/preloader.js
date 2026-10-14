function Preloader({ timelineBuilder, onHide } = {}) {
    const body = document.body;

    if (body.classList.contains('disable-preloader')) {
        body.classList.remove('hidden');
        setTimeout(() => {
            if (typeof window.onPreloaderComplete === "function") {
                try { window.onPreloaderComplete(); } catch (e) { console.warn("onPreloaderComplete error:", e); }
            }
        }, 0);
        return;
    }

    const minTime = 3000;
    const startTime = performance.now();
    const preloaderWrap = document.getElementById('clapat-preloader');

    if (!preloaderWrap) {
        setTimeout(() => {
            if (typeof window.onPreloaderComplete === "function") {
                try { window.onPreloaderComplete(); } catch (e) { console.warn("onPreloaderComplete error:", e); }
            }
        }, 0);
        return;
    }

    let safetyTimeout = setTimeout(() => forceComplete(), 10000);

    function forceComplete() {
        clearTimeout(safetyTimeout);
        try {
            if (typeof window.onPreloaderComplete === "function") {
                window.onPreloaderComplete();
            }
        } catch (e) {
            console.warn("onPreloaderComplete error:", e);
        }
        if (typeof onHide === "function") {
            onHide();
        } else {
            gsap.set(preloaderWrap, { yPercent: -100 });
        }
    }

    window.addEventListener("load", function onLoad() {
        window.removeEventListener("load", onLoad);
        clearTimeout(safetyTimeout);

        function PreloaderAnimation() {
            return new Promise((resolve) => {
                body.classList.remove('hidden');
                const docTime = performance.now() - startTime;
                const finalTime = Math.max(minTime, docTime) / 1000;

                const tl = gsap.timeline({ paused: true, onComplete: resolve });

                if (typeof timelineBuilder === "function") {
                    timelineBuilder(tl, finalTime);
                } else {
                    resolve();
                }

                tl.play();
            });
        }

        PreloaderAnimation().then(() => {
            try {
                if (typeof window.onPreloaderComplete === "function") {
                    window.onPreloaderComplete();
                }
            } catch (e) {
                console.warn("onPreloaderComplete error:", e);
            }

            if (typeof onHide === "function") {
                onHide();
            } else {
                gsap.to(preloaderWrap, {
                    duration: 0.8,
                    yPercent: -100,
                    ease: "expo.inOut",
                    onComplete: () => preloaderWrap.remove()
                });
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", () => Preloader({

    timelineBuilder: (tl, finalTime) => {
        tl.to('.number_1', { yPercent: -100, duration: finalTime, ease: 'expo.inOut' }, 1)
          .to('.number_2', { yPercent: -1000, duration: finalTime, ease: 'expo.inOut' }, 0.5)
          .to('.number_3', {
                yPercent: -1000,
                duration: finalTime,
                ease: 'expo.inOut',
                onComplete: () => gsap.to(".percentage", {
                    duration: 2, delay: 0.1, yPercent: -200, ease: "expo.inOut"
                })
          }, 0.25);
    },

    onHide: () => {
        const preloaderWrap = document.getElementById('clapat-preloader');

        gsap.to('.preloader-info span', {
            duration: 0.5, delay: 0.1, opacity: 0, yPercent: -100, ease: "expo.inOut"
        });

        const spans = Array.from(document.querySelectorAll('.preloader-reveal span'));
        const customOrder = [spans[2], spans[0], spans[3], spans[1]];

        gsap.to(customOrder, {
            duration: 1, delay: 0.1, scaleY: 0, yPercent: -10,
            ease: "expo.inOut", stagger: 0.05,
            onComplete: () => gsap.set(preloaderWrap, { yPercent: -100 })
        });
    }

}));