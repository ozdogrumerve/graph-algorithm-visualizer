/*
========================================
UI CONTROLS
========================================

Buton eventlerini yönetir.
*/

export function initializeControls(
    graphManager,
    graphRenderer,
    graphEditor,
    stepController
) {

    /* ========================================
       GRAPH CONTROLS
    ======================================== */

    const addNodeBtn = document.getElementById("addNodeBtn");
    const addEdgeBtn = document.getElementById("addEdgeBtn");
    const clearGraphBtn = document.getElementById("clearGraphBtn");

    addNodeBtn.addEventListener("click", () => {

        graphEditor.addNode();
    });

    addEdgeBtn.addEventListener("click", () => {

        graphEditor.enableEdgeMode();
    });

    clearGraphBtn.addEventListener("click", () => {

        if (confirm("Clear entire graph?")) {

            graphEditor.clearGraph();
        }
    });


    /* ========================================
       SPEED CONTROL
    ======================================== */

    const speedSlider = document.getElementById("speedSlider");
    const speedValue = document.getElementById("speedValue");

    speedSlider.addEventListener("input", () => {

        const speed = speedSlider.value;

        speedValue.innerText = speed + "x";

        stepController.setSpeed(speed);
    });


    /* ========================================
       PLACEHOLDER CONTROLS
       (algoritmalar sonraki aşamada)
    ======================================== */

    document.getElementById("startBtn").onclick =
        () => console.log("Start algorithm");

    document.getElementById("nextStepBtn").onclick =
    () => stepController.nextStep();

    document.getElementById("prevStepBtn").onclick =
        () => stepController.previousStep();

    document.getElementById("pauseBtn").onclick =
        () => stepController.pause();

    document.getElementById("resetBtn").onclick =
        () => stepController.reset();
}