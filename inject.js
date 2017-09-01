"use strict";

/*
1. copy card id on click
2. compact mode
3. resizable lists
*/

(async function() {
	var listWidth,
		features = [];

	listWidth = ( await browser.storage.local.get() ).list.width || 270;

	if ( document.getElementById("tsp-init") ) // Already inizialized
		return;

	if ( !(document.getElementById("board")) ) // Document not yet ready
		return;

	/* COPY CARD ID */
	features.push(new Promise(function(resolve, reject) {
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
			}
		}, true);

		resolve();
	}));

	/* COMPACT MODE */
	features.push(new Promise(function(resolve, reject) {

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
			document.getElementsByTagName('body')[0].classList.toggle('compact-mode');
		});

		document.getElementById('permission-level').parentElement.appendChild(compactModeBtn);


		resolve();
	}));

	/* RESIZABLE LISTS */
	features.push(new Promise(function(resolve, reject) {

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

		resolve();
	}));

	Promise.all([...features])
	.then(
		function success() {
			console.info("TSP: Injected script successfully.");
			document.getElementsByClassName('compact-mode-button')[0].setAttribute("id", "tsp-init");
		},
		function failure(e) {console.error("TSP Error: Could not inject script: \n", e);});
})();
