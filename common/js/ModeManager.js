class ModeManager {
    constructor() {
        this.beginnerMode = 1;  // Konstante für Anfänger-Modus
        this.proMode = 2;       // Konstante für Profi-Modus
        this.currentMode = null;  // Standardmäßig im Anfänger-Modus
        this.pendingMode = null;  // Pending Mode wird initialisiert
        this.callbacks = [];  // Liste der registrierten Callbacks

        // Speichere die Buttons in der Instanz
        this.beginnerModeButton = document.getElementById('beginner-mode');
        this.proModeButton = document.getElementById('pro-mode');
    }

    // Initialisierungsmethode
    init(callback) {
        if (!this.beginnerModeButton || !this.proModeButton) {
            console.error('Buttons nicht gefunden');
            return;
        }

        // Standard Callback hinzufügen
        this.registerCallback(callback);

        // Event-Listener für den Anfänger-Modus-Button
        this.beginnerModeButton.addEventListener('click', () => {
            this.setPendingMode(this.beginnerMode);
            this.startPending(this.beginnerModeButton);  // Startet die pending Animation
        });

        // Event-Listener für den Profi-Modus-Button
        this.proModeButton.addEventListener('click', () => {
            this.setPendingMode(this.proMode);
            this.startPending(this.proModeButton);  // Startet die pending Animation
        });
    }

    // Startet die pending Animation (voll-grün zu keine Hintergrundfarbe)
    startPending(button) {
        // Entferne pending von beiden Buttons
        this.beginnerModeButton.classList.remove('pending');
        this.proModeButton.classList.remove('pending');

        // Füge pending zum ausgewählten Button hinzu
        button.classList.add('pending');
    }

    // Beendet die pending Animation und hebt den Button richtig hervor
    highlightModeButton(button) {
        // Entferne das pending
        this.beginnerModeButton.classList.remove('pending');
        this.proModeButton.classList.remove('pending');

        // Entferne das Highlighting von beiden Buttons
        this.beginnerModeButton.classList.remove('active');
        this.proModeButton.classList.remove('active');

        // Füge das Highlighting zum ausgewählten Button hinzu
        button.classList.add('active');
    }

    // Setzt den pendingMode, aber der eigentliche Moduswechsel erfolgt später
    setPendingMode(mode) {
        if (mode !== this.pendingMode) {
            this.pendingMode = mode;  // Setze den neuen pending Mode
        }
    }

    // Setzt den Modus sofort
    setMode(mode) {
        if (mode !== this.currentMode) {
            this.currentMode = mode;
            this.pendingMode = mode;
            this.broadcastModeChange();
            this.highlightModeButton(
                mode === this.beginnerMode ? this.beginnerModeButton : this.proModeButton
            );
        }
    }

    // Bestätigt den Moduswechsel und ruft alle Callbacks auf
    newTask() {
        if (this.pendingMode !== this.currentMode) {
            this.setMode(this.pendingMode);  // Setzt den Modus auf den pending Mode
        }
    }

       // Methode zum Registrieren von Callbacks
       registerCallback(callback) {
        if (typeof callback === 'function') {
            this.callbacks.push(callback);
        } else {
            console.error('Callback ist keine Funktion');
        }
    }

    // Methode zum Aufrufen aller registrierten Callbacks
    broadcastModeChange() {
        for (const callback of this.callbacks) {
            callback(this.currentMode);  // Übergebe den aktuellen Modus an alle Callbacks
        }
    }
}

export default ModeManager;