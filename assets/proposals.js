// Conditional Popover polyfill for older browsers (modern-web-guidance: navbar)
if (!Object.hasOwn(HTMLElement.prototype, "popover")) {
  import("https://unpkg.com/@oddbird/popover-polyfill@latest/dist/popover.min.js");
}

// 1. Responsive Site Navigation (modern-web-guidance: navbar)
(() => {
  const header = document.querySelector(".site-header");
  const inner = header?.querySelector(".header-inner");
  const menu = document.getElementById("site-menu");
  if (!header || !inner || !menu) return;

  let lastCollapsedWidth = 0;

  function syncNavLayout(forceMeasure = false) {
    const currentlyWide = header.classList.contains("is-wide");
    const currentWidth = header.clientWidth;

    if (!currentlyWide && !forceMeasure && currentWidth <= lastCollapsedWidth) {
      return;
    }

    const wasOpen = menu.matches(":popover-open, .\\:popover-open");
    header.classList.add("is-measuring", "is-wide");
    menu.removeAttribute("popover");

    const fitsInline = inner.scrollWidth <= inner.clientWidth;
    if (!fitsInline) {
      header.classList.remove("is-wide");
      menu.setAttribute("popover", "auto");
      lastCollapsedWidth = currentWidth;
      if (wasOpen && typeof menu.showPopover === "function") {
        try {
          menu.showPopover();
        } catch (_) {}
      }
    }

    requestAnimationFrame(() => {
      header.classList.remove("is-measuring");
    });
  }

  syncNavLayout(true);

  const ro = new ResizeObserver(() => syncNavLayout(false));
  ro.observe(header);
  ro.observe(menu);
})();

// 2. Accessible Tabbed Pipeline Explorer (modern-web-guidance: tabs)
(() => {
  for (const container of document.querySelectorAll(".tabs")) {
    const tablist = container.querySelector('[role="tablist"]');
    if (!tablist) continue;
    const tabs = Array.from(tablist.querySelectorAll('button[role="tab"]'));
    const panels = Array.from(container.querySelectorAll('[role="tabpanel"]'));

    function activateTab(selected, moveFocus = false) {
      for (const tab of tabs) {
        const isSelected = tab === selected;
        tab.setAttribute("aria-selected", String(isSelected));
        tab.tabIndex = isSelected ? 0 : -1;
        tab.toggleAttribute("focusgroupstart", isSelected);
      }
      for (const panel of panels) {
        const isMatch = panel.getAttribute("aria-labelledby") === selected.id;
        if (isMatch) {
          panel.removeAttribute("hidden");
          panel.tabIndex = 0;
        } else {
          panel.setAttribute("hidden", "until-found");
          panel.removeAttribute("tabindex");
        }
      }
      selected.scrollIntoView({ block: "nearest", inline: "nearest", container: "nearest" });
      if (moveFocus) selected.focus();
    }

    tabs.forEach((tab, idx) => {
      tab.addEventListener("click", () => activateTab(tab, false));
      tab.addEventListener("keydown", (e) => {
        let nextIdx = -1;
        if (e.key === "ArrowRight") nextIdx = (idx + 1) % tabs.length;
        else if (e.key === "ArrowLeft") nextIdx = (idx - 1 + tabs.length) % tabs.length;
        else if (e.key === "Home") nextIdx = 0;
        else if (e.key === "End") nextIdx = tabs.length - 1;
        if (nextIdx >= 0) {
          e.preventDefault();
          activateTab(tabs[nextIdx], true);
        }
      });
    });

    panels.forEach((panel) => {
      panel.addEventListener("beforematch", () => {
        const ownerTab = document.getElementById(panel.getAttribute("aria-labelledby") || "");
        if (ownerTab) activateTab(ownerTab, false);
      });
    });
  }

  if (!CSS.supports("animation-timeline", "scroll()")) {
    for (const scroller of document.querySelectorAll(".tablist-scroller")) {
      const [first, last] = [scroller.firstElementChild, scroller.lastElementChild];
      if (!first || !last) continue;
      const observer = new IntersectionObserver(
        (entries) => {
          for (const { target, intersectionRatio } of entries) {
            scroller.classList.toggle(
              target === first ? "more-start" : "more-end",
              intersectionRatio < 1
            );
          }
        },
        { root: scroller, threshold: 1, rootMargin: "1px" }
      );
      observer.observe(first);
      observer.observe(last);
    }
  }
})();

// 3. Direct Inline Video Lazy-Load Fallback & Exclusive Playback (modern-web-guidance: lazy-load-video-and-audio)
(() => {
  const allVideos = Array.from(document.querySelectorAll("video"));

  for (const vid of allVideos) {
    vid.addEventListener("play", () => {
      for (const other of allVideos) {
        if (other !== vid && !other.paused) {
          other.pause();
        }
      }
    });
  }

  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  function syncReducedMotion(prefersReducedMotion) {
    for (const video of document.querySelectorAll("video[autoplay]")) {
      if (prefersReducedMotion) {
        video.removeAttribute("autoplay");
        video.pause();
      }
    }
  }
  syncReducedMotion(reducedMotionQuery.matches);
  reducedMotionQuery.addEventListener("change", (e) => syncReducedMotion(e.matches));

  const supportsLazyMedia = Object.hasOwn(HTMLMediaElement.prototype, "loading");
  if (!supportsLazyMedia) {
    const lazyVideos = document.querySelectorAll('video[loading="lazy"]');
    const mediaObserver = new IntersectionObserver(
      (entries, observer) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const media = entry.target;
          if (media.dataset.poster) {
            media.poster = media.dataset.poster;
            delete media.dataset.poster;
          }
          if (media.dataset.preload) {
            media.preload = media.dataset.preload;
            delete media.dataset.preload;
          }
          for (const source of media.querySelectorAll("source[data-src]")) {
            source.src = source.dataset.src;
            delete source.dataset.src;
          }
          media.load();
          observer.unobserve(media);
        }
      },
      { rootMargin: "240px 0px" }
    );

    for (const media of lazyVideos) {
      if (media.hasAttribute("poster")) {
        media.dataset.poster = media.getAttribute("poster");
        media.removeAttribute("poster");
      }
      if (media.hasAttribute("preload") && media.getAttribute("preload") !== "none") {
        media.dataset.preload = media.getAttribute("preload");
      }
      for (const source of media.querySelectorAll("source[src]")) {
        source.dataset.src = source.getAttribute("src");
        source.removeAttribute("src");
      }
      media.preload = "none";
      mediaObserver.observe(media);
    }
  }
})();

// 4. Filterable Video Demo Use-Case Request Table (video-requests.html)
(() => {
  const chips = Array.from(document.querySelectorAll("[data-video-filter]"));
  if (!chips.length) return;
  const rows = Array.from(document.querySelectorAll("tr[data-segment]"));
  const countEl = document.getElementById("video-request-count");

  function applyFilter(filterKey) {
    let visible = 0;
    for (const chip of chips) {
      chip.setAttribute("aria-pressed", String(chip.dataset.videoFilter === filterKey));
    }
    for (const row of rows) {
      const match =
        filterKey === "all" ||
        row.dataset.segment === filterKey ||
        row.dataset.priority === filterKey;
      row.hidden = !match;
      if (match) visible += 1;
    }
    if (countEl) {
      countEl.textContent = `HIỂN THỊ ${visible}/${rows.length} USECASE`;
    }
  }

  for (const chip of chips) {
    chip.addEventListener("click", () => applyFilter(chip.dataset.videoFilter || "all"));
  }
})();
