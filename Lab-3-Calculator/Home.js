const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');

buttons.forEach(button => {
    button.addEventListener('click', (event) => {
        const clickedValue = event.target.innerText;

        if (clickedValue === 'Clear') {
            display.value = '';
        } else if (clickedValue === '=') {
            calculate();
        } else {
            display.value += clickedValue;
        }
    });
});

document.addEventListener('keydown', (event) => {
    const key = event.key;

    // List of keys we want the calculator to accept
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '*', '/', '.'];

    if (allowedKeys.includes(key)) {
        display.value += key;
    } else if (key === 'Enter') {
        calculate();
    } else if (key === 'Backspace') {
        display.value = display.value.slice(0, -1);
    } else if (key === 'Escape') {
        display.value = '';
    }
});

function calculate() {
    try {
        // Don't calculate if the screen is empty
        if (display.value !== '') {
            display.value = eval(display.value);
        }
    } catch (error) {
        display.value = 'Error';
    }
}