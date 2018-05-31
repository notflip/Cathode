import insertTextAtCursor from 'insert-text-at-cursor';
import coins from './coins';

let listening = false;
let isLoading = false;
let string = '';

document.addEventListener("keydown", function onEvent(event) {

    // Prevent the user from typing while loading, enter press is allowed
    if (isLoading)
        event.preventDefault();

    // If the key is any of the backspace modifiers
    if (event.key === "Space"
        || event.key === "Enter"
        || (event.altKey && event.key === "Backspace")
        || (event.metaKey && event.key === "Backspace")
    ) {
        string = '';
    }

    // Start listening and initialise empty string
    if (event.shiftKey && event.key === '#') {
        listening = true;
        string = '';
    }

    if (listening) {

        if (event.key === "Backspace") {
            string = string.slice(0, -1);
        }

        // Add the alphanumerical key to the string
        if ((!event.shiftKey && event.key !== '#')
            && event.key !== "Shift"
            && event.key !== "Meta"
            && event.key !== "Backspace"
            && event.key !== "Enter") {
            string += event.key;
        }

        // If it's in the list of coins
        if (event.key !== "Enter" && coins.includes(string.toUpperCase())) {

            isLoading = true;

            let coin = string.toUpperCase();
            const url = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=' + coin + '&tsyms=USD';

            // Give the browser the time to add the last typed letter
            setTimeout(() => {

                // Get the current value before the fetch.
                const beforeValue = document.querySelectorAll('[data-text]')[0].innerHTML;

                fetch(url)
                    .then((response) => response.json())
                    .then((data) => {

                        const currentValue = document.querySelectorAll('[data-text]')[0].innerHTML;

                        // Compare the values and don't paste if there's a difference (eg user submitted);
                        if (beforeValue === currentValue.trim()) {
                            insertText(' 💬' + data[coin]['USD'] + '$');
                        }

                        string = '';
                        isLoading = false;
                        listening = false;
                        return true;
                    });
            }, 10);
        }
    }
});

function insertText(resp) {
    const el = document.activeElement;
    insertTextAtCursor(el, ' ' + resp);
}