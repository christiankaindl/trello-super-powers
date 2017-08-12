"use strict";

var input = document.createElement('input');

// Add dummy element so we can use the clipboard function
document.getElementsByTagName('body')[0].appendChild(input);

document.addEventListener('click', function(e) {
        if(e.target.classList.contains('card-short-id')) {
                e.stopImmediatePropagation();
                e.preventDefault();

                input.value = e.target.textContent;
                input.select();

                document.execCommand('copy');
                console.log("Copied!");
        }
}, true);

var compactModeBtn = document.createElement('a');

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

var listWidth = 270;
var styleElem = document.getElementsByTagName("head")[0].appendChild(document.createElement("style"));
styleElem.setAttribute("id", "inserted-tsp-styles");
styleElem.textContent = `.list-wrapper {width: ${listWidth}px}`;
var resizeElem = document.createElement('div');

resizeElem.setAttribute("class", "resize-element list-wrapper");
resizeElem.addEventListener("mousedown", function (e) {
	document.addEventListener("mousemove", attach);
	document.addEventListener("mouseup", remove);

	function attach(e) {
		document.getElementById("inserted-tsp-styles").textContent=`.list-wrapper {width: ${listWidth=listWidth+(e.movementX / 4)}px}`;
		console.info(e.movementX);
	}
	function remove(e) {
		console.log("invoked!");
		//TODO: Save width to browser and apply it when page is reloaded


		document.removeEventListener("mousemove", attach);
		document.removeEventListener("mouseup", remove);
	}
});
document.getElementById("board").appendChild(resizeElem);
