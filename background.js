let spaces = [];

chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.sync.set({ spaces });
});