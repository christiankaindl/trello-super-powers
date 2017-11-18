'use strict';

/*
Inizialize Trello Super Powers features
- copy card id on click
- compact mode
- resizable lists
- label text
- number of cards per list
*/

function gracefullyInject(feature) {
	/** Takes a funtion and injects it
	* TODO: add error handling logic
	*/
	feature();
}

async function getSettings() {
		return await browser.storage.local.get();
}

var features = {
	id() {
		return new Promise(function (resolve, reject) {
			let input = document.createElement('input');
			// Add dummy element so we can use the clipboard functionality
			document.getElementsByTagName('body')[0].appendChild(input);

			document.addEventListener('click', function(e) {
						if(e.target.classList.contains('card-short-id')) {
					e.stopImmediatePropagation();
					e.preventDefault();

					input.value = e.target.textContent;
					input.select();

					document.execCommand('copy');

					// NOTE: Content Scripts do not have access to the notifications API. If a notification should be sent, we have to communicate with the background script using the messaging API
					// browser.notifications.create({type: "basic", title: 'ID saved!', message: 'Trello Super Powers Add-on', iconUrl: "/assets/TSP_logo.svg"})
					// .catch(function (e) {
					// 	console.log(e);
					// });
				}
			}, true);

			console.info("TSP: feature 'id' injected");
			board.classList.add('TSP-id-enabled');
			resolve();
		});
	},
	compact() {
		return new Promise(async function(resolve, reject) {

			// if ((await browser.storage.local.get()).settings.compact == false ) {
			// 	resolve();
			// }

			let compactModeBtn = document.createElement('a');

			compactModeBtn.setAttribute('class', 'board-header-btn compact-mode-button');
			compactModeBtn.setAttribute('title', 'Toggle Compact Mode');

			{
				let inner = document.createElement('span');

				inner.setAttribute('class', 'board-header-btn-text');
				inner.textContent = "Compact Mode";

				compactModeBtn.appendChild(inner);
			}

			compactModeBtn.addEventListener('click', function toggleCompactMode() {
				// Toggle compactMode
				board.classList.toggle('compact-mode');
			});

			document.getElementById('permission-level').parentElement.appendChild(compactModeBtn);

			console.info("TSP: feature 'compact' injected");
			board.classList.add('TSP-compact-enabled');
			resolve();
		});
	},
	resize(){
		return new Promise(async function(resolve, reject) {
			var listWidth = ( await browser.storage.local.get() ).list.width || 270;

			function createResizeElem() {
				let resizeElem = document.createElement('div');

				resizeElem.setAttribute("class", "resize-element");
				resizeElem.addEventListener("mousedown", function (e) {
					document.addEventListener("mousemove", attach);
					document.addEventListener("mouseup", remove);

					function attach(e) {
						let styleId = document.getElementById("inserted-tsp-styles"),
							currentWidth = ((listWidth+(e.movementX / 4) < 400)&&(listWidth+(e.movementX / 4) > 150))
							? (listWidth=listWidth+(e.movementX / 4))
							: listWidth;

						console.info("TSP: feature 'resize' injected");
						styleId.textContent=`.list-wrapper {width: ${currentWidth}px}`;
						console.info(e.movementX);
					}
					function remove(e) {
					console.log(listWidth)
						browser.storage.local.set({list:{width: listWidth}})
						.catch((e) => {console.error("TSP: Could not save 'listWidth' to browser sync storage.")});

						document.removeEventListener("mousemove", attach);
						document.removeEventListener("mouseup", remove);
					}
				});

				return resizeElem;
			}

			if (!document.getElementById("inserted-tsp-styles")) {
				let styleElem = document.getElementsByTagName("head")[0].appendChild(document.createElement("style"));

				styleElem.textContent = `.list-wrapper {width: ${listWidth}px}`;
				styleElem = styleElem.setAttribute("id", "inserted-tsp-styles");
			}

			var lists = [];

			document.getElementById("board")
			.childNodes.forEach( (listReference, i) => {
				lists[i] = listReference;
			});

			for ( let i = 1; i < lists.length; i++ ) {
				let resizeElem = createResizeElem();
				lists[i].parentElement.insertBefore(resizeElem, lists[i]);
			}

			console.log("TSP: feature 'resize' enabled");
			resolve();
		});
	},
	label(){ // CSS only feature
		console.info("TSP: feature 'label' injected");
		board.classList.add('TSP-label-enabled');
	},
	numberOfCards(){ // CSS only feature
		console.info("TSP: feature 'numberOfCards' injected");
		board.classList.add('TSP-numberOfCards-enabled');
	}
};


/*
* TODO: Add logic to respect settings.
*/
(async function(){
	// TODO: Use WebExtension messenging system to get settings from the background script
	var settings = {},
			board = document.getElementById("board");

	if ( (document.getElementById("TSP-init"))  ) // Already injected
		return;

	if ( !board ) // Trello board not yet ready
		return;

	var settings = getSettings();

	// IDEA: Maybe a loop that iterates the 'features' object would be even easier
	if (settings.copyId)
		gracefullyInject(features.id);

	if (settings.compactMode)
		gracefullyInject(features.compact);

	if (settings.labelText)
		gracefullyInject(features.label);

	if (settings.numberOfCards) {
		gracefullyInject(features.numberOfCards);
	}
	
	gracefullyInject(features.resize);

	body.setAttribute('id', 'TSP-init');
})();
