/*
====================================
DIJKSTRA ALGORITHM (STEP GENERATOR)
====================================
*/

export function runDijkstra(graphManager, startNode = 1) {

    const nodes = graphManager.nodes;
    const steps = [];

    const dist = {};
    const visited = {};
    const prev = {};

    // başlangıç değerleri
    nodes.forEach(node => {

        dist[node.id] = Infinity;
        visited[node.id] = false;
        prev[node.id] = null;

    });

    dist[startNode] = 0;

    steps.push({
        type: "visitNode",
        node: startNode,
        message: `Start at node ${startNode}`
    });

    while (true) {

        // minimum distance node bul
        let minNode = null;
        let minDist = Infinity;

        for (let nodeId in dist) {

            if (!visited[nodeId] && dist[nodeId] < minDist) {

                minDist = dist[nodeId];
                minNode = Number(nodeId);

            }
        }

        if (minNode === null) break;

        visited[minNode] = true;

        steps.push({
            type: "visitNode",
            node: minNode,
            message: `Visit node ${minNode}`
        });

        const neighbors = graphManager.getNeighbors(minNode);

        neighbors.forEach(neighbor => {

            if (visited[neighbor.node]) return;

            const weight = Number(neighbor.weight);
            const newDist = dist[minNode] + weight;

            const edge = graphManager.edges.find(
                e => e.from === minNode && e.to === neighbor.node
            );

            const edgeId = edge ? edge.id : null;

            steps.push({
                type: "relaxEdge",
                edge: edgeId,
                message: `Relax edge ${minNode} → ${neighbor.node}`
            });

            if (newDist < dist[neighbor.node]) {

                dist[neighbor.node] = newDist;
                prev[neighbor.node] = minNode;

                steps.push({
                    type: "updateDistance",
                    node: neighbor.node,
                    message: `dist[${neighbor.node}] = ${newDist}`
                });

            }

        });

    }

    /*
    ============================
    SHORTEST PATH TREE HIGHLIGHT
    ============================
    */

    for (let nodeId in prev) {

        const parent = prev[nodeId];

        if (parent !== null) {

            const edge = graphManager.edges.find(
                e => e.from === parent && e.to === Number(nodeId)
            );

            if (edge) {

                steps.push({
                    type: "highlightPath",
                    edge: edge.id,
                    message: `Shortest path edge ${parent} → ${nodeId}`
                });

            }
        }
    }

    return steps;

}