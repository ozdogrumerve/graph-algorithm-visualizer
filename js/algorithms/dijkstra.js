/*
====================================
DIJKSTRA ALGORITHM (STEP GENERATOR)
====================================
*/

function formatDistances(distances, nodes) {

    let result = "dist = [ -, ";

    nodes.forEach((node, index) => {

        const d = distances[node.id];

        if (d === Infinity) {
            result += "∞";
        } else {
            result += d;
        }

        if (index < nodes.length - 1) {
            result += ", ";
        }

    });

    result += " ]";

    return result;
}

export function runDijkstra(graphManager, startNode = 1) {

    const nodes = graphManager.nodes;
    const edges = graphManager.edges;

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
        type: "log",
        message: formatDistances(dist, nodes)
    });

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

        /* sadece forward edges */

        const outgoing = edges.filter(e => e.from === minNode);

        outgoing.forEach(edge => {

            const neighbor = edge.to;

            if (visited[neighbor]) return;

            const weight = Number(edge.weight);
            const newDist = dist[minNode] + weight;

            steps.push({
                type: "relaxEdge",
                edge: edge.id,
                message: `Relax edge ${minNode} → ${neighbor}`
            });

            if (newDist < dist[neighbor]) {

                dist[neighbor] = newDist;
                prev[neighbor] = minNode;

                steps.push({
                    type: "log",
                    message: formatDistances(dist, nodes)
                });

                steps.push({
                    type: "updateDistance",
                    node: neighbor,
                    message: `dist[${neighbor}] = ${newDist}`
                });

            }

        });

    }

    /*
    ============================
    SHORTEST PATH
    ============================
    */

    // en uzak node'u bul (start dışındaki en büyük dist)
    let target = null;
    let maxDist = -Infinity;

    for (let nodeId in dist) {

        const d = dist[nodeId];

        if (d !== Infinity && d > maxDist) {

            maxDist = d;
            target = Number(nodeId);

        }

    }

    // path'i geriye doğru oluştur
    const path = [];
    let current = target;

    while (current !== null) {

        path.unshift(current);
        current = prev[current];

    }

    // edge highlight
    for (let i = 0; i < path.length - 1; i++) {

        const from = path[i];
        const to = path[i + 1];

        const edge = edges.find(
            e => e.from === from && e.to === to
        );

        if (edge) {

            steps.push({
                type: "highlightPath",
                edge: edge.id,
                message: `Path edge ${from} → ${to}`
            });

        }

    }

    steps.push({
        type: "log",
        message: `Shortest path from ${startNode} to ${target}: ${path.join(" → ")} (cost = ${dist[target]})`
    });

    return steps;

}