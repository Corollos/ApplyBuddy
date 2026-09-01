const autofillButton = document.getElementById("autofillButton");
const settingsButton = document.getElementById("settingsButton");
const status = document.getElementById("status");

settingsButton.addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});

autofillButton.addEventListener("click", async () => {
  try {
    status.textContent = "Checking profile...";

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });

    if (!tab || !tab.id) {
      status.textContent = "Could not access this page.";
      return;
    }

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });

    status.textContent = "Auto-fill complete!";
  } catch (error) {
    console.error("ApplyBuddy error:", error);
    status.textContent = "Could not run on this page.";
  }
});