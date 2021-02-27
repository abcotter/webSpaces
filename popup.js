window.onload = function () {
	let spacesList = document.getElementById("spaces");

	chrome.storage.sync.get("spaces", ({ spaces }) => {
		spaces.forEach(space => {
			spacesList.innerHTML += '<button class="space-button" id="' + space.spaceName + ">" + space.spaceName + '</button><img src="/assets/delete.svg" class="add-button" />'
		});
		let spaceSlots = spacesList.querySelectorAll(".space-button")
		spaceSlots.forEach(space => {
			space.addEventListener("click", (e) => {
				alert(e.target.id)
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
	});
};

document.getElementById("capture").addEventListener("click", () => {
	chrome.tabs.query({ currentWindow: true }, (tabs) => {
		chrome.storage.sync.get("spaces", ({ spaces }) => {
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

chrome.storage.onChanged.addListener((changes, type) => {
	if ('spaces' in changes) {
		let spacesList = document.getElementById("spaces");
		spacesList.innerHTML = "";
		let newSpaces = changes.spaces.newValue
		newSpaces.forEach(space => {
			spacesList.innerHTML += "<button class='space-button' id=" + space.spaceName + ">" + space.spaceName + "</button><img src=\"/assets/delete.svg\" />"
		});
		let spaceSlots = spacesList.querySelectorAll(".space-button")
		spaceSlots.forEach(space => {
			space.addEventListener("click", (e) => {
				alert(e.target.id)
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
	}
})

//  this is code for opening and populating the new window "space"
// chrome.windows.create({}, (window) => {
// 	tabs.forEach(tab => {
// 		chrome.tabs.create({
// 			active: tab.active,
// 			index: tab.index,
// 			url: tab.url,
// 			windowId: window.id
// 		})
// 	});
// })