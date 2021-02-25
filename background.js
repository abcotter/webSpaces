let spaces = [];

chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.sync.set({ spaces });
	console.log(chrome.storage.sync.get({ spaces }));
});

chrome.runtime.onStartup.addListener(() => {
	var spacesList = document.getElementById("main");

	chrome.storage.sync.get("spaces", ({ spaces }) => {
		spaces.forEach(space => spacesList.innerHTML += "<div> " + space + "</div>");
	});
})