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
    EXPORT GRAPH WITH INFO
    ====================================
    */

    document.getElementById("exportImageBtn").onclick = () => {

        const networkCanvas =
            graphRenderer.network.canvas.frame.canvas;

        const graphImage = networkCanvas.toDataURL("image/png");

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const width = networkCanvas.width;
        const height = networkCanvas.height;

        canvas.width = width;
        canvas.height = height + 120;

        const img = new Image();

        img.onload = () => {

            // arka plan
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // başlık
            ctx.fillStyle = "#222";
            ctx.font = "bold 22px Arial";
            ctx.fillText("Dijkstra Visualization", 20, 30);

            // start node
            const startNode = graphEditor.startNode || "Not selected";

            ctx.font = "16px Arial";
            ctx.fillText(`Start Node: ${startNode}`, 20, 60);

            // shortest path bilgisi
            const logItems =
                document.querySelectorAll("#logList li");

            let pathText = "";
            let costText = "";

            logItems.forEach(item => {

                const text = item.innerText;

                if (text.includes("Shortest path")) {
                    pathText = text;
                }

            });

            ctx.fillText(pathText, 20, 85);

            // graph görüntüsünü ekle
            ctx.drawImage(img, 0, 120);

            const link = document.createElement("a");

            link.download = "dijkstra-visualization.png";
            link.href = canvas.toDataURL("image/png");

            link.click();

        };

        img.src = graphImage;

    };

    /*
    ====================================
    EXPORT GRAPH AS JSON
    ====================================
    */

    document.getElementById("exportGraphBtn").onclick = () => {

        const graphData = {

            nodes: graphManager.nodes.map(n => ({
                id: n.id
            })),

            edges: graphManager.edges.map(e => ({
                from: e.from,
                to: e.to,
                weight: e.weight
            }))

        };

        const json = JSON.stringify(graphData, null, 2);

        const blob = new Blob([json], {
            type: "application/json"
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = "graph.json";

        link.click();

        URL.revokeObjectURL(url);

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

        const reader = new FileReader();

        reader.onload = function(e) {

            try {

                const graphData = JSON.parse(e.target.result);

                graphManager.nodes = graphData.nodes.map(n => ({
                    id: n.id,
                    label: String(n.id)
                }));

                graphManager.edges = graphData.edges.map((e, index) => ({
                    id: index + 1,
                    from: e.from,
                    to: e.to,
                    label: String(e.weight),
                    weight: e.weight
                }));

                graphEditor.updateGraph();

            } catch(err) {

                alert("Invalid graph file format.");

            }

        };

        reader.readAsText(file);

    });
}