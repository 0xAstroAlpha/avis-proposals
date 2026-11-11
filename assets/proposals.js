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

  // Fallback for browsers without scroll-driven animations on horizontal tab scrollers
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

// 3. Light-Dismiss Video Showcase Dialog + Safari Fallback (modern-web-guidance: light-dismiss-a-dialog)
(() => {
  const dialog = document.getElementById("demoVideoDialog");
  const videoEl = document.getElementById("dialogVideoPlayer");
  const titleEl = document.getElementById("demoDialogTitle");
  if (!dialog || !videoEl || !titleEl) return;

  for (const btn of document.querySelectorAll("[data-video-src]")) {
    btn.addEventListener("click", () => {
      const src = btn.getAttribute("data-video-src") || "";
      const title = btn.getAttribute("data-video-title") || "AVIS Showcase Demo";
      const poster = btn.getAttribute("data-video-poster") || "";
      titleEl.textContent = title;
      if (poster) videoEl.setAttribute("poster", poster);
      videoEl.src = src;
      dialog.showModal();
      videoEl.play().catch(() => {});
    });
  }

  dialog.addEventListener("close", () => {
    videoEl.pause();
    videoEl.removeAttribute("src");
    videoEl.load();
  });

  // Mandatory fallback for browsers without <dialog closedby> support (e.g. Safari)
  if (!("closedBy" in HTMLDialogElement.prototype)) {
    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const isDialogContent =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;
      if (isDialogContent) return;
      dialog.close();
    });
  }
})();

// 4. Copy Shareable Link Button
(() => {
  for (const btn of document.querySelectorAll("[data-copy-url]")) {
    btn.addEventListener("click", async () => {
      const targetUrl = btn.getAttribute("data-copy-url") || window.location.href;
      const resolved = new URL(targetUrl, window.location.href).href;
      try {
        await navigator.clipboard.writeText(resolved);
        const orig = btn.textContent;
        btn.textContent = "Đã sao chép link ✓";
        setTimeout(() => {
          btn.textContent = orig;
        }, 1800);
      } catch (_) {}
    });
  }
})();
