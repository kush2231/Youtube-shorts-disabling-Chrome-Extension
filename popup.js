const statusText = document.getElementById('status');
const toggleBtn = document.getElementById('toggleBtn');

chrome.storage.sync.get(['enabled'], (result) => {
  const enabled = result.enabled ?? true;
  updateUI(enabled);
});

toggleBtn.addEventListener('click', () => {
  chrome.storage.sync.get(['enabled'], (result) => {
    const newState = !(result.enabled ?? true);
    chrome.storage.sync.set({ enabled: newState }, () => {
      updateUI(newState);
      chrome.tabs.reload();
    });
  });
});

function updateUI(enabled) {
  statusText.textContent = enabled
    ? 'Blocking is ON'
    : 'Blocking is OFF';
  toggleBtn.textContent = enabled
    ? 'Disable Blocking'
    : 'Enable Blocking';
}
