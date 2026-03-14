/*
========================================
Import Graph from JSON
========================================
*/

export function importGraph(file, graphManager, graphEditor) {

    const reader = new FileReader();

    reader.onload = function(e) {

        try {

            const graphData = JSON.parse(e.target.result);

            graphManager.nodes = graphData.nodes.map(n => ({
                id: n.id,
                label: String(n.id)
            }));

            graphManager.edges = graphData.edges.map((edge, index) => ({
                id: index + 1,
                from: edge.from,
                to: edge.to,
                label: String(edge.weight),
                weight: edge.weight
            }));

            graphManager.nodeIdCounter =
                graphManager.nodes.length
                    ? Math.max(...graphManager.nodes.map(n => n.id)) + 1
                    : 1;

            graphEditor.updateGraph();

        } catch (err) {

            alert("Invalid graph file format.");

        }

    };

    reader.readAsText(file);

}
