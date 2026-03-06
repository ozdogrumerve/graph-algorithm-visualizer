import { runDijkstra } from "../algorithms/dijkstra.js";

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

    document.getElementById("startBtn").onclick = () => {

        const algorithm = document.getElementById("algorithmSelect").value;

        let steps = [];

        if (algorithm === "dijkstra") {

            const startNode =
                graphEditor.startNode || graphManager.nodes[0].id;

            if (!graphManager.nodes.find(n => n.id === startNode)) {

                alert("Start node no longer exists. Please select another node.");
                return;

            }

            steps = runDijkstra(graphManager, startNode);
        }


        stepController.loadSteps(steps);

        stepController.play(); 

    };

    document.getElementById("nextStepBtn").onclick =
    () => stepController.nextStep();

    document.getElementById("prevStepBtn").onclick = () => {

        stepController.previousStep();

        document.getElementById("pauseBtn").innerText = "Play";

        };

        const pauseBtn = document.getElementById("pauseBtn");

        pauseBtn.onclick = () => {

            if (stepController.interval) {

                stepController.pause();
                pauseBtn.innerText = "Play";

            } else {

                stepController.play();
                pauseBtn.innerText = "Pause";

            }

        };

    document.getElementById("resetBtn").onclick =
        () => stepController.reset();
}