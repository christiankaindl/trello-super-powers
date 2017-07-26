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
