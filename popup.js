// Event listener to capture a new space
document.getElementById("capture").addEventListener("click", () => {
	if (document.getElementById("spaceName").value == "") {
		alert("You need to give your new space a name.")
		return
	}
	chrome.tabs.query({ currentWindow: true }, (tabs) => {
		chrome.storage.sync.get("spaces", ({ spaces }) => {
			if (spaces.some(space => space.spaceName == document.getElementById("spaceName").value)) {
				alert("A space with that name already exists.")
				return
			}
			let newSpace = {
				spaceName: document.getElementById("spaceName").value,
				spaceTabs: tabs.map(item => {
					return {
						'active': item.active,
						'index': item.index,
						'url': item.url
					}
				})
			};
			spaces.push(newSpace);
			chrome.storage.sync.set({ spaces }, () => { });
		});
	})
})

// handler to trigger loadSpaces when the extension is loaded
window.onload = function () {
	chrome.storage.sync.get("spaces", ({ spaces }) => {
		loadSpaces(spaces)
	});
};

// handler to ltrigger loadSpaces when a space is added or deleted
chrome.storage.onChanged.addListener((changes, type) => {
	if ('spaces' in changes) {
		let newSpaces = changes.spaces.newValue
		loadSpaces(newSpaces)
	}
})

// function that builds and injects the spaces into the html with event listeners for each space
function loadSpaces(spacesToLoad) {
	let spacesList = document.getElementById("spaces");
	spacesList.innerHTML = "";

	spacesToLoad.forEach(space => {
		spacesList.innerHTML += '<div style="display: flex;" id="' + space.spaceName + 'Bin"><button class="space-button" id="' + space.spaceName + '">' + space.spaceName + '</button><img class="space-delete" id="' + space.spaceName + '" src="/assets/delete.svg" /></div>'
	});
	let spaceButtons = spacesList.querySelectorAll(".space-button")
	spaceButtons.forEach(space => {
		space.addEventListener("click", (e) => {
			chrome.storage.sync.get("spaces", ({ spaces }) => {
				spaceToLaunchTabs = spaces.filter(space => space.spaceName == e.target.id)[0].spaceTabs
				chrome.windows.create({}, (window) => {
					spaceToLaunchTabs.forEach(tab => {
						chrome.tabs.create({
							active: tab.active,
							index: tab.index,
							url: tab.url,
							windowId: window.id
						})
					});
				})
			});
		});
	})
	let spaceDeletes = spacesList.querySelectorAll(".space-delete")
	spaceDeletes.forEach(space => {
		space.addEventListener("click", (e) => {
			chrome.storage.sync.get("spaces", ({ spaces }) => {
				spaces = spaces.filter(space => space.spaceName != e.target.id)
				chrome.storage.sync.set({ spaces }, () => { });
			});
		});
	})
}