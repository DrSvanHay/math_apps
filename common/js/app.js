import ScoreManager from './ScoreManager.js';
import SuccessManager from './SuccessManager.js';
import ModeManager from './ModeManager.js';
// Weitere globale Klassen importieren

// Globale Instanzen anlegen
const globalScoreManager = new ScoreManager();
const globalSuccessManager = new SuccessManager();
const globalModeManager = new ModeManager();

// Exportiere Instanzen, damit sie in den App-spezifischen Dateien verwendet werden können
export { globalScoreManager, globalSuccessManager, globalModeManager };