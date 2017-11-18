'use strict';
console.clear();

try {
	const trelloBoardURL = /\S+:\/\/\S*\.?trello\.com\/b\/\S+/;
	var injectStatus = undefined;

	async function urlCheck(id, updateReason, state) {
		if ( !(state.url.match(trelloBoardURL)) )
			return;

		if ( injectStatus == 'pending' )
			return;

		injectStatus = "pending";

		try {
			await browser.tabs.insertCSS({file: "/enhancedStyles.css"});
			await browser.tabs.executeScript({file: "/inject.js"});

			injectStatus = "fullfilled";
			console.info(`TSP: successfully injected 'inject.js' into ${state.url}`);
		}
		catch(e) {
			injectStatus = "rejected";
			console.error(`TSP Error. Could not inject 'inject.js' into ${state.url}: ` , e);
		}
	}

	/* Trello uses AJAX loading and because of this when a board is loaded from
	within the UI (not from URL) 'inject.js' won't be fired. To overcome this we
	listen for URL changes initTrelloBoardand fire inizializations manually */
	browser.tabs.onUpdated.addListener(urlCheck);

	browser.runtime.onStartup.addListener(checkSettings);
	browser.runtime.onInstalled.addListener(checkSettings);

	console.info("Trello Super Powers WebExtension started successfully.");
}
catch(e) {console.error("TSP Error: \n", e);}

/**
* Checks current settings and defaults them as necessary
*/
async function checkSettings() {
	var settings = await browser.storage.local.get();

	if (settings['compactMode'] === undefined) {
		browser.storage.local.set({compactMode: true});
	}
	if (settings['numberOfCards'] === undefined) {
		browser.storage.local.set({numberOfCards: true});
	}
	if (settings['labelText'] === undefined) {
		browser.storage.local.set({labelText: true});
	}
	if (settings['copyId'] === undefined) {
		browser.storage.local.set({copyId: true});
	}
	if (settings.list.width === undefined) {
		browser.storage.local.set({list: {width: 270}});
	}
}
