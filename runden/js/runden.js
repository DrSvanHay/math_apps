import { globalModeManager, globalScoreManager, globalSuccessManager } from '../../common/js/app.js';

document.addEventListener('DOMContentLoaded', () => {

    // Globale Variablen, um die generierte Zahl, das gerundete Ergebnis und den Score zu speichern
    let generatedNumber = '';
    let roundedResult = '';
    let score = 0;
    let isBeginnerMode = true; // Variable, um den Modus zu verfolgen
    let roundFactor = 0; // Variable, um die aktuelle Rundungsstufe zu speichern

    // Elemente aus dem HTML holen
    const digitColumns = document.querySelectorAll('.digit-column');
    const taskElement = document.querySelector('.task p');


    function setModeCallback(inMode) {
        if(inMode === globalModeManager.beginnerMode) {
            isBeginnerMode = true;
            globalScoreManager.setMode(true);

        } else if (inMode === globalModeManager.proMode) {
            isBeginnerMode = false;
            globalScoreManager.setMode(false);
        }
        updateHintText();
    }

    // Funktion zum Aktualisieren des Hinweistexts
    function updateHintText() {
        const hintsElement = document.getElementById('hints');
        if (isBeginnerMode) {
            const roundType = Math.log10(roundFactor); // Findet die Rundungsstufe (1 für 10er, 2 für 100er, usw.)
            const roundText = ["10er", "100er", "1000er", "10.000er"];
            hintsElement.textContent = `💡 Tipp: Tippe zuerst auf den ${roundText[roundType - 1]}, um extra Punkte zu erhalten!`;
        } else {
            hintsElement.textContent = "Doppelte Punkte im Profi-Modus.";
        }
    }

    function generateRandomNumber() {
        let numberArray = [];

        // Erzeugen der Ziffern für die 7 Stellen (einschließlich Reserve-Ziffer)
        for (let i = 0; i < 7; i++) {
            if (i === 0) {
                // Reserve-Ziffer kann 0 sein
                numberArray.push(0);
            } else {
                // Restliche Elemente, keine Nullen erlaubt
                let randomDigit;
                do {
                    randomDigit = Math.floor(Math.random() * 10);
                } while (randomDigit === 0);
                numberArray.push(randomDigit);
            }
        }

        // Setze die generierte Zahl in die globale Variable als String
        generatedNumber = numberArray.join('');

        // Setzen der generierten Zahlen in die Digit-Spalten und anpassen der Anzeige
        digitColumns.forEach((digitColumn, index) => {
            const digitElement = digitColumn.querySelector('.digit');

            // Setze die Zahl in die Spalte; nur die Reserve-Ziffer wird als Leerzeichen angezeigt, wenn sie 0 ist
            if (index === 0 && numberArray[index] === 0) {
                digitElement.textContent = ' ';
            } else {
                digitElement.textContent = numberArray[index];
            }
        });
    }

    // Funktion, um eine Ziffer zu erhöhen
    function increaseDigit(index) {
        console.log(`increaseDigit aufgerufen für Index: ${index}`);
        const digitElement = digitColumns[index].querySelector('.digit');
        if (!digitElement) {
            console.error(`digitElement an Index ${index} nicht gefunden`);
            return;
        }

        let currentDigit = digitElement.textContent.trim() === '' ? 0 : parseInt(digitElement.textContent, 10);
        console.log(`Aktuelle Ziffer vor Erhöhung: ${currentDigit}`);

        if (currentDigit === 9) {
            // Setze die aktuelle Ziffer auf '0'
            digitElement.textContent = '0';

            // Wenn es nicht die erste Spalte ist, erhöhe die vorherige Ziffer
            if (index > 0) {
                increaseDigit(index - 1);
            }
        } else {
            // Erhöhe die aktuelle Ziffer um 1
            digitElement.textContent = currentDigit + 1;
        }

        updateGeneratedNumber();
    }

    // Funktion, um eine Ziffer zu erniedrigen
    function decreaseDigit(index) {
        console.log(`decreaseDigit aufgerufen für Index: ${index}`);
        const digitElement = digitColumns[index].querySelector('.digit');
        if (!digitElement) {
            console.error(`digitElement an Index ${index} nicht gefunden`);
            return;
        }

        let currentDigit = digitElement.textContent.trim() === '' ? 0 : parseInt(digitElement.textContent, 10);
        console.log(`Aktuelle Ziffer vor Erniedrigung: ${currentDigit}`);

        if (currentDigit > 0) {
            digitElement.textContent = currentDigit - 1;
        }

        updateGeneratedNumber();
    }

    // Funktion, um die globale Variable generatedNumber zu aktualisieren
    function updateGeneratedNumber() {
        let newNumber = '';
        digitColumns.forEach(digitColumn => {
            const digitElement = digitColumn.querySelector('.digit');
            newNumber += digitElement.textContent.trim() === '' ? '0' : digitElement.textContent;
        });
        generatedNumber = newNumber;
        console.log("Aktuelle Zahl:", generatedNumber);
    }

    // Funktion zum Hervorheben der Ziffern
    function highlightDigits(index) {
        // Berechne die richtige Rundungsposition basierend auf dem Rundungsfaktor
        const roundingIndex = 7 - Math.log10(roundFactor) - 1; // Berechne den Index für die zu rundende Ziffer

        // Überprüfe, ob die ausgewählte Ziffer an der richtigen Position ist
        if (index === roundingIndex) {
            // Entferne bisherige Hervorhebungen
            resetHighlighting();

            // Füge den grünen Rahmen zur ausgewählten Ziffer hinzu
            const selectedDigit = digitColumns[index].querySelector('.digit');
            selectedDigit.classList.add('selected-digit');

            // Füge den weißen Strich zur entscheidenden Ziffer hinzu (rechts von der ausgewählten)
            if (index + 1 < digitColumns.length) {
                const decidingDigit = digitColumns[index + 1].querySelector('.digit');
                decidingDigit.classList.add('deciding-digit');
            }

            // Vergib 5 Punkte für die korrekte Markierung im Anfänger-Modus
            if (isBeginnerMode) {
                console.log("Korrekte Markierung gesetzt! 5 Punkte hinzugefügt.");
                globalScoreManager.addPoints(5);
            }
        }
    }

    // Funktion zum Entfernen der Hervorhebungen
    function resetHighlighting() {
        digitColumns.forEach(digitColumn => {
            const digitElement = digitColumn.querySelector('.digit');
            digitElement.classList.remove('selected-digit', 'deciding-digit');
        });
    }

    // Zufällige Rundungsaufgabe generieren und das gerundete Ergebnis berechnen
    function generateRandomTask() {
        const tasks = [
            { text: "Runde die Zahl zu vollen 10ern", factor: 10 },
            { text: "Runde die Zahl zu vollen 100ern", factor: 100 },
            { text: "Runde die Zahl zu vollen 1000ern", factor: 1000 },
            { text: "Runde die Zahl zu vollen 10.000ern", factor: 10000 }
        ];

        // Zufällige Aufgabe auswählen
        const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
        taskElement.textContent = randomTask.text;
        roundFactor = randomTask.factor; // Speichere den Rundungsfaktor

        // Gerundetes Ergebnis berechnen
        roundedResult = Math.round(Number(generatedNumber) / randomTask.factor) * randomTask.factor;
    }

    // Funktion, um das Ergebnis zu überprüfen
    function checkSuccessCallback() {
        if (Number(generatedNumber) === roundedResult) {
            return true;
        } else {
            return false;
        }
    }

    function successCallback() {
        globalScoreManager.addPoints();

    }

    function noSuccessCallback() {
        globalScoreManager.deductPoints();
    }

    function nextTaskCallback() {

        // Neue Zahl und Aufgabe generieren
        generateRandomNumber();
        generateRandomTask();
        updateHintText();
        resetHighlighting();
    }

    function init() {
        // Setze die Event Listener einmalig während der Initialisierung
        digitColumns.forEach((digitColumn, index) => {
            const arrowUp = digitColumn.querySelector('.arrow.up');
            const arrowDown = digitColumn.querySelector('.arrow.down');
            const digitElement = digitColumn.querySelector('.digit');

            // Event Listener für den Auf-Pfeil
            arrowUp.addEventListener('click', () => {
                console.log(`Pfeil nach oben geklickt in Spalte ${index}`);
                increaseDigit(index);
            });

            // Event Listener für den Ab-Pfeil
            arrowDown.addEventListener('click', () => {
                console.log(`Pfeil nach unten geklickt in Spalte ${index}`);
                decreaseDigit(index);
            });

            // Klick-Event, um die Ziffer hervorzuheben (nur im Anfänger-Modus)
            digitElement.addEventListener('click', () => {
                if (isBeginnerMode) {
                    highlightDigits(index);
                }
            });
        });

        generateRandomNumber();
        generateRandomTask();

        updateHintText(); // Setze den Hinweistext

        globalSuccessManager.init(checkSuccessCallback, successCallback, noSuccessCallback, nextTaskCallback);
        globalSuccessManager.addNextTaskCallback(() => globalModeManager.newTask());
        // globalScoreManager hat bisher keine .init()
        globalModeManager.init(setModeCallback);
        globalModeManager.setMode(globalModeManager.beginnerMode);

    }
    // Anwendung initialisieren
    init();
});