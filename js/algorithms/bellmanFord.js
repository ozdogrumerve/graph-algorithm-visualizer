/*
====================================
BELLMAN FORD ALGORITHM (STEP GENERATOR)
====================================
*/

function formatDistances(distances, nodes) {

    let result = "dist = [ ";

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

export function bellmanFord(graphManager, startNode, targetNode = null) {

    const nodes = graphManager.nodes;
    const edges = graphManager.edges;

    const steps = [];

    const dist = {};
    const prev = {};

    // INIT
    nodes.forEach(node => {
        dist[node.id] = Infinity;
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

    // RELAXATION
    for (let i = 0; i < nodes.length - 1; i++) {

        steps.push({
            type: "log",
            message: `Iteration ${i + 1}`
        });

        edges.forEach(edge => {

            const from = edge.from;
            const to = edge.to;
            const weight = Number(edge.weight);

            steps.push({
                type: "relaxEdge",
                edge: edge.id,
                message: `Relax edge ${from} → ${to}`
            });

            if (dist[from] !== Infinity && dist[from] + weight < dist[to]) {

                dist[to] = dist[from] + weight;
                prev[to] = from;

                steps.push({
                    type: "log",
                    message: formatDistances(dist, nodes)
                });

                steps.push({
                    type: "updateDistance",
                    node: to,
                    message: `dist[${to}] = ${dist[to]}`
                });
            }

        });
    }

    // NEGATIVE CYCLE CHECK
    let hasNegativeCycle = false;

    edges.forEach(edge => {

        const from = edge.from;
        const to = edge.to;
        const weight = parseFloat(edge.weight);

        if (dist[from] !== Infinity && dist[from] + weight < dist[to]) {
            hasNegativeCycle = true;

            steps.push({
                type: "log",
                message: "⚠ Negative cycle detected!"
            });
        }
    });

    // ============================
    // SHORTEST PATH (Dijkstra gibi)
    // ============================
    if (targetNode !== null && targetNode !== startNode) {

        if (dist[targetNode] === Infinity) {

            steps.push({
                type: "log",
                message: `Target node ${targetNode} is unreachable`
            });

        } else {

            const path = [];
            let current = targetNode;

            while (current !== null) {
                path.unshift(current);
                current = prev[current];
            }

            for (let i = 0; i < path.length - 1; i++) {

                const from = path[i];
                const to = path[i + 1];

                const edge = edges.find(e => e.from === from && e.to === to);

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
                message: `Shortest path: ${path.join(" → ")} (cost = ${dist[targetNode]})`
            });
        }
    } else if (targetNode === null) {

        steps.push({
            type: "log",
            message: `All shortest distances from node ${startNode} calculated. No specific target selected.`
        });
    }

    return {
        steps,
        hasNegativeCycle
    };
}