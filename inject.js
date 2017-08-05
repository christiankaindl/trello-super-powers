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
