'use strict';
console.clear();

try {
	const trelloBoardURL = /\S+:\/\/\S*\.?trello\.com\/b\/\S+/;
	var injectStatus = undefined;

	function moveOn(e) {
		if (e.width)
			return;

		browser.storage.local.set({list: {width: 270}})
		.then((e) => {console.info("TSP: Defaulting to 270 for listWidth now.")});
	}

	function onError(error) {
		console.error(`Error: ${error}`);
	}

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

	browser.storage.local.get("list")
	.then(moveOn, onError);

	/* Trello uses AJAX loading and because of this when a board is loaded from
	within the UI (not from URL) 'inject.js' won't be fired. To overcome this we
	listen for URL changes initTrelloBoardand fire inizializations manually */
	browser.tabs.onUpdated.addListener(urlCheck);

	console.info("Trello Super Powers WebExtension started successfully.");
}
catch(e) {console.error("TSP Error: \n", e);}

