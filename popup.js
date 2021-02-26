// Initialize button with user's preferred color
// let changeColor = document.getElementById("changeColor");

// chrome.storage.sync.get("color", ({ color }) => {
// 	changeColor.style.backgroundColor = color;
// });

window.onload = function () {
	var spacesList = document.getElementById("spaces");

	chrome.storage.sync.get("spaces", ({ spaces }) => {
		if (spaces.length == 0) {
			spacesList.innerHTML = "<div>You don't have any spaces yet.</div>"
		}
		spaces.forEach(space => spacesList.innerHTML += "<div> " + space + "</div>");
	});
};

document.getElementById("capture").addEventListener("click", () => {
	chrome.tabs.query({ currentWindow: true }, (tabs) => {
		console.log(tabs)

		tabIds = Array.from({ length: tabs.length }, (_, i) => i + tabs[0].id)
		console.log(tabIds)

		console.log(chrome.windows.WINDOW_ID_CURRENT)

		chrome.windows.create({}, (window) => {
			tabs.forEach(tab => {
				console.log(tab)
				chrome.tabs.create({
					active: tab.active,
					index: tab.index,
					url: tab.url,
					windowId: window.id
				})
			});
		})
	})
})