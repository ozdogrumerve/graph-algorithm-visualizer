/*
========================================
LOG PANEL
========================================

Algoritma adımlarını ekrana yazar.
*/

export class LogPanel {

    constructor(elementId) {

        this.container = document.getElementById(elementId);
    }

    add(message) {

        const li = document.createElement("li");

        li.textContent = message;

        this.container.appendChild(li);

        this.container.scrollTop = this.container.scrollHeight;
    }

    clear() {

        this.container.innerHTML = "";
    }
}