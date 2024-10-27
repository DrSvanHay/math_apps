import { globalModeManager, globalScoreManager, globalSuccessManager } from '../../common/js/app.js';

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gridCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 400;
    canvas.height = 400;

    // Cube Dimensions and Colors
    const cubeSize = 50;
    const frontColor = '#D3D3D3';  // Light grey
    const rightColor = '#A9A9A9';  // Medium grey
    const topColor = '#696969';    // Dark grey

    let isBeginnerMode = true;  // Default to Beginner mode

  
    let numberOfCubes = 0;

    const beginnerDelay = 500;  // 500 ms delay for beginner mode
    const proDelay = 0;         // 0 ms delay for pro mode

    const beginnerStoneRange = { min: 5, max: 10 };
    const proStoneRange = { min: 9, max: 18 };

    const depthFactor = 0.3;

    let delay = beginnerDelay;
    let stoneRange = beginnerStoneRange;
    // Function to reset the canvas
    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Function to get random stone count based on mode
    function getRandomStoneCount() {
        return Math.floor(Math.random() * (stoneRange.max - stoneRange.min + 1)) + stoneRange.min;
    }

    // Function to draw an individual cube
    function drawCube(x, y) {
        // Draw the front face
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + cubeSize, y);
        ctx.lineTo(x + cubeSize, y + cubeSize);
        ctx.lineTo(x, y + cubeSize);
        ctx.closePath();
        ctx.fillStyle = frontColor;
        ctx.fill();
        ctx.stroke();

        // Draw the right face
        ctx.beginPath();
        ctx.moveTo(x + cubeSize, y);
        ctx.lineTo(x + cubeSize * (1 + depthFactor), y - cubeSize * depthFactor);
        ctx.lineTo(x + cubeSize * (1 + depthFactor), y + cubeSize * (1 - depthFactor));
        ctx.lineTo(x + cubeSize, y + cubeSize);
        ctx.closePath();
        ctx.fillStyle = rightColor;
        ctx.fill();
        ctx.stroke();

        // Draw the top face
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + cubeSize, y);
        ctx.lineTo(x + cubeSize * (1 + depthFactor), y - cubeSize * depthFactor);
        ctx.lineTo(x + cubeSize * depthFactor, y - cubeSize * depthFactor);
        ctx.closePath();
        ctx.fillStyle = topColor;
        ctx.fill();
        ctx.stroke();
    }

    // Function to draw a tower of cubes
    async function drawTower(x, z, h, delayMs = 0) {
        let baseX = 150 + x * cubeSize - z * cubeSize * depthFactor;
        let baseY = 250 + z * cubeSize * depthFactor;

        for (let layer = 0; layer < h; layer++) {
            let cubeX = baseX;
            let cubeY = baseY - layer * cubeSize;
            drawCube(cubeX, cubeY);
            await sleep(delayMs);
        }
    }

    // Sleep function
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function drawRandomTowers(maxTowers, totalCubes, delayMs) {
        const gridSize = 4;  // We'll work with a 4x4 grid for 16 towers
        let towers = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));  // Initialize all towers with height 0
        let currentCubes = 0;  // Counter for the current number of cubes placed
        numberOfCubes = totalCubes;
        // Keep randomizing tower heights until we reach the exact number of cubes
        while (currentCubes < totalCubes) {
            for (let z = 0; z < gridSize; z++) {
                for (let x = 0; x < gridSize; x++) {
                    // Determine the maximum allowable height for this tower based on neighbors
                    let maxHeight = 4;  // Max height is 4
    
                    // Limit the height based on the tower behind (if it exists)
                    if (z > 0) {
                        maxHeight = Math.min(maxHeight, towers[z - 1][x]);
                    }
    
                    // Limit the height based on the tower to the left (if it exists)
                    if (x > 0) {
                        maxHeight = Math.min(maxHeight, towers[z][x - 1]);
                    }
    
                    // If we've already placed enough cubes, exit the loop
                    if (currentCubes >= totalCubes) {
                        break;
                    }
    
                    // Generate a random height for the tower (between 0 and maxHeight)
                    let newHeight = Math.floor(Math.random() * (maxHeight + 1));  // Random height between 0 and maxHeight
                    
                    // Calculate the difference in stones (cubes) between the new and old height
                    let addedCubes = newHeight - towers[z][x];
    
                    // Check if adding these cubes would exceed the total allowed
                    if (currentCubes + addedCubes > totalCubes) {
                        // Adjust the height to match the exact number of cubes needed
                        newHeight = towers[z][x] + (totalCubes - currentCubes);
                        addedCubes = totalCubes - currentCubes;  // Adjust the added cubes
                    }
    
                    // Assign the new height to the tower
                    towers[z][x] = newHeight;
    
                    // Update the current number of cubes
                    currentCubes += addedCubes;
    
                    // Break the loop if we've reached the total cubes limit
                    if (currentCubes >= totalCubes) {
                        break;
                    }
                }
                if (currentCubes >= totalCubes) {
                    break;
                }
            }
        }
    
        // Draw each tower in the grid based on the calculated heights
        for (let z = 0; z < gridSize; z++) {
            for (let x = 0; x < gridSize; x++) {
                if (towers[z][x] > 0) {
                    await drawTower(x, z, towers[z][x], delayMs);  // Draw tower at x, z with the calculated height    
                }
            }
        }
    }

    function checkSuccessCallback() {
        const isCorrect = numberOfCubes === parseInt(document.getElementById('stoneCount').value);
        return isCorrect;
    }
    
    function successCallback() {
        globalScoreManager.addPoints();
    }

    function noSuccessCallback() {
        globalScoreManager.deductPoints();
    }

    function nextTaskCallback() {
        let delayMs = isBeginnerMode ? beginnerDelay : proDelay;

        // Reset canvas and draw new towers
        numberOfCubes = getRandomStoneCount();
        clearCanvas();
        drawRandomTowers(1, numberOfCubes, delayMs);
    }

    function setModeCallback(inMode) {
        if(inMode === globalModeManager.beginnerMode) {
            isBeginnerMode = true;
            globalScoreManager.setMode(true);
            let delay = beginnerDelay;
            let stoneRange = beginnerStoneRange;
            //clearCanvas();
            //drawRandomTowers(1, getRandomStoneCount(), delay);

        } else if (inMode === globalModeManager.proMode) {
            isBeginnerMode = false;
            globalScoreManager.setMode(false);
            let delay = proDelay;
            let stoneRange = proStoneRange;
            //clearCanvas();
            //drawRandomTowers(1, getRandomStoneCount(), delay);
        }
    }

  
    // Initialize the scene
    function init() {
        globalScoreManager.setPoints();  // Mit default Werten
        numberOfCubes = getRandomStoneCount();

        globalSuccessManager.init(checkSuccessCallback, successCallback, noSuccessCallback, nextTaskCallback);
        globalSuccessManager.addNextTaskCallback(() => globalModeManager.newTask());
        // globalScoreManager hat bisher keine .init()
        globalModeManager.init(setModeCallback);
        globalModeManager.setMode(globalModeManager.beginnerMode);

        nextTaskCallback();
    }

    init();
});