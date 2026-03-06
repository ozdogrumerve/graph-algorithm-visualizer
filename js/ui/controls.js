/*
========================================
UI CONTROLS
========================================

Buton eventlerini yönetir.
*/

export function initializeControls(
    graphManager,
    graphRenderer,
    graphEditor
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

        speedValue.innerText = speedSlider.value + "x";
    });


    /* ========================================
       PLACEHOLDER CONTROLS
       (algoritmalar sonraki aşamada)
    ======================================== */

    document.getElementById("startBtn").onclick =
        () => console.log("Start algorithm");

    document.getElementById("nextStepBtn").onclick =
        () => console.log("Next step");

    document.getElementById("prevStepBtn").onclick =
        () => console.log("Back step");

    document.getElementById("pauseBtn").onclick =
        () => console.log("Pause");

    document.getElementById("resetBtn").onclick =
        () => console.log("Reset");
}