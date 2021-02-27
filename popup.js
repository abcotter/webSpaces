window.onload = function () {
	let spacesList = document.getElementById("spaces");

	chrome.storage.sync.get("spaces", ({ spaces }) => {
		spaces.forEach(space => {
			spacesList.innerHTML += "<button id=" + space.spaceName + ">" + space.spaceName + "</button>"
			document.getElementById(space.spaceName).addEventListener("click", (e) => {
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
		});
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
	console.log(changes, type)
	if ('spaces' in changes) {
		let spacesList = document.getElementById("spaces");
		spacesList.innerHTML = "";
		let newSpaces = changes.spaces.newValue
		console.log(newSpaces)
		newSpaces.forEach(space => {
			spacesList.innerHTML += "<button id=" + space.spaceName + ">" + space.spaceName + "</button>"
			document.getElementById(space.spaceName).addEventListener("click", (e) => {
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
		});
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