import { runDijkstra } from "../algorithms/dijkstra.js";
import { bellmanFord } from "../algorithms/bellmanFord.js";
import { exportGraphImage } from "../io/exportGraph.js";
import { importGraph } from "../io/importGraph.js";
import { exportGraph } from "../io/exportGraph.js";

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

    /*
    ====================================
    DELETE NODE BUTTON
    ====================================
    */

    document.getElementById("deleteNodeBtn").onclick = () => {

        const selectedNodes =
            graphRenderer.network.getSelectedNodes();

        if (selectedNodes.length === 0) {

            alert("Select a node to delete.");
            return;

        }

        graphEditor.deleteNode(selectedNodes[0]);

    };


    /*
    ====================================
    DELETE EDGE BUTTON
    ====================================
    */

    document.getElementById("deleteEdgeBtn").onclick = () => {

        const selectedEdges =
            graphRenderer.network.getSelectedEdges();

        if (selectedEdges.length === 0) {

            alert("Select an edge to delete.");
            return;

        }

        graphEditor.deleteEdge(selectedEdges[0]);

    };


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
    ======================================== */

    document.getElementById("startBtn").onclick = () => {

        const algorithm = document.getElementById("algorithmSelect").value;

        let steps = [];

        if (algorithm === "dijkstra") {

            const startNode =
                graphEditor.startNode || graphManager.nodes[0].id;

            const targetNode = 
                graphEditor.targetNode;

            if (!graphManager.nodes.find(n => n.id === startNode)) {

                alert("Start node no longer exists. Please select another node.");
                return;

            }

            // SADECE varsa kontrol et
            if (targetNode !== null && !graphManager.nodes.find(n => n.id === targetNode)) {
                alert("Target node no longer exists. Please select another node.");
                return;
            }

            steps = runDijkstra(graphManager, startNode, targetNode);
        }

        if (algorithm === "bellmanFord") {

            const startNode =
                graphEditor.startNode || graphManager.nodes[0].id;

            const targetNode = 
                graphEditor.targetNode;

            if (!graphManager.nodes.find(n => n.id === startNode)) {
                alert("Start node no longer exists. Please select another node.");
                return;
            }

           // SADECE varsa kontrol et
            if (targetNode !== null && !graphManager.nodes.find(n => n.id === targetNode)) {
                alert("Target node no longer exists. Please select another node.");
                return;
            }

            const result = bellmanFord(graphManager, startNode, targetNode);

            if (result.hasNegativeCycle) {
                alert("Graph contains a negative weight cycle!");
            }

            steps = result.steps;
            console.log("BF steps:", steps);
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

    /*
    ====================================
    IMPORT GRAPH BUTTON
    ====================================
    */

    document.getElementById("importGraphBtn").onclick = () => {

        document.getElementById("importFileInput").click();

    };

    /*
    ====================================
    EXPORT GRAPH AS JSON
    ====================================
    */

    document.getElementById("exportGraphBtn").onclick = () => {

        exportGraph(graphManager);

    };


    /*
    ====================================
    EXPORT GRAPH WITH INFO
    ====================================
    */

    document.getElementById("exportImageBtn").onclick = () => {

        exportGraphImage(graphRenderer, graphEditor);

    };

    
    /*
    ====================================
    DOWNLOAD SAMPLE JSON
    ====================================
    */

    document.getElementById("downloadSampleJson").onclick = () => {

        const sampleGraph = {

            nodes: [
                { id: 1 },
                { id: 2 },
                { id: 3 },
                { id: 4 }
            ],

            edges: [
                { from: 1, to: 2, weight: 2 },
                { from: 2, to: 3, weight: 3 },
                { from: 3, to: 4, weight: 1 },
                { from: 1, to: 4, weight: 6 }
            ]

        };

        const json = JSON.stringify(sampleGraph, null, 2);

        const blob = new Blob([json], {
            type: "application/json"
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = "sample-graph.json";

        link.click();

    };

    /*
    ====================================
    FILE IMPORT HANDLER
    ====================================
    */

    document
    .getElementById("importFileInput")
    .addEventListener("change", (event) => {

        const file = event.target.files[0];

        if (!file) return;

        importGraph(file, graphManager, graphEditor);

    });

}