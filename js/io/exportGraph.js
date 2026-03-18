/*
========================================
Export Graph as JSON
========================================
*/

export function exportGraph(graphManager) {

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

}

/*
========================================
Export Graph Image with Info
========================================
*/

export function exportGraphImage(graphRenderer, graphEditor, algorithm) {

    const networkCanvas =
        graphRenderer.network.canvas.frame.canvas;

    const graphImage = networkCanvas.toDataURL("image/png");

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const width = networkCanvas.width;
    const height = networkCanvas.height;

    canvas.width = width;
    canvas.height = height + 140;

    const img = new Image();

    img.onload = () => {

        // background
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // =========================
        // TITLE
        // =========================
        ctx.fillStyle = "#222";
        ctx.font = "bold 22px Arial";
        ctx.fillText(`${algorithm.toUpperCase()} Visualization`, 20, 30);

        // =========================
        // START NODE (varsa)
        // =========================
        if (algorithm !== "kruskal") {

            const startNode = graphEditor.startNode || "Not selected";

            ctx.font = "16px Arial";
            ctx.fillText(`Start Node: ${startNode}`, 20, 60);
        }

        // =========================
        // LOG INFO
        // =========================
        const logItems =
            document.querySelectorAll("#logList li");

        let infoText = "";

        logItems.forEach(item => {

            const text = item.innerText;

            // Dijkstra & Bellman
            if (text.includes("Shortest path")) {
                infoText = text;
            }

            // Kruskal & Prim
            if (text.includes("MST completed")) {
                infoText = text;
            }

        });

        ctx.font = "16px Arial"; 
        ctx.fillText(infoText, 20, 90);

        // =========================
        // GRAPH DRAW
        // =========================
        ctx.drawImage(img, 0, 120);

        const link = document.createElement("a");

        link.download = `${algorithm}-visualization.png`;
        link.href = canvas.toDataURL("image/png");

        link.click();

    };

    img.src = graphImage;
}