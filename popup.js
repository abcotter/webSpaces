// Initialize button with user's preferred color
// let changeColor = document.getElementById("changeColor");

// chrome.storage.sync.get("color", ({ color }) => {
// 	changeColor.style.backgroundColor = color;
// });

window.onload = function () {
	var spacesList = document.getElementById("main");

	chrome.storage.sync.get("spaces", ({ spaces }) => {
		if (spaces.length == 0) {
			spacesList.innerHTML = "<div>You don't have any spaces yet.</div>"
		}
		spaces.forEach(space => spacesList.innerHTML += "<div> " + space + "</div>");
	});
};

// When the button is clicked, inject setPageBackgroundColor into current page
// changeColor.addEventListener("click", async () => {
// 	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

// 	chrome.scripting.executeScript({
// 		target: { tabId: tab.id },
// 		function: setPageBackgroundColor,
// 	});
// });

// // The body of this function will be executed as a content script inside the
// // current page
// function setPageBackgroundColor() {
// 	chrome.storage.sync.get("color", ({ color }) => {
// 		document.body.style.backgroundColor = color;
// 	});
// }