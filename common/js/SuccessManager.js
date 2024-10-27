class SuccessManager {
    constructor(buttonId = 'check-result', resultMessageId = 'result-message') {
        this.buttonId = buttonId;
        this.resultMessageElement = null;
        this.checkButtonElement = null;

        // Broadcaster-System für Callbacks (Liste von Callbacks)
        this.checkSuccessCallbacks = [];
        this.successCallbacks = [];
        this.noSuccessCallbacks = [];
        this.nextTaskCallbacks = [];

        this.handleCheck = this.handleCheck.bind(this);
    }

    // Initialisierungsmethode
    init(checkSuccessCallback, successCallback, noSuccessCallback, nextTaskCallback) {
        // Füge die übergebenen Callbacks hinzu
        this.addCheckSuccessCallback(checkSuccessCallback);
        this.addSuccessCallback(successCallback);
        this.addNoSuccessCallback(noSuccessCallback);
        this.addNextTaskCallback(nextTaskCallback);

        // Suche das Resultat-Element und den Button und füge den Event-Listener hinzu
        this.resultMessageElement = document.getElementById(this.buttonId);
        this.checkButtonElement = document.getElementById(this.buttonId);

        if (this.checkButtonElement) {
            this.checkButtonElement.addEventListener('click', this.handleCheck);
        } else {
            console.error(`Button mit ID ${this.buttonId} nicht gefunden.`);
        }
    }

    handleCheck() {
        const originalText = this.checkButtonElement.textContent;
        const originalStyle = this.checkButtonElement.style.cssText; 

        if (this.checkButtonElement) {
            this.checkButtonElement.removeEventListener('click', this.handleCheck);
        } else {
            console.error(`Button mit ID ${this.buttonId} nicht gefunden.`);
        }

        if (this.runCheckSuccessCallbacks()) {
            this.displaySuccessMessage();
            this.runSuccessCallbacks();

            setTimeout(() => {
                this.runNextTaskCallbacks();  // Rufe die nächste Aufgabe auf
            }, 1500);
        } else {
            this.displayFailureMessage();
            this.runNoSuccessCallbacks();
        }

        // Setze den Button-Text nach 1,5 Sekunden zurück auf "Überprüfen"
        setTimeout(() => {
            this.checkButtonElement.textContent = originalText;
            this.checkButtonElement.style.cssText = originalStyle;

            if (this.checkButtonElement) {
                this.checkButtonElement.addEventListener('click', this.handleCheck);
            } else {
                console.error(`Button mit ID ${this.buttonId} nicht gefunden.`);
            }

        }, 1500);
    }

    // Callback hinzufügen: checkSuccess
    addCheckSuccessCallback(callback) {
        if (typeof callback === 'function') {
            this.checkSuccessCallbacks.push(callback);
        } else {
            console.error('Callback ist keine Funktion');
        }
    }

    // Callback hinzufügen: success
    addSuccessCallback(callback) {
        if (typeof callback === 'function') {
            this.successCallbacks.push(callback);
        } else {
            console.error('Callback ist keine Funktion');
        }
    }

    // Callback hinzufügen: noSuccess
    addNoSuccessCallback(callback) {
        if (typeof callback === 'function') {
            this.noSuccessCallbacks.push(callback);
        } else {
            console.error('Callback ist keine Funktion');
        }
    }

    // Callback hinzufügen: nextTask
    addNextTaskCallback(callback) {
        if (typeof callback === 'function') {
            this.nextTaskCallbacks.push(callback);
        } else {
            console.error('Callback ist keine Funktion');
        }
    }

    // Callback-Liste ausführen: checkSuccess
    runCheckSuccessCallbacks() {
        return this.checkSuccessCallbacks.some(callback => callback());
    }

    // Callback-Liste ausführen: success
    runSuccessCallbacks() {
        this.successCallbacks.forEach(callback => callback());
    }

    // Callback-Liste ausführen: noSuccess
    runNoSuccessCallbacks() {
        this.noSuccessCallbacks.forEach(callback => callback());
    }

    // Callback-Liste ausführen: nextTask
    runNextTaskCallbacks() {
        this.nextTaskCallbacks.forEach(callback => callback());
    }

    displaySuccessMessage() {
        if (this.resultMessageElement) {
            this.resultMessageElement.textContent = "Richtig! Du hast die Aufgabe korrekt gelöst!";
            this.resultMessageElement.style.color = '#4caf50';  // Grün für Erfolg
        }
    }

    displayFailureMessage() {
        if (this.resultMessageElement) {
            this.resultMessageElement.textContent = "Falsch! Versuche es noch einmal.";
            this.resultMessageElement.style.color = '#ff0000';  // Rot für Fehler
            this.resultMessageElement.style.borderColor = '#ff0000';  // Rot für Fehler
        }
    }
}

export default SuccessManager;