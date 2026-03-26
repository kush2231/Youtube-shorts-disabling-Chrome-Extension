// const SHORTS_SELECTORS = [
//   'ytd-reel-shelf-renderer',     // Home feed shorts
//   'ytd-rich-section-renderer',  // Shorts sections
//   'ytd-guide-entry-renderer a[href^="/shorts"]'
// ];

// function hideShorts() {
//   SHORTS_SELECTORS.forEach(selector => {
//     document.querySelectorAll(selector).forEach(el => {
//       el.remove();
//     });
//   });
// }

// // Block direct Shorts URLs
// function blockShortsURL() {
//   if (location.pathname.startsWith('/shorts')) {
//     document.body.innerHTML = `
//       <div style="
//         display:flex;
//         justify-content:center;
//         align-items:center;
//         height:100vh;
//         font-size:18px;
//         font-family:sans-serif;
//       ">
//         🧠 YouTube Shorts are blocked to protect your focus.
//       </div>
//     `;
//   }
// }

// // Observe dynamic loading
// const observer = new MutationObserver(() => {
//   hideShorts();
// });

// chrome.storage.sync.get(['enabled'], (result) => {
//   const enabled = result.enabled ?? true;
//   if (!enabled) return;

//   hideShorts();
//   blockShortsURL();

//   observer.observe(document.body, {
//     childList: true,
//     subtree: true
//   });
// });


const SHORTS_SELECTORS = [
  'ytd-reel-shelf-renderer',
  'ytd-rich-section-renderer',
  'a[href^="/shorts"]',
  'ytd-mini-guide-entry-renderer:has(a[href^="/shorts"])'
];

function hideShortsGuideEntry() {
  document.querySelectorAll('ytd-guide-entry-renderer').forEach(el => {
    if (el.querySelector('yt-formatted-string.title')?.textContent.trim() === 'Shorts') {
      el.remove();
    }
  });
}

let lastUrl = location.href;

function hideShorts() {
  SHORTS_SELECTORS.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => el.remove());
  });
  hideShortsGuideEntry();
}

function blockShortsPage() {
  if (location.pathname.startsWith('/shorts')) {
    location.replace('/');
  }
}

// Observe DOM changes (infinite scroll + SPA updates)
const observer = new MutationObserver(() => {
  hideShorts();

  // Detect URL change in SPA
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    blockShortsPage();
  }
});

chrome.storage.sync.get(['enabled'], (result) => {
  const enabled = result.enabled ?? true;
  if (!enabled) return;

  hideShorts();
  blockShortsPage();

  observer.observe(document, {
    childList: true,
    subtree: true
  });
});
