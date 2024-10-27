import { globalModeManager, globalScoreManager, globalSuccessManager } from '../../common/js/app.js';

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gridCanvas');
    const ctx = canvas.getContext('2d');
    const gridSize = 20; // Größe der Rasterzellen
    canvas.width = 400;
    canvas.height = 400;

    let points = [
        { x: 5, y: 5 },
        { x: 15, y: 5 },
        { x: 5, y: 15 },
        { x: 15, y: 15 }
    ];

    const shapes = ["Quadrat", "Rechteck", "Trapez", "Parallelogramm"];
    let currentShape = "";
    let isBeginnerMode = true;

    // Zufällige Auswahl der Anweisung
    function setRandomInstruction() {
        currentShape = shapes[Math.floor(Math.random() * shapes.length)];
        document.getElementById('instruction').textContent = `Verschiebe die Punkte, damit ein ${currentShape} entsteht.`;
        updateHintText(); // Hinweistext aktualisieren
    }

    function drawGrid() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#333';
        for (let x = 0; x < canvas.width; x += gridSize) {
            for (let y = 0; y < canvas.height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }
        }
    }

    function drawPoints() {
        points.forEach(point => {
            const x = point.x * gridSize;
            const y = point.y * gridSize;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fillStyle = 'red';
            ctx.fill();
        });
    }

    function drawLines() {
        ctx.strokeStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(points[0].x * gridSize, points[0].y * gridSize);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x * gridSize, points[i].y * gridSize);
        }
        ctx.closePath();
        ctx.stroke();
    }

    function isPointNear(x, y, point) {
        const dx = x - point.x * gridSize;
        const dy = y - point.y * gridSize;
        return Math.sqrt(dx * dx + dy * dy) < 10;
    }

    let draggedPoint = null;

    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        points.forEach(point => {
            if (isPointNear(mouseX, mouseY, point)) {
                draggedPoint = point;
            }
        });
    });

    canvas.addEventListener('mousemove', (e) => {
        if (draggedPoint) {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const gridX = Math.round(mouseX / gridSize);
            const gridY = Math.round(mouseY / gridSize);

            draggedPoint.x = gridX;
            draggedPoint.y = gridY;

            drawGrid();
            drawLines();
            drawPoints();
        }
    });

    canvas.addEventListener('mouseup', () => {
        draggedPoint = null;
    });


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
            let hintText = '';
            switch (currentShape) {
                case 'Quadrat':
                    hintText = '💡 Tipp: Ein Quadrat hat vier gleich lange Seiten und alle Winkel sind 90°.';
                    break;
                case 'Rechteck':
                    hintText = '💡 Tipp: Ein Rechteck hat gegenüberliegende Seiten gleich lang und alle Winkel sind 90°.';
                    break;
                case 'Trapez':
                    hintText = '💡 Tipp: Ein Trapez hat zwei Seiten, die parallel sind.';
                    break;
                case 'Parallelogramm':
                    hintText = '💡 Tipp: Ein Parallelogramm hat gegenüberliegende Seiten, die gleich lang und parallel sind.';
                    break;
            }
            hintsElement.textContent = hintText;
        } else {
            hintsElement.textContent = "Doppelte Punkte im Profi-Modus.";
        }
    }

    function init() {
        globalScoreManager.setPoints(); // Mit den Default-Werten
        globalSuccessManager.init(checkSuccessCallback, successCallback, noSuccessCallback, nextTaskCallback);
        globalSuccessManager.addNextTaskCallback(() => globalModeManager.newTask()); // an globalModeManager binden. Arrow functions werden an den Kontext gebunden!

        // globalScoreManager hat bisher keine .init()
        globalModeManager.init(setModeCallback);
        globalModeManager.setMode(globalModeManager.beginnerMode);

        setRandomInstruction();
        drawGrid();
        drawLines();
        drawPoints();
    }

    function randomizePoints() {
        points.forEach(point => {
            point.x = Math.floor(Math.random() * (canvas.width / gridSize));
            point.y = Math.floor(Math.random() * (canvas.height / gridSize));
        });
    }

    // Funktion zum Überprüfen des Ergebnisses
    function checkSuccessCallback() {
        // Überprüfen der aktuellen Form
        if (isConvex(points) && (isRectangleOrSquare() || isParallelogram() || isTrapezoid())) {
            return true;
        }
         return false;
    }

function successCallback() {
    globalScoreManager.addPoints();

}

function nextTaskCallback() {

        randomizePoints(); // Punkte zufällig verteilen
        setRandomInstruction();
        drawGrid();
        drawLines();
        drawPoints();

}

function noSuccessCallback() {
    globalScoreManager.deductPoints();
}


    // Hilfsfunktion zum Überprüfen, ob alle Winkel 90 Grad sind (für Quadrat und Rechteck)
    function isRectangleOrSquare() {
        const d1 = distance(points[0], points[1]);
        const d2 = distance(points[1], points[2]);
        const d3 = distance(points[2], points[3]);
        const d4 = distance(points[3], points[0]);
        const diag1 = distance(points[0], points[2]);
        const diag2 = distance(points[1], points[3]);

        // Quadrat: Alle Seiten gleich lang und Diagonalen gleich
        if (d1 === d2 && d2 === d3 && d3 === d4 && diag1 === diag2) {
            return currentShape === "Quadrat";
        }

        // Rechteck: Gegenüberliegende Seiten gleich und Diagonalen gleich
        if (d1 === d3 && d2 === d4 && diag1 === diag2) {
            return currentShape === "Rechteck";
        }

        return false;
    }

    function isConvex(arr) {
        const length = arr.length;
        let pre = 0;
        let curr = 0;

        for (let i = 0; i < length; ++i) {
            let dx1 = arr[(i + 1) % length][0] - arr[i][0];
            let dx2 = arr[(i + 2) % length][0] - arr[(i + 1) % length][0];
            let dy1 = arr[(i + 1) % length][1] - arr[i][1];
            let dy2 = arr[(i + 2) % length][1] - arr[(i + 1) % length][1];

            curr = dx1 * dy2 - dx2 * dy1;

            if (curr !== 0) {
                if ((curr > 0 && pre < 0) || (curr < 0 && pre > 0)) {
                    return false;
                } else {
                    pre = curr;
                }
            }
        }
        return true;
    }

    // Funktion zur Überprüfung der Parallelität von zwei Seiten anhand der Punkteindizes mit Toleranz
    function areSidesParallel(p1Index1, p2Index1, p1Index2, p2Index2, tolerance = 0.01) {
        // Delta-x und Delta-y für die erste Seite berechnen
        const deltaX1 = points[p2Index1].x - points[p1Index1].x;
        const deltaY1 = points[p2Index1].y - points[p1Index1].y;

        // Delta-x und Delta-y für die zweite Seite berechnen
        const deltaX2 = points[p2Index2].x - points[p1Index2].x;
        const deltaY2 = points[p2Index2].y - points[p1Index2].y;

        // Überprüfen, ob beide Linien vertikal sind
        if (deltaX1 === 0 && deltaX2 === 0) {
            return true; // Beide Linien sind vertikal
        }

        // Überprüfen, ob nur eine der Linien vertikal ist
        if (deltaX1 === 0 || deltaX2 === 0) {
            return false; // Eine Linie ist vertikal, die andere nicht
        }

        // Steigungen berechnen
        const slope1 = deltaY1 / deltaX1;
        const slope2 = deltaY2 / deltaX2;

        // Parallelität überprüfen mit Toleranz
        return Math.abs(slope1 - slope2) <= tolerance;
    }

    // Hilfsfunktion zum Berechnen der Distanz zwischen zwei Punkten
    function distance(p1, p2) {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    }

    // Hilfsfunktion zum Überprüfen, ob es ein Parallelogramm ist (Gegenüberliegende Seiten parallel)
    function isParallelogram() {
        // Überprüfen, ob gegenüberliegende Seiten parallel sind
        const parallel1 = areSidesParallel(0, 1, 2, 3); // Seite 0-1 parallel zu Seite 2-3
        const parallel2 = areSidesParallel(1, 2, 3, 0); // Seite 1-3 parallel zu Seite 0-2

        // Parallelogramm: Beide Paare gegenüberliegender Seiten müssen parallel sein
        return parallel1 && parallel2 && currentShape === "Parallelogramm" && !isRectangleOrSquare();
    }

    // Hilfsfunktion zum Überprüfen, ob es ein Trapez ist (Mindestens ein Paar gegenüberliegender Seiten parallel)
    function isTrapezoid() {
        const d1 = areSidesParallel(0, 1, 2, 3); // Obere und untere Seite parallel
        const d2 = areSidesParallel(1, 2, 3, 0); // Linke und rechte Seite parallel

        return (d1 && !d2 || !d1 && d2) && currentShape === "Trapez";
    }

    // Initialisierung der App
    init();
});