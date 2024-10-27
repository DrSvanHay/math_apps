class ScoreManager {
    constructor() {
        this.score = 0;
        this.beginnerCorrect = 0;
        this.beginnerIncorrect = 0;
        this.proCorrect = 0;
        this.proIncorrect = 0;

        // Variablen, um die Punkte und den Modus zu speichern
        this.pointsForSuccess = 0;
        this.pointsForFailure = 0;
        this.pointsForSuccessBeginner = 0;
        this.pointsForFailureBeginner = 0;
        this.pointsForSuccessPro = 0;
        this.pointsForFailurePro = 0;
        this.isBeginnerMode = true;
    }

    // Setter für den Modus (Anfänger oder Profi)
    setMode(isBeginnerMode) {
        this.isBeginnerMode = isBeginnerMode;
        if(isBeginnerMode) {
            this.pointsForSuccess = this.pointsForSuccessBeginner;
            this.pointsForFailure = this.pointsForFailureBeginner;
        }
        else {
            this.pointsForSuccess = this.pointsForSuccessPro;
            this.pointsForFailure = this.pointsForFailurePro;
        }
    }

    // Getter für den aktuellen Modus
    getMode() {
        return this.isBeginnerMode;
    }

    // Setter für die Punkte bei Erfolg (richtig) und Misserfolg (falsch)
    setPoints(pointsForSuccessBeginner = 10, pointsForFailureBeginner = 7, pointsForSuccessPro = 20, pointsForFailurePro = 17) {
        this.pointsForSuccessBeginner = pointsForSuccessBeginner;
        this.pointsForFailureBeginner = pointsForFailureBeginner;
        this.pointsForSuccessPro = pointsForSuccessPro;
        this.pointsForFailurePro = pointsForFailurePro;
        // und in den aktuellen Stand übernehmen!
        this.setMode(this.isBeginnerMode);
    }

    // Getter für die Punkte
    getPoints() {
        return {
            success: this.pointsForSuccess,
            failure: this.pointsForFailure,
        };
    }

    // Punkte für richtige Antwort hinzufügen
    addPoints(punkte=0) {
        if(punkte===0) {
            this.score += this.pointsForSuccess; 
        } else {
            this.score += punkte; 
        }
        
        if (this.isBeginnerMode) {
            this.beginnerCorrect++;
        } else {
            this.proCorrect++;
        }
        this.updateScoreDisplay();
    }

    // Punkte für falsche Antwort abziehen
    deductPoints() {
        this.score -= this.pointsForFailure;
        if (this.score < 0) this.score = 0; // Verhindere negative Punkte
        if (this.isBeginnerMode) {
            this.beginnerIncorrect++;
        } else {
            this.proIncorrect++;
        }
        this.updateScoreDisplay();
    }

    // Aktualisiert die Score-Anzeige im HTML
    updateScoreDisplay() {
        const scoreDisplay = document.getElementById('score-display');
        scoreDisplay.textContent = `Score: ${this.score} (Anfänger: Richtig ${this.beginnerCorrect} / Falsch ${this.beginnerIncorrect}, Profi: Richtig ${this.proCorrect} / Falsch ${this.proIncorrect})`;
    }
}

export default ScoreManager;