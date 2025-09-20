// Saves mode choice to chrome.storage & injects implant.js if "implant" selected
const radios = document.querySelectorAll('input[name="mode"]');
const saveBtn = document.getElementById('save');

// Load saved preference
chrome.storage.local.get('mode', data => {
  const m = data.mode || 'overlay';
  document.querySelector(`input[value="${m}"]`).checked = true;
});

saveBtn.onclick = () => {
  const mode = [...radios].find(r => r.checked).value;
  chrome.storage.local.set({ mode });
  // If implant mode, run implant.js in active tab
  if (mode === 'implant') {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['implant.js']
      });
    });
  }
  window.close();
};
